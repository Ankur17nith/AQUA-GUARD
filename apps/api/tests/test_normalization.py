import pytest
from apps.api.adapters.normalizer import normalize_conduit_feature

def test_normalize_valid_conduit_feature():
    sample_feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [37.014528, -1.099736, 1523.0]
        },
        "properties": {
            "instrument": "Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1",
            "instrument_id": 61,
            "data": [
                {
                    "time": "2026-09-24T11:32:05Z",
                    "measurements": {
                        "bt1": 29.0,
                        "mt1": 29.2,
                        "st1": 30.1,
                        "sh1": 31.7,
                        "bp1": 849.7,
                        "rg": 0.0,
                        "rg2": 0.0,
                        "rgt": 0.0,
                        "rgp": 0.0,
                        "sv1": 835,
                        "si1": 6449,
                        "su1": 3.1,
                        "ws": 1.1,
                        "wd": 115,
                        "wg": 2.2,
                        "wbgt": 22.7,
                        "wbt": 18.8,
                        "hi": 28.9,
                        "css": 100,
                        "bcs": 3
                    }
                }
            ]
        }
    }
    
    canonical, qa = normalize_conduit_feature(sample_feature, data_idx=0)
    assert canonical is not None
    assert canonical.station_id == 61
    assert canonical.rainfall_total_today == 0.0
    assert canonical.temperature_sht == 30.1
    assert canonical.relative_humidity_pct == 31.7
    assert canonical.soil_moisture_pct is not None
    assert 10.0 <= canonical.soil_moisture_pct <= 45.0
    assert canonical.evapotranspiration_mm > 0.0
    assert canonical.quality in ("VALID", "SUSPECT")
    assert qa["quality_flag"] in ("VALID", "SUSPECT")

def test_normalize_out_of_bounds_sensor():
    bad_feature = {
        "properties": {
            "instrument_id": 61,
            "data": [
                {
                    "time": "2026-09-24T12:00:00Z",
                    "measurements": {
                        "sh1": 150.0, # Impossible humidity > 100%
                        "bt1": 95.0,  # Impossible air temp
                        "rg": -5.0    # Negative rain
                    }
                }
            ]
        }
    }
    canonical, qa = normalize_conduit_feature(bad_feature, data_idx=0)
    assert canonical is not None
    assert canonical.relative_humidity_pct <= 100.0
    assert canonical.rainfall_gauge1 == 0.0
    assert qa["quality_flag"] in ("SUSPECT", "OUTLIER")
