import asyncio
import json
import os
import sys

# Ensure root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select, delete
from apps.api.core.database import AsyncSessionLocal, init_db
from apps.api.domain.models import StationModel, ObservationModel, BaselineModel, AlertModel, ActionRecommendationModel
from apps.api.adapters.normalizer import normalize_conduit_feature

async def seed():
    print("🌱 Initializing AQUA//GUARD database...")
    await init_db()
    
    async with AsyncSessionLocal() as session:
        # 1. Load stations
        sites_path = "data/sample/conduit_sites.json"
        if os.path.exists(sites_path):
            with open(sites_path, "r") as f:
                sites = json.load(f)
            
            print(f"Loading {len(sites)} stations...")
            for s in sites:
                if not s.get("lat") or not s.get("lon"):
                    continue
                sid = s["id"]
                is_primary = (sid == 62)
                existing = await session.execute(select(StationModel).where(StationModel.id == sid))
                if not existing.scalar_one_or_none():
                    name = s.get("name", f"Station {sid}")
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
                    station_obj = StationModel(
                        id=sid,
                        site_id=sid,
                        instrument_id=61 if is_primary else sid,
                        name=name,
                        latitude=float(s["lat"]),
                        longitude=float(s["lon"]),
                        elevation_meters=float(s.get("elevation", 0.0) or 0.0),
                        county=county,
                        project="3D FEWSNET",
                        affiliation="NCAR / JKUAT JHUB Africa" if is_primary else "Kenya Meteorological Dept",
                        status="ONLINE",
                        last_observation_time="2026-09-24T11:32:05Z" if is_primary else "2026-09-24T11:37:50Z",
                        is_primary_conduit=is_primary
                    )
                    session.add(station_obj)
            await session.commit()
            print("✅ Stations seeded.")

        # 2. Seed JKUAT observations
        jkuat_path = "data/sample/conduit_jkuat_sample.json"
        if os.path.exists(jkuat_path):
            with open(jkuat_path, "r") as f:
                jkuat_data = json.load(f)
            feat = jkuat_data.get("features", [{}])[0]
            points = feat.get("properties", {}).get("data", [])
            print(f"Seeding Conduit@Empathy time-series ({len(points)} observations)...")
            
            # Delete existing to prevent duplicate inflation
            await session.execute(delete(ObservationModel).where(ObservationModel.station_id == 62))
            
            # Sample evenly to store 150 representative high-res points in DB for instant querying
            step = max(1, len(points) // 150)
            obs_batch = []
            for idx in range(0, len(points), step):
                canonical, _ = normalize_conduit_feature(feat, data_idx=idx)
                if canonical:
                    obs_batch.append(ObservationModel(
                        station_id=62,
                        timestamp=canonical.timestamp,
                        rainfall_gauge1=canonical.rainfall_gauge1,
                        rainfall_gauge2=canonical.rainfall_gauge2,
                        rainfall_total_today=canonical.rainfall_total_today,
                        rainfall_total_prior=canonical.rainfall_total_prior,
                        temperature_bmx=canonical.temperature_bmx,
                        temperature_mcp=canonical.temperature_mcp,
                        temperature_sht=canonical.temperature_sht,
                        wet_bulb_temp=canonical.wet_bulb_temp,
                        wet_bulb_globe_temp=canonical.wet_bulb_globe_temp,
                        heat_index=canonical.heat_index,
                        pressure_hpa=canonical.pressure_hpa,
                        relative_humidity_pct=canonical.relative_humidity_pct,
                        solar_visible=canonical.solar_visible,
                        solar_infrared=canonical.solar_infrared,
                        solar_uv=canonical.solar_uv,
                        wind_speed=canonical.wind_speed,
                        wind_direction=canonical.wind_direction,
                        wind_gust=canonical.wind_gust,
                        soil_moisture_pct=canonical.soil_moisture_pct,
                        vegetation_ndvi=canonical.vegetation_ndvi,
                        evapotranspiration_mm=canonical.evapotranspiration_mm,
                        source="CONDUIT_3DPAWS",
                        status="OBSERVED",
                        quality=canonical.quality
                    ))
            session.add_all(obs_batch)
            await session.commit()
            print(f"✅ {len(obs_batch)} Conduit observations seeded.")

        # 3. Seed Baselines
        await session.execute(delete(BaselineModel))
        baseline_obj = BaselineModel(
            station_id=62,
            month=9,
            rainfall_mean_mm=42.5,
            rainfall_std_mm=11.2,
            temperature_mean_c=21.8,
            temperature_std_c=2.4,
            soil_moisture_mean_pct=33.5,
            soil_moisture_std_pct=4.8,
            humidity_mean_pct=67.0,
            ndvi_mean=0.46
        )
        session.add(baseline_obj)
        await session.commit()
        print("✅ Climatological baselines seeded.")

    print("🎉 Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
