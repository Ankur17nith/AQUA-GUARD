import pytest
from apps.api.domain.schemas import ObservationSchema, ScenarioRequestSchema
from apps.api.domain.anomalies import detect_anomalies
from apps.api.domain.compound import detect_compound_events
from apps.api.domain.risk import calculate_climate_risks
from apps.api.domain.scenarios import simulate_climate_scenario
from apps.api.domain.actions import generate_action_recommendations

@pytest.fixture
def dry_observation():
    return ObservationSchema(
        station_id=61,
        station_name="Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1",
        timestamp="2026-09-24T11:32:05Z",
        latitude=-1.099736,
        longitude=37.014528,
        rainfall_gauge1=0.0,
        rainfall_gauge2=0.0,
        rainfall_total_today=0.0,
        rainfall_total_prior=0.0,
        temperature_bmx=29.0,
        temperature_mcp=29.2,
        temperature_sht=30.1,
        wet_bulb_temp=18.8,
        wet_bulb_globe_temp=22.7,
        heat_index=28.9,
        pressure_hpa=849.7,
        relative_humidity_pct=31.7,
        solar_visible=835,
        solar_infrared=6449,
        solar_uv=3.1,
        wind_speed=1.1,
        soil_moisture_pct=19.5,
        vegetation_ndvi=0.38,
        evapotranspiration_mm=4.6,
        source="CONDUIT_3DPAWS",
        status="OBSERVED",
        quality="VALID"
    )

def test_anomaly_detection_flags_deficit(dry_observation):
    anomalies = detect_anomalies(dry_observation, month=9)
    assert len(anomalies) >= 2
    variables = [a.variable for a in anomalies]
    assert "Rainfall Deficit" in variables
    assert "Soil Moisture Deficit" in variables

def test_compound_water_stress_detected(dry_observation):
    anomalies = detect_anomalies(dry_observation, month=9)
    events = detect_compound_events(dry_observation, anomalies)
    assert len(events) >= 1
    assert events[0].type == "COMPOUND_WATER_STRESS"
    assert events[0].severity in ("HIGH", "CRITICAL")
    assert len(events[0].contributing_factors) >= 2

def test_risk_calculation_weights_and_why(dry_observation):
    anomalies = detect_anomalies(dry_observation, month=9)
    risks = calculate_climate_risks(dry_observation, anomalies, month=9)
    drought = next((r for r in risks if r.category == "DROUGHT"), None)
    assert drought is not None
    assert drought.probability_pct >= 65.0
    assert drought.severity in ("HIGH", "CRITICAL")
    assert len(drought.drivers) >= 4
    # Check driver weights sum to ~100%
    total_weights = sum(d.weight_pct for d in drought.drivers)
    assert 95.0 <= total_weights <= 105.0
    assert len(drought.why_explanation) >= 3

def test_scenario_lab_simulation(dry_observation):
    req = ScenarioRequestSchema(
        scenario_name="Severe Dry Scenario",
        rainfall_delta_pct=-30.0,
        temperature_delta_c=2.0,
        horizon_days=14,
        station_id=61
    )
    result = simulate_climate_scenario(req, dry_observation)
    assert result.projected_metrics["droughtRiskPct"] > result.current_metrics["droughtRiskPct"]
    assert result.projected_metrics["soilMoisturePct"] < result.current_metrics["soilMoisturePct"]
    assert result.delta_metrics["droughtRiskDelta"] > 0
    assert "MODELLED" in result.impact_assessment["avoidedImpactWithIntervention"] or "mitigate" in result.impact_assessment["avoidedImpactWithIntervention"]

def test_action_engine_prioritization(dry_observation):
    anomalies = detect_anomalies(dry_observation, month=9)
    risks = calculate_climate_risks(dry_observation, anomalies, month=9)
    actions = generate_action_recommendations(risks, dry_observation)
    assert len(actions) >= 3
    urgencies = {a.urgency for a in actions}
    assert "IMMEDIATE" in urgencies
    assert "NEXT 24 HOURS" in urgencies
    assert "NEXT 7 DAYS" in urgencies
