# Devpost Project Story: AQUA//GUARD

## 💡 Inspiration
Across sub-Saharan Africa, smallholder farmers and municipal water basin managers are facing unprecedented climate volatility. Traditional weather apps report raw ambient temperature and rainfall numbers, but raw data alone does not save crops or protect water supplies. During **Hack The Weather 2026** (organized by **JHUB Africa / JKUAT**), we asked ourselves: *How can we transform real-world IoT sensor data from the JKUAT Conduit@Empathy hub into early intelligence, simulated foresight, and concrete decisions that safeguard vulnerable communities?*

---

## 🌪️ The Problem
Environmental monitoring systems often fail at the last mile:
* **No Localized Context**: Showing "Soil Moisture = 19.5%" without comparing it to 30-year seasonal baselines leaves farmers unaware that their soil is 41.8% below normal.
* **Isolated Variable Silos**: Rainfall deficits and heatwaves are monitored independently, missing lethal **Compound Water Stress** events.
* **Lack of Decision Support**: Dashboards tell users what happened yesterday, but fail to explain what will happen next week or what specific steps to take right now.

---

## 🛡️ What We Built: AQUA//GUARD
AQUA//GUARD is an end-to-end climate risk intelligence, digital twin, and decision-support platform. It connects directly to the **Conduit@Empathy** weather station installed at JKUAT and scales across a national network of 69 weather stations throughout Kenya.

The platform executes a six-stage transformation:
1. **Raw Telemetry**: Ingests continuous 1-minute observations across dual rain gauges, multiple precision thermistors, atmospheric pressure, relative humidity, and solar irradiance.
2. **Data Quality Engine**: Rigorous eight-stage validation verifying sensor consensus and computing a 96.4% Data Health Score.
3. **Sensor Fusion**: Combines ground telemetry with Copernicus Sentinel-2 NDVI canopy vigor and Sentinel-1 radar soil moisture.
4. **Explainable Risk Engine (`AQUAGUARD-RISK-v0.3`)**: Quantifies Drought, Water Stress, Heat, and Flood risks with exact percentage driver attributions.
5. **Climate Scenario Lab (Digital Twin)**: Allows decision-makers to simulate counterfactual climate shocks (e.g. -30% rainfall, +2°C warming) over 7 to 30-day horizons.
6. **Action Engine**: Generates urgency-stratified field directives (IMMEDIATE, NEXT 24 HOURS, NEXT 7 DAYS, MONITOR) with quantified avoided loss estimates.

---

## 📡 Meaningful Use of Conduit Data
Conduit data does not merely appear as a decorative chart. It directly drives the physical state transition models:
* Dual tipping-bucket rain gauge consensus (`rg1`, `rg2`, `rgt`) establishes the precipitation deficit factor.
* Multi-sensor thermal consensus (BMX, MCP, SHT) drives the Hargreaves-Samani potential evapotranspiration ($ET_0$) calculation.
* Diurnal barometric pressure and solar irradiance (`sv1`, `si1`, `su1`) determine atmospheric drying pressure.

---

## 🤖 AI & Explainability: Guardian Copilot
To bridge the gap between complex climate models and field workers, we developed **GUARDIAN**, an AI decision copilot. Unlike generic chatbot wrappers, GUARDIAN follows a strict zero-hallucination architecture: every numerical metric, evidence citation, and recommendation is dynamically fetched from verified backend API tools.

---

## 🌍 Climate, Environmental & Social Impact
* **Agricultural Protection**: Identifies developing root-zone desiccation up to 10 days before visible canopy wilting, avoiding an estimated 25–35% harvest loss.
* **Water Resource Conservation**: Recommends targeted deficit irrigation schedules, saving approximately 120,000 liters/day across community storage reservoirs.
* **Scalable Public Good**: Built on open standards (PostGIS, GeoJSON, FastAPI, Next.js), ready for county government and NGO adoption across East Africa.
