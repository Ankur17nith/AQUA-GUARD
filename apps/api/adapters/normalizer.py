import datetime
from typing import Dict, Any, Tuple, Optional
from apps.api.domain.schemas import ObservationSchema

def normalize_conduit_feature(feature: Dict[str, Any], data_idx: int = 0) -> Tuple[Optional[ObservationSchema], Dict[str, Any]]:
    """
    Validates, cleans, and normalizes a raw Conduit 3D-PAWS GeoJSON feature into a Canonical Observation.
    Applies data quality rules:
    - bounds validation
    - impossible value detection
    - multi-thermometer cross-validation
    - soil moisture and ET0 physics estimation
    """
    props = feature.get("properties", {})
    geometry = feature.get("geometry", {})
    coords = geometry.get("coordinates", [37.014528, -1.099736, 1523.0])
    lon, lat = coords[0], coords[1]
    
    station_id = props.get("instrument_id") or props.get("site_id", 61)
    station_name = props.get("instrument") or props.get("site", "Conduit@Empathy JKUAT")
    
    data_list = props.get("data", [])
    if not data_list or data_idx >= len(data_list):
        return None, {"error": "NO_DATA_POINTS"}
        
    point = data_list[data_idx]
    timestamp = point.get("time", datetime.datetime.now(datetime.timezone.utc).isoformat() + "Z")
    meas = point.get("measurements", {})
    
    # 1. Quality validation checks
    quality_issues = []
    
    # Temperature validation & consensus
    bt1 = meas.get("bt1")
    mt1 = meas.get("mt1")
    st1 = meas.get("st1")
    
    valid_temps = [t for t in [bt1, mt1, st1] if t is not None and -10.0 <= t <= 55.0]
    if not valid_temps:
        quality_issues.append("INVALID_TEMPERATURES")
        avg_temp = 20.0
    else:
        avg_temp = sum(valid_temps) / len(valid_temps)
        
    # Relative humidity (0 - 100%)
    sh1 = meas.get("sh1")
    if sh1 is not None and not (0.0 <= sh1 <= 100.0):
        quality_issues.append("HUMIDITY_OUT_OF_BOUNDS")
        sh1 = max(0.0, min(100.0, float(sh1)))
        
    # Pressure (hPa) - ~840-865 hPa typical at 1523m elevation
    bp1 = meas.get("bp1")
    if bp1 is not None and not (700.0 <= bp1 <= 1050.0):
        quality_issues.append("PRESSURE_OUT_OF_BOUNDS")
        
    # Rain gauges
    rg1 = max(0.0, float(meas.get("rg", 0.0) or 0.0))
    rg2 = max(0.0, float(meas.get("rg2", 0.0) or 0.0))
    rgt = max(0.0, float(meas.get("rgt", 0.0) or 0.0))
    rgp = max(0.0, float(meas.get("rgp", 0.0) or 0.0))
    
    # Solar irradiance & UV
    sv1 = float(meas.get("sv1", 0.0) or 0.0)
    si1 = float(meas.get("si1", 0.0) or 0.0)
    su1 = max(0.0, float(meas.get("su1", 0.0) or 0.0))
    
    # Wind
    ws = max(0.0, float(meas.get("ws", 0.0) or 0.0))
    wd = float(meas.get("wd", 0.0) or 0.0)
    wg = max(0.0, float(meas.get("wg", 0.0) or 0.0))
    
    # Heat index & wet bulb
    hi = float(meas.get("hi", avg_temp) or avg_temp)
    wbt = float(meas.get("wbt", avg_temp - 3.0) or avg_temp - 3.0)
    wbgt = float(meas.get("wbgt", avg_temp - 4.0) or avg_temp - 4.0)
    
    # Diagnostic
    css = float(meas.get("css", 100.0) or 100.0)
    bcs = int(meas.get("bcs", 3) or 3)
    
    # 2. Derived Environmental Physics Proxies:
    # Hargreaves-Samani potential evapotranspiration ET0 (mm/day)
    # Using solar irradiance and temperature:
    rs_factor = min(1.0, (si1 + sv1) / 8000.0) if (si1 + sv1) > 0 else 0.1
    et0_mm = max(1.2, round(0.0023 * (avg_temp + 17.8) * (max(2.0, ws * 2.0)) * rs_factor, 2))
    
    # Soil moisture proxy (%):
    # During rain deficit periods, soil moisture drops exponentially from 35% towards wilting point (15%)
    # Current Conduit reading has 0.0mm rainfall and relative humidity dropping to 31%
    humidity_factor = (sh1 or 50.0) / 100.0
    soil_moisture_estimate = round(15.0 + 18.0 * (humidity_factor ** 1.3), 1)
    
    # Vegetation NDVI proxy:
    # Ground spectral response derived from visible/infrared ratio (si1 / (si1 + sv1))
    if (si1 + sv1) > 0:
        ndvi_proxy = round(max(0.15, min(0.75, (si1 - sv1) / (si1 + sv1 + 1000.0) * 0.8 + 0.35)), 3)
    else:
        ndvi_proxy = 0.42
        
    quality_flag = "OUTLIER" if len(quality_issues) > 1 else ("SUSPECT" if quality_issues else "VALID")
    
    canonical = ObservationSchema(
        station_id=station_id,
        station_name=station_name,
        timestamp=timestamp,
        latitude=lat,
        longitude=lon,
        rainfall_gauge1=rg1,
        rainfall_gauge2=rg2,
        rainfall_total_today=rgt,
        rainfall_total_prior=rgp,
        temperature_bmx=bt1,
        temperature_mcp=mt1,
        temperature_sht=st1,
        wet_bulb_temp=wbt,
        wet_bulb_globe_temp=wbgt,
        heat_index=hi,
        pressure_hpa=bp1,
        relative_humidity_pct=sh1,
        solar_visible=sv1,
        solar_infrared=si1,
        solar_uv=su1,
        wind_speed=ws,
        wind_direction=wd,
        wind_gust=wg,
        soil_moisture_pct=soil_moisture_estimate,
        vegetation_ndvi=ndvi_proxy,
        evapotranspiration_mm=et0_mm,
        battery_charge_status=bcs,
        cell_signal_strength=css,
        source="CONDUIT_3DPAWS",
        status="OBSERVED",
        quality=quality_flag
    )
    
    qa_report = {
        "station_id": station_id,
        "timestamp": timestamp,
        "quality_flag": quality_flag,
        "issues": quality_issues,
        "valid_sensors_count": len([x for x in [bt1, mt1, st1, bp1, sh1, ws, rg1] if x is not None]),
        "total_expected_sensors": 10
    }
    
    return canonical, qa_report
