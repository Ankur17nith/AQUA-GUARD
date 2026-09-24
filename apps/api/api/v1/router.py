import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Body

from apps.api.adapters import get_conduit_adapter, set_adapter_mode
from apps.api.core.config import settings
from apps.api.domain.schemas import (
    StationSchema,
    ObservationSchema,
    EnvironmentalStateVectorSchema,
    AnomalySchema,
    CompoundEventSchema,
    RiskAssessmentSchema,
    ForecastPointSchema,
    ScenarioRequestSchema,
    ScenarioResultSchema,
    ActionRecommendationSchema,
    AlertSchema,
    CopilotQueryRequest,
    CopilotQueryResponse,
    DataHealthSchema
)
from apps.api.domain.baselines import get_station_baseline
from apps.api.domain.anomalies import detect_anomalies
from apps.api.domain.compound import detect_compound_events
from apps.api.domain.risk import calculate_climate_risks
from apps.api.domain.forecast import generate_forecast_timeline
from apps.api.domain.scenarios import simulate_climate_scenario
from apps.api.domain.actions import generate_action_recommendations
from apps.api.domain.alerts import sync_alerts_from_events, update_alert_status
from apps.api.domain.copilot import answer_copilot_query

api_router = APIRouter()

@api_router.get("/health")
async def v1_health():
    return {
        "status": "HEALTHY",
        "service": "aquaguard-api",
        "mode": settings.AQUAGUARD_MODE,
        "conduit_connected": True
    }

# -------------------------------------------------------------
# 1. Stations
# -------------------------------------------------------------
@api_router.get("/stations", response_model=List[StationSchema])
async def list_stations():
    adapter = get_conduit_adapter()
    return await adapter.get_stations()

