from typing import List, Dict, Any
from apps.api.domain.schemas import AlertSchema, CompoundEventSchema, RiskAssessmentSchema, ObservationSchema

# In-memory alert store with persistence interface
_alerts_db: Dict[str, AlertSchema] = {}

def sync_alerts_from_events(
    obs: ObservationSchema,
    compound_events: List[CompoundEventSchema],
    risks: List[RiskAssessmentSchema]
) -> List[AlertSchema]:
    """
    Translates compound events and critical risk thresholds into actionable system alerts.
    """
    for event in compound_events:
        alert_id = f"ALT-{event.id}"
        if alert_id not in _alerts_db:
            _alerts_db[alert_id] = AlertSchema(
                id=alert_id,
                station_id=obs.station_id,
                station_name=obs.station_name,
                title=f"{event.title} Detected",
                category="WATER_STRESS",
                severity=event.severity,
                detected_at=event.detected_at,
                message=event.description,
                recommended_action="Activate deficit irrigation schedules and inspect reservoir storage.",
                status="ACTIVE"
            )
            
    # Check severe heat
    heat_risk = next((r for r in risks if r.category == "HEAT" and r.severity in ("HIGH", "CRITICAL")), None)
    if heat_risk:
        heat_id = f"ALT-HEAT-{obs.station_id}"
        if heat_id not in _alerts_db:
            _alerts_db[heat_id] = AlertSchema(
                id=heat_id,
                station_id=obs.station_id,
                station_name=obs.station_name,
                title="Elevated Thermal Labor Hazard",
                category="HEAT",
                severity=heat_risk.severity,
                detected_at=obs.timestamp,
                message=f"WBGT and Heat Index indicate high caution during midday hours ({obs.wet_bulb_globe_temp}°C WBGT).",
                recommended_action="Implement shade breaks and worker hydration mandates.",
                status="ACTIVE"
            )
            
    return list(_alerts_db.values())

def update_alert_status(alert_id: str, new_status: str) -> bool:
    if alert_id in _alerts_db:
        _alerts_db[alert_id].status = new_status
        return True
    return False
