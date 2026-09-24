from typing import List, Optional
from apps.api.domain.schemas import CompoundEventSchema, ObservationSchema, AnomalySchema
from apps.api.domain.baselines import get_station_baseline

def detect_compound_events(obs: ObservationSchema, anomalies: List[AnomalySchema]) -> List[CompoundEventSchema]:
    """
    Detects complex multivariate compound environmental risks where individual signals
    combine into severe compound hazards (e.g. Compound Water Stress).
    """
    events: List[CompoundEventSchema] = []
    
    anom_vars = {a.variable: a for a in anomalies}
    has_rain_deficit = "Rainfall Deficit" in anom_vars
    has_soil_deficit = "Soil Moisture Deficit" in anom_vars
    has_temp_surge = "Surface Temperature" in anom_vars
    has_veg_stress = "Vegetation Vigor (NDVI)" in anom_vars
    
    # 1. COMPOUND WATER STRESS EVENT (Primary Hackathon Demo Scenario)
    if has_rain_deficit and has_soil_deficit:
        factors = []
        evidence = []
        
        rain_a = anom_vars["Rainfall Deficit"]
        factors.append({
            "factor": "Rainfall Deficit",
            "signal": "PRECIPITATION_DROPOUT",
            "impactWeight": 0.35,
            "value": f"{rain_a.deviation_pct}% vs baseline (0.0 mm)"
        })
        evidence.append("Conduit rain gauges 1 & 2 recorded 0.0 mm precipitation over monitoring window.")
        
        soil_a = anom_vars["Soil Moisture Deficit"]
        factors.append({
            "factor": "Soil Moisture Deficit",
            "signal": "ROOTZONE_DESICCATION",
            "impactWeight": 0.30,
            "value": f"{soil_a.current_value}% ({soil_a.deviation_pct}% vs baseline)"
        })
        evidence.append(f"Derived soil moisture depleted to {soil_a.current_value}% (seasonal normal: {soil_a.baseline_value}%).")
        
        if has_temp_surge:
            temp_a = anom_vars["Surface Temperature"]
            factors.append({
                "factor": "Thermal Anomalies",
                "signal": "EVAPOTRANSPIRATION_PRESSURE",
                "impactWeight": 0.20,
                "value": f"+{round(temp_a.current_value - temp_a.baseline_value, 1)}°C surge"
            })
            evidence.append(f"Conduit BMX/MCP/SHT sensors register +{round(temp_a.current_value - temp_a.baseline_value, 1)}°C daytime thermal peak.")
            
        if has_veg_stress:
            veg_a = anom_vars["Vegetation Vigor (NDVI)"]
            factors.append({
                "factor": "Vegetation Stress",
                "signal": "CANOPY_DEGRADATION",
                "impactWeight": 0.15,
                "value": f"NDVI {veg_a.current_value} ({veg_a.deviation_pct}%)"
            })
            evidence.append(f"Canopy spectral reflectance shows declining greenness (NDVI: {veg_a.current_value}).")
            
        sev = "HIGH" if (has_temp_surge or has_veg_stress) else "MEDIUM"
        if has_temp_surge and has_veg_stress and rain_a.deviation_pct <= -50.0:
            sev = "CRITICAL"
            
        events.append(CompoundEventSchema(
            id=f"CMPD-WATER-STRESS-{obs.station_id}",
            type="COMPOUND_WATER_STRESS",
            title="Compound Agricultural & Hydrological Water Stress",
            severity=sev,
            confidence=0.88,
            detected_at=obs.timestamp,
            contributing_factors=factors,
            description="Simultaneous occurrence of acute precipitation deficit, rapid root-zone soil desiccation, and elevated atmospheric evapotranspiration demand.",
            evidence=evidence
        ))
        
    return events
