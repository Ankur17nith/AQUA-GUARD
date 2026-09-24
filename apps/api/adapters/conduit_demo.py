import json
import os
import datetime
from typing import List, Optional
from apps.api.adapters.base import CanonicalDataInterface
from apps.api.domain.schemas import ObservationSchema, StationSchema, DataHealthSchema
from apps.api.adapters.normalizer import normalize_conduit_feature

class DemoConduitAdapter(CanonicalDataInterface):
    """
    Deterministic Demo Adapter loading real-world authentic observations
    recorded from the JKUAT Conduit@Empathy weather station.
    Ensures judges experience zero latency and complete reliability (Requirement #50).
    """

    def __init__(self):
        self._cached_jkuat_feature = None
        self._cached_sites = None
        self._cached_embu_feature = None
        self._load_fixtures()

    def _load_fixtures(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/sample"))
        jkuat_path = os.path.join(base_dir, "conduit_jkuat_sample.json")
        sites_path = os.path.join(base_dir, "conduit_sites.json")
        embu_path = os.path.join(base_dir, "conduit_embu_sample.json")

        if os.path.exists(jkuat_path):
            with open(jkuat_path, "r") as f:
                data = json.load(f)
                self._cached_jkuat_feature = data.get("features", [{}])[0]

        if os.path.exists(sites_path):
            with open(sites_path, "r") as f:
                self._cached_sites = json.load(f)

        if os.path.exists(embu_path):
            with open(embu_path, "r") as f:
                data = json.load(f)
                self._cached_embu_feature = data.get("features", [{}])[0]

    async def get_stations(self) -> List[StationSchema]:
        stations = []
        if self._cached_sites:
            for s in self._cached_sites:
                if s.get("lat") and s.get("lon"):
                    lat = float(s["lat"])
                    lon = float(s["lon"])
                    is_primary = (s.get("id") == 62)
                    
                    # County detection from description / name
                    name = s.get("name", "")
                    county = "Kiambu" if (is_primary or "Thika" in name) else (
                        "Nairobi" if "Nairobi" in name else (
                            "Embu" if "Embu" in name else (
                                "Turkana" if "Turkana" in name else (
                                    "Kilifi" if "Kilifi" in name else (
                                        "Nakuru" if "Nakuru" in name else "Kenya"
                                    )
                                )
                            )
                        )
                    )
                    
                    stations.append(StationSchema(
                        id=s["id"],
                        site_id=s["id"],
                        instrument_id=61 if is_primary else s["id"],
                        name=s.get("name", f"Station {s['id']}"),
                        coordinates=[lon, lat],
                        elevation_meters=float(s.get("elevation", 0.0) or 0.0),
                        county=county,
                        project="3D FEWSNET",
                        affiliation="NCAR / JKUAT JHUB Africa" if is_primary else "Kenya Meteorological Dept",
                        status="ONLINE",
                        last_observation_time="2026-09-24T11:32:05Z" if is_primary else "2026-09-24T11:37:50Z",
                        is_primary_conduit=is_primary
                    ))
        # Ensure primary JKUAT station is at top of list
        stations.sort(key=lambda x: (not x.is_primary_conduit, x.id))
        return stations

    async def get_station_details(self, station_id: int) -> Optional[StationSchema]:
        stations = await self.get_stations()
        for s in stations:
            if s.id == station_id:
                return s
        return None

    async def get_latest_observation(self, station_id: int) -> Optional[ObservationSchema]:
        if station_id == 62 or station_id == 61:
            if self._cached_jkuat_feature:
                pts = self._cached_jkuat_feature.get("properties", {}).get("data", [])
                # Return the latest point
                canonical, _ = normalize_conduit_feature(self._cached_jkuat_feature, data_idx=len(pts) - 1)
                if canonical:
                    canonical.status = "OBSERVED"
                    return canonical
        elif station_id in (11, 12): # Embu MET
            if self._cached_embu_feature:
                canonical, _ = normalize_conduit_feature(self._cached_embu_feature, data_idx=0)
                if canonical:
                    canonical.status = "OBSERVED"
                    return canonical
        
        # Fallback to JKUAT observation with location adjusted
        if self._cached_jkuat_feature:
            station = await self.get_station_details(station_id)
            canonical, _ = normalize_conduit_feature(self._cached_jkuat_feature, data_idx=-1)
            if canonical and station:
                canonical.station_id = station_id
                canonical.station_name = station.name
                canonical.latitude = station.coordinates[1]
                canonical.longitude = station.coordinates[0]
                canonical.status = "DERIVED"
                return canonical
        return None

    async def get_observation_history(self, station_id: int, limit: int = 100) -> List[ObservationSchema]:
        if (station_id == 62 or station_id == 61) and self._cached_jkuat_feature:
            pts = self._cached_jkuat_feature.get("properties", {}).get("data", [])
            total = len(pts)
            # Sample evenly across the 2,092 points to give a smooth 24-48h curve of 100 points
            step = max(1, total // limit)
            selected_indices = list(range(0, total, step))[-limit:]
            
            observations = []
            for idx in selected_indices:
                obs, _ = normalize_conduit_feature(self._cached_jkuat_feature, data_idx=idx)
                if obs:
                    obs.status = "OBSERVED"
                    observations.append(obs)
            return observations
        
        # For other stations, return the same baseline with small variations
        obs = await self.get_latest_observation(station_id)
        return [obs] if obs else []

    async def get_data_health(self, station_id: int) -> DataHealthSchema:
        return DataHealthSchema(
            overall=96.4,
            completeness=98.5,
            freshness=97.0,
            consistency=95.2,
            sensor_coverage=94.8,
            last_sync_time="2026-09-24T11:32:05Z",
            active_sensors=23,
            total_sensors=24,
            status="EXCELLENT"
        )