@api_router.get("/stations/{station_id}", response_model=StationSchema)
async def get_station(station_id: int):
    adapter = get_conduit_adapter()
    station = await adapter.get_station_details(station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station

@api_router.get("/stations/{station_id}/digital-twin")
async def get_station_digital_twin(station_id: int):
    adapter = get_conduit_adapter()
    station = await adapter.get_station_details(station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        raise HTTPException(status_code=404, detail="No observations for station")
    anomalies = detect_anomalies(obs)
    compound = detect_compound_events(obs, anomalies)
    risks = calculate_climate_risks(obs, anomalies)
    forecast = generate_forecast_timeline(obs)
    actions = generate_action_recommendations(risks, obs)
    alerts = sync_alerts_from_events(obs, compound, risks)
    health = await adapter.get_data_health(station_id)
    baseline = get_station_baseline(9)

    return {
        "station": station,
        "latest_observation": obs,
        "climatological_baseline": baseline,
        "data_health": health,
        "anomalies": anomalies,
        "compound_events": compound,
        "risks": risks,
        "forecast_14d": forecast,
        "recommended_actions": actions,
        "active_alerts": alerts,
        "twin_status": "ACTIVE_SYNCHRONIZED",
        "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

# -------------------------------------------------------------
# 2. Environmental State & Observations
# -------------------------------------------------------------
@api_router.get("/environment/current", response_model=EnvironmentalStateVectorSchema)
async def get_current_environment(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        raise HTTPException(status_code=404, detail="No observations for station")
        
    baseline = get_station_baseline(9)
    rain_base = baseline["rainfall_mean_mm"]
    temp_base = baseline["temperature_mean_c"]
    sm_base = baseline["soil_moisture_mean_pct"]
    ndvi_base = baseline["ndvi_mean"]
    
    current_temp = obs.temperature_sht or obs.temperature_bmx or temp_base
    current_sm = obs.soil_moisture_pct or 20.0
    current_ndvi = obs.vegetation_ndvi or 0.38
    
    health = await adapter.get_data_health(station_id)
    
    return EnvironmentalStateVectorSchema(
        timestamp=obs.timestamp,
        station_id=obs.station_id,
        station_name=obs.station_name,
        rainfall_current_mm=obs.rainfall_total_today,
        rainfall_baseline_mm=rain_base,
        rainfall_anomaly_pct=round(((obs.rainfall_total_today - rain_base) / rain_base) * 100.0, 1),
        temperature_current_c=current_temp,
        temperature_baseline_c=temp_base,
        temperature_anomaly_c=round(current_temp - temp_base, 1),
        soil_moisture_current_pct=current_sm,
        soil_moisture_baseline_pct=sm_base,
        soil_moisture_anomaly_pct=round(((current_sm - sm_base) / sm_base) * 100.0, 1),
        humidity_current_pct=obs.relative_humidity_pct or 50.0,
        humidity_baseline_pct=baseline["humidity_mean_pct"],
        vegetation_current_ndvi=current_ndvi,
        vegetation_baseline_ndvi=ndvi_base,
        vegetation_anomaly_pct=round(((current_ndvi - ndvi_base) / ndvi_base) * 100.0, 1),
        evapotranspiration_mm_day=obs.evapotranspiration_mm,
        water_balance_deficit_mm=round(obs.rainfall_total_today - obs.evapotranspiration_mm, 2),
        confidence=0.88,
        data_health=health
    )

@api_router.get("/environment/history", response_model=List[ObservationSchema])
async def get_environment_history(station_id: int = Query(62), limit: int = Query(100)):
    adapter = get_conduit_adapter()
    return await adapter.get_observation_history(station_id, limit=limit)

# -------------------------------------------------------------
# 3. Anomalies & Compound Events
# -------------------------------------------------------------
@api_router.get("/anomalies", response_model=List[AnomalySchema])
async def list_anomalies(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        return []
    return detect_anomalies(obs)

@api_router.get("/compound-events", response_model=List[CompoundEventSchema])
async def list_compound_events(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        return []
    anomalies = detect_anomalies(obs)
    return detect_compound_events(obs, anomalies)

# -------------------------------------------------------------
# 4. Risk Intelligence Engine
# -------------------------------------------------------------
@api_router.get("/risk/current", response_model=List[RiskAssessmentSchema])
async def get_current_risks(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        return []
    anomalies = detect_anomalies(obs)
    return calculate_climate_risks(obs, anomalies)

# -------------------------------------------------------------
# 5. Forecast Timeline
# -------------------------------------------------------------
@api_router.get("/forecast", response_model=List[ForecastPointSchema])
async def get_forecast(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        return []
    return generate_forecast_timeline(obs)

# -------------------------------------------------------------
# 6. Climate Scenario Lab (Digital Twin)
# -------------------------------------------------------------
_scenario_cache = {}

@api_router.post("/scenarios/simulate", response_model=ScenarioResultSchema)
@api_router.post("/scenarios", response_model=ScenarioResultSchema)
async def run_scenario(req: ScenarioRequestSchema):
    adapter = get_conduit_adapter()
    station_id = req.station_id or 62
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        raise HTTPException(status_code=404, detail="Station observation not available")
    result = simulate_climate_scenario(req, obs)
    _scenario_cache[result.id] = result
    return result

@api_router.get("/scenarios/{scenario_id}", response_model=ScenarioResultSchema)
async def get_scenario(scenario_id: str):
    if scenario_id in _scenario_cache:
        return _scenario_cache[scenario_id]
    raise HTTPException(status_code=404, detail="Scenario not found")

# -------------------------------------------------------------
# 7. Action Engine
# -------------------------------------------------------------
@api_router.get("/actions", response_model=List[ActionRecommendationSchema])
async def list_actions(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        return []
    anomalies = detect_anomalies(obs)
    risks = calculate_climate_risks(obs, anomalies)
    return generate_action_recommendations(risks, obs)

# -------------------------------------------------------------
# 8. Alert Center
# -------------------------------------------------------------
@api_router.get("/alerts", response_model=List[AlertSchema])
async def list_alerts(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    obs = await adapter.get_latest_observation(station_id)
    if not obs:
        return []
    anomalies = detect_anomalies(obs)
    events = detect_compound_events(obs, anomalies)
    risks = calculate_climate_risks(obs, anomalies)
    return sync_alerts_from_events(obs, events, risks)

@api_router.post("/alerts/{alert_id}/status")
async def change_alert_status(alert_id: str, status: str = Body(..., embed=True)):
    if update_alert_status(alert_id, status):
        return {"status": "SUCCESS", "alert_id": alert_id, "new_status": status}
    raise HTTPException(status_code=404, detail="Alert not found")

# -------------------------------------------------------------
# 9. Guardian AI Copilot
# -------------------------------------------------------------
@api_router.post("/copilot/query", response_model=CopilotQueryResponse)
async def query_copilot(req: CopilotQueryRequest):
    return await answer_copilot_query(req)

# -------------------------------------------------------------
# 10. Data Observatory & System Health
# -------------------------------------------------------------
@api_router.get("/data-sources")
async def get_data_sources(station_id: int = Query(62)):
    adapter = get_conduit_adapter()
    health = await adapter.get_data_health(station_id)
    return {
        "primary": {
            "name": "Conduit@Empathy (3D-PAWS FEWSNET)",
            "provider": "JKUAT JHUB Africa / NCAR",
            "station": "Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1 (Site 62, Inst 61)",
            "status": "CONNECTED",
            "mode": settings.AQUAGUARD_MODE,
            "frequency": "1-minute real-time telemetry",
            "variables": [
                "Rainfall Gauges 1 & 2 (mm)",
                "BMX / MCP / SHT Ambient Temperature (°C)",
                "Wet Bulb & Wet Bulb Globe Temperature (°C)",
                "Barometric Air Pressure (hPa)",
                "Relative Humidity (%)",
                "Solar Visible, Infrared & UV Irradiance (#)",
                "Wind Speed & Direction (m/s, deg)",
                "System Health & Battery Diagnostics"
            ],
            "health": health
        },
        "secondary": [
            {
                "name": "Copernicus Sentinel-2 & Sentinel-1",
                "use": "Vegetation vigor (NDVI) & surface soil moisture radar calibration",
                "spatial_resolution": "10-20 meters",
                "status": "ACTIVE_FUSED"
            },
            {
                "name": "Open-Meteo High-Resolution Ensemble",
                "use": "14-day synoptic weather & temperature forecast",
                "spatial_resolution": "1.5 - 5 km",
                "status": "ACTIVE_FUSED"
            },
            {
                "name": "CHIRPS & ERA5 30-Year Climatology",
                "use": "Seasonal historical baseline & percentile anomaly normalization",
                "spatial_resolution": "5 km",
                "status": "CALIBRATED"
            }
        ]
    }

@api_router.get("/system/health")
async def get_system_health():
    return {
        "status": "HEALTHY",
        "conduit": "CONNECTED",
        "database": "HEALTHY",
        "ml_engine": "READY",
        "mode": settings.AQUAGUARD_MODE,
        "version": settings.VERSION,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@api_router.post("/system/mode")
async def set_system_mode(mode: str = Query(..., pattern="^(LIVE|DEMO)$")):
    set_adapter_mode(mode)
    return {"status": "SUCCESS", "new_mode": mode}
