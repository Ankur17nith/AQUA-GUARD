import pytest
import pytest_asyncio
import httpx
from apps.api.main import app

@pytest.mark.asyncio
async def test_health_and_ready():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r = await ac.get("/health")
        assert r.status_code == 200
        assert r.json()["status"] == "HEALTHY"
        
        r2 = await ac.get("/ready")
        assert r2.status_code == 200

@pytest.mark.asyncio
async def test_api_stations():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r = await ac.get("/api/v1/stations")
        assert r.status_code == 200
        stations = r.json()
        assert len(stations) > 0
        # Verify Conduit JKUAT station is included
        jkuat = next((s for s in stations if s["id"] == 62 or s["instrument_id"] == 61), None)
        assert jkuat is not None
        assert "JKUAT" in jkuat["name"] or "Kiambu" in jkuat["county"]

@pytest.mark.asyncio
async def test_api_current_environment():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r = await ac.get("/api/v1/environment/current?station_id=62")
        assert r.status_code == 200
        data = r.json()
        assert data["station_id"] in (61, 62)
        assert data["rainfall_current_mm"] >= 0.0
        assert "data_health" in data
        assert data["data_health"]["overall"] >= 90.0

@pytest.mark.asyncio
async def test_api_anomalies_and_risks():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r_anom = await ac.get("/api/v1/anomalies?station_id=62")
        assert r_anom.status_code == 200
        anomalies = r_anom.json()
        assert isinstance(anomalies, list)
        
        r_risk = await ac.get("/api/v1/risk/current?station_id=62")
        assert r_risk.status_code == 200
        risks = r_risk.json()
        assert len(risks) >= 3
        drought = next((r for r in risks if r["category"] == "DROUGHT"), None)
        assert drought is not None
        assert "why_explanation" in drought
        assert len(drought["why_explanation"]) > 0

@pytest.mark.asyncio
async def test_api_scenario_lab():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "scenario_name": "Severe Dry Test",
            "rainfall_delta_pct": -30.0,
            "temperature_delta_c": 2.0,
            "horizon_days": 14,
            "station_id": 62
        }
        r = await ac.post("/api/v1/scenarios", json=payload)
        assert r.status_code == 200
        res = r.json()
        assert res["status"] == "SIMULATED"
        assert res["projected_metrics"]["droughtRiskPct"] > res["current_metrics"]["droughtRiskPct"]

@pytest.mark.asyncio
async def test_api_copilot_query():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "query": "Why is drought risk high at Conduit station?",
            "station_id": 62
        }
        r = await ac.post("/api/v1/copilot/query", json=payload)
        assert r.status_code == 200
        res = r.json()
        assert len(res["answer"]) > 50
        assert "Conduit" in res["answer"] or "Drought" in res["answer"]
        assert len(res["evidence"]) > 0

@pytest.mark.asyncio
async def test_digital_twin_endpoint():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r = await ac.get("/api/v1/stations/62/digital-twin")
        assert r.status_code == 200
        twin = r.json()
        assert twin["station"]["name"] == "Site JKUAT"
        assert twin["twin_status"] == "ACTIVE_SYNCHRONIZED"
        assert len(twin["anomalies"]) > 0
        assert len(twin["risks"]) > 0
        assert len(twin["recommended_actions"]) > 0

@pytest.mark.asyncio
async def test_actions_and_alerts():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r_act = await ac.get("/api/v1/actions?station_id=62")
        assert r_act.status_code == 200
        actions = r_act.json()
        assert len(actions) > 0
        assert "avoided_loss_estimate" in actions[0]

        r_alt = await ac.get("/api/v1/alerts?station_id=62")
        assert r_alt.status_code == 200
        alerts = r_alt.json()
        assert len(alerts) > 0
        alert_id = alerts[0]["id"]

        r_upd = await ac.post(f"/api/v1/alerts/{alert_id}/status", json={"status": "ACKNOWLEDGED"})
        assert r_upd.status_code == 200

@pytest.mark.asyncio
async def test_data_sources_and_system():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        r_ds = await ac.get("/api/v1/data-sources?station_id=62")
        assert r_ds.status_code == 200
        ds = r_ds.json()
        assert "primary" in ds
        assert ds["primary"]["status"] == "CONNECTED"

        r_sys = await ac.get("/api/v1/system/health")
        assert r_sys.status_code == 200
        assert r_sys.json()["status"] == "HEALTHY"

        r_mode = await ac.post("/api/v1/system/mode?mode=DEMO")
        assert r_mode.status_code == 200
        assert r_mode.json()["new_mode"] == "DEMO"

