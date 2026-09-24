from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from apps.api.domain.schemas import ObservationSchema, StationSchema, DataHealthSchema

class CanonicalDataInterface(ABC):
    """
    Abstract interface for environmental data ingestion.
    Both ProductionConduitAdapter and DemoConduitAdapter implement this interface
    ensuring 100% architectural parity between live and demo modes (Requirement #50).
    """

    @abstractmethod
    async def get_stations(self) -> List[StationSchema]:
        """Fetch all weather stations across the monitoring network."""
        pass

    @abstractmethod
    async def get_station_details(self, station_id: int) -> Optional[StationSchema]:
        """Fetch metadata for a specific station."""
        pass

    @abstractmethod
    async def get_latest_observation(self, station_id: int) -> Optional[ObservationSchema]:
        """Fetch the most recent canonical observation for a station."""
        pass

    @abstractmethod
    async def get_observation_history(
        self, station_id: int, limit: int = 100
    ) -> List[ObservationSchema]:
        """Fetch time-series observations for a station."""
        pass

    @abstractmethod
    async def get_data_health(self, station_id: int) -> DataHealthSchema:
        """Compute live data health score, completeness, freshness, and consistency."""
        pass
