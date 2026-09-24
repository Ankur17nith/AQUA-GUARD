from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field

class StationSchema(BaseModel):
    id: int
    site_id: int
    instrument_id: int
    name: str
    coordinates: List[float] # [lon, lat]
    elevation_meters: float
    county: str
    project: str
    affiliation: str
    status: str
    last_observation_time: Optional[str] = None
    is_primary_conduit: bool = False

class ObservationSchema(BaseModel):
    id: Optional[int] = None
    station_id: int
    station_name: Optional[str] = None
    timestamp: str
    latitude: float
    longitude: float
    
    rainfall_gauge1: float = 0.0
    rainfall_gauge2: float = 0.0
    rainfall_total_today: float = 0.0
    rainfall_total_prior: float = 0.0
    
    temperature_bmx: Optional[float] = None
    temperature_mcp: Optional[float] = None
    temperature_sht: Optional[float] = None
    wet_bulb_temp: Optional[float] = None
    wet_bulb_globe_temp: Optional[float] = None
    heat_index: Optional[float] = None
    
    pressure_hpa: Optional[float] = None
    relative_humidity_pct: Optional[float] = None
    
    solar_visible: float = 0.0
    solar_infrared: float = 0.0
    solar_uv: float = 0.0
    
    wind_speed: float = 0.0
    wind_direction: float = 0.0
    wind_gust: float = 0.0
    
    soil_moisture_pct: Optional[float] = None
    vegetation_ndvi: Optional[float] = None
    evapotranspiration_mm: float = 0.0
    
    battery_charge_status: int = 3
    cell_signal_strength: float = 100.0
    source: str = "CONDUIT_3DPAWS"
    status: str = "OBSERVED"
    quality: str = "VALID"

class DataHealthSchema(BaseModel):
    overall: float
    completeness: float
    freshness: float
    consistency: float
    sensor_coverage: float
    last_sync_time: str
    active_sensors: int
    total_sensors: int
    status: str

class EnvironmentalStateVectorSchema(BaseModel):
    timestamp: str
    station_id: int
    station_name: str
    
    rainfall_current_mm: float
    rainfall_baseline_mm: float
    rainfall_anomaly_pct: float
    
    temperature_current_c: float
    temperature_baseline_c: float
    temperature_anomaly_c: float
    
    soil_moisture_current_pct: float
    soil_moisture_baseline_pct: float
    soil_moisture_anomaly_pct: float
    
    humidity_current_pct: float
    humidity_baseline_pct: float
    
    vegetation_current_ndvi: float
    vegetation_baseline_ndvi: float
    vegetation_anomaly_pct: float
    
    evapotranspiration_mm_day: float
    water_balance_deficit_mm: float
    
    confidence: float
    data_health: DataHealthSchema

class AnomalySchema(BaseModel):
    id: str
    station_id: int
    variable: str
    current_value: float
    baseline_value: float
    z_score: float
    deviation_pct: float
    severity: str
    detected_at: str
    method: str
    description: str

class CompoundEventSchema(BaseModel):
    id: str
    type: str
    title: str
    severity: str
    confidence: float
    detected_at: str
    contributing_factors: List[Dict[str, Any]]
    description: str
    evidence: List[str]

class RiskDriverSchema(BaseModel):
    factor: str
    current_value: Union[float, str]
    baseline_value: Union[float, str]
    deviation: str
    weight_pct: float
    contribution_pct: float
    status: str

class RiskAssessmentSchema(BaseModel):
    category: str
    probability_pct: float
    severity: str
    confidence_pct: float
    horizon: str
    drivers: List[RiskDriverSchema]
    evidence: List[str]
    affected_area: Dict[str, Any]
    recommended_actions_count: int
    model_version: str
    generated_at: str
    why_explanation: List[str]

class ForecastPointSchema(BaseModel):
    horizon: str
    timestamp: str
    rainfall_expected_mm: float
    rainfall_lower_mm: float
    rainfall_upper_mm: float
    temperature_expected_c: float
    temperature_lower_c: float
    temperature_upper_c: float
    soil_moisture_expected_pct: float
    soil_moisture_lower_pct: float
    soil_moisture_upper_pct: float
    drought_probability_pct: float
    confidence_pct: float

class ScenarioRequestSchema(BaseModel):
    scenario_name: Optional[str] = "Custom Simulation"
    rainfall_delta_pct: float = -30.0
    temperature_delta_c: float = 2.0
    horizon_days: int = 14
    initial_soil_moisture_pct: Optional[float] = None
    station_id: Optional[int] = None

class ScenarioResultSchema(BaseModel):
    id: str
    parameters: ScenarioRequestSchema
    current_metrics: Dict[str, float]
    projected_metrics: Dict[str, float]
    delta_metrics: Dict[str, float]
    impact_assessment: Dict[str, str]
    explanation: str
    generated_at: str
    status: str = "SIMULATED"

class ActionRecommendationSchema(BaseModel):
    id: str
    station_id: int
    title: str
    urgency: str
    category: str
    reason: str
    evidence: List[str]
    expected_effect: str
    avoided_loss_estimate: str
    confidence: float
    target_sector: str
    status: str

class AlertSchema(BaseModel):
    id: str
    station_id: int
    station_name: str
    title: str
    category: str
    severity: str
    detected_at: str
    message: str
    recommended_action: str
    status: str

class CopilotQueryRequest(BaseModel):
    query: str
    station_id: Optional[int] = None
    context_horizon: Optional[str] = "14_DAYS"

class CopilotQueryResponse(BaseModel):
    answer: str
    grounding_data: Dict[str, Any]
    evidence: List[Dict[str, str]]
    suggested_actions: List[str]
    recommended_scenario: Optional[ScenarioRequestSchema] = None
    generated_at: str
