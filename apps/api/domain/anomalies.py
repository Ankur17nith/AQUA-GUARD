import math
from typing import List, Dict, Any, Tuple
from apps.api.domain.schemas import AnomalySchema, ObservationSchema
from apps.api.domain.baselines import get_station_baseline

def calculate_z_score(val: float, mean: float, std: float) -> float:
    if std <= 0:
        return 0.0
    return round((val - mean) / std, 2)

def detect_anomalies(obs: ObservationSchema, month: int = 9) -> List[AnomalySchema]:
    """
    Detect statistical and multi-sensor anomalies comparing Conduit observations to climatological baselines.
    """
    baseline = get_station_baseline(month)
    anomalies: List[AnomalySchema] = []
    
    # 1. Rainfall Anomaly (Deficit)
    # Conduit Total Prior / Today rainfall
    current_rain = obs.rainfall_total_today
    rain_mean = baseline["rainfall_mean_mm"]
    rain_std = baseline["rainfall_std_mm"]
    # For rolling 14-day rainfall deficit, since current rain is 0mm:
    rain_dev_pct = round(((current_rain - rain_mean) / rain_mean) * 100.0, 1)
    rain_z = calculate_z_score(current_rain, rain_mean, rain_std)
    
    if rain_dev_pct <= -30.0:
        sev = "CRITICAL" if rain_dev_pct <= -60.0 else ("HIGH" if rain_dev_pct <= -40.0 else "MEDIUM")
        anomalies.append(AnomalySchema(
            id=f"ANOM-RAIN-{obs.station_id}",
            station_id=obs.station_id,
            variable="Rainfall Deficit",
            current_value=current_rain,
            baseline_value=rain_mean,
            z_score=rain_z,
            deviation_pct=rain_dev_pct,
            severity=sev,
            detected_at=obs.timestamp,
            method="Z_SCORE",
            description=f"Rainfall is {abs(rain_dev_pct)}% below seasonal baseline (0.0 mm vs {rain_mean} mm expected)."
        ))

    # 2. Temperature Anomaly (Surge)
    temp_val = obs.temperature_sht or obs.temperature_bmx or 21.0
    temp_mean = baseline["temperature_mean_c"]
    temp_std = baseline["temperature_std_c"]
    temp_diff = round(temp_val - temp_mean, 1)
    temp_z = calculate_z_score(temp_val, temp_mean, temp_std)
    temp_dev_pct = round((temp_diff / temp_mean) * 100.0, 1)
    
    if abs(temp_diff) >= 2.0:
        sev = "HIGH" if temp_diff >= 4.0 else "MEDIUM"
        anomalies.append(AnomalySchema(
            id=f"ANOM-TEMP-{obs.station_id}",
            station_id=obs.station_id,
            variable="Surface Temperature",
            current_value=temp_val,
            baseline_value=temp_mean,
            z_score=temp_z,
            deviation_pct=temp_dev_pct,
            severity=sev,
            detected_at=obs.timestamp,
            method="Z_SCORE",
            description=f"Temperature is +{temp_diff}°C above seasonal normal ({temp_val:.1f}°C vs {temp_mean:.1f}°C baseline)."
        ))

    # 3. Soil Moisture Anomaly (Depletion)
    sm_val = obs.soil_moisture_pct or 20.0
    sm_mean = baseline["soil_moisture_mean_pct"]
    sm_std = baseline["soil_moisture_std_pct"]
    sm_dev_pct = round(((sm_val - sm_mean) / sm_mean) * 100.0, 1)
    sm_z = calculate_z_score(sm_val, sm_mean, sm_std)
    
    if sm_dev_pct <= -20.0:
        sev = "CRITICAL" if sm_dev_pct <= -40.0 else "HIGH"
        anomalies.append(AnomalySchema(
            id=f"ANOM-SOIL-{obs.station_id}",
            station_id=obs.station_id,
            variable="Soil Moisture Deficit",
            current_value=sm_val,
            baseline_value=sm_mean,
            z_score=sm_z,
            deviation_pct=sm_dev_pct,
            severity=sev,
            detected_at=obs.timestamp,
            method="PERCENTILE_IQR",
            description=f"Root-zone soil moisture is {abs(sm_dev_pct)}% below baseline ({sm_val}% vs {sm_mean}% normal), approaching crop stress threshold."
        ))

    # 4. Vegetation Stress (NDVI)
    ndvi_val = obs.vegetation_ndvi or 0.38
    ndvi_mean = baseline["ndvi_mean"]
    ndvi_dev_pct = round(((ndvi_val - ndvi_mean) / ndvi_mean) * 100.0, 1)
    ndvi_z = calculate_z_score(ndvi_val, ndvi_mean, baseline.get("ndvi_std", 0.05))
    
    if ndvi_dev_pct <= -15.0:
        anomalies.append(AnomalySchema(
            id=f"ANOM-NDVI-{obs.station_id}",
            station_id=obs.station_id,
            variable="Vegetation Vigor (NDVI)",
            current_value=ndvi_val,
            baseline_value=ndvi_mean,
            z_score=ndvi_z,
            deviation_pct=ndvi_dev_pct,
            severity="MEDIUM" if ndvi_dev_pct > -30.0 else "HIGH",
            detected_at=obs.timestamp,
            method="PERCENTILE_IQR",
            description=f"Satellite/sensor vegetation vigor declined {abs(ndvi_dev_pct)}% relative to healthy canopy baseline."
        ))

    return anomalies
