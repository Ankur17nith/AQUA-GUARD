from typing import Dict, Any

# Climatological & seasonal baseline reference for Kiambu / Juja agro-ecological zone
# Based on Kenya Meteorological Department historical records & CHIRPS / ERA5 30-year climatology
BASELINE_DATA: Dict[int, Dict[str, float]] = {
    # Month 9: September (Transition to Short Rains season)
    9: {
        "rainfall_mean_mm": 42.5,
        "rainfall_std_mm": 11.2,
        "rainfall_p10_mm": 18.0,
        "rainfall_p50_mm": 41.0,
        "rainfall_p90_mm": 68.0,
        "temperature_mean_c": 21.8,
        "temperature_std_c": 2.4,
        "soil_moisture_mean_pct": 33.5,
        "soil_moisture_std_pct": 4.8,
        "humidity_mean_pct": 67.0,
        "humidity_std_pct": 8.5,
        "ndvi_mean": 0.46,
        "ndvi_std": 0.06,
        "evapotranspiration_mean_mm": 4.2
    },
    10: { # October (Short Rains onset)
        "rainfall_mean_mm": 78.0,
        "rainfall_std_mm": 22.0,
        "temperature_mean_c": 22.4,
        "soil_moisture_mean_pct": 39.0,
        "humidity_mean_pct": 72.0,
        "ndvi_mean": 0.52
    }
}

def get_station_baseline(month: int = 9) -> Dict[str, float]:
    return BASELINE_DATA.get(month, BASELINE_DATA[9])
