# AQUA//GUARD: System Architecture & Technical Design

## 1. System Overview
AQUA//GUARD is an environmental decision-intelligence platform designed for **Hack The Weather 2026** (organized by **JHUB Africa / JKUAT**). The platform transforms raw meteorological and hydrological observations into actionable climate resilience interventions.

```mermaid
flowchart TD
    A[Conduit@Empathy Field Station] -->|1-minute Telemetry| F[Data Ingestion Adapter]
    B[Copernicus Sentinel-2 & 1] -->|NDVI & Radar Backscatter| F
    C[Open-Meteo NWP Ensemble] -->|14-day Weather Forecast| F
    D[CHIRPS & ERA5 30-Year Climatology] -->|Seasonal Baselines| F

    F --> G[Validation, Normalization & Quality QA]
    G --> H[(PostgreSQL + PostGIS / SQLite DB)]

    H --> I[Environmental State Fusion Engine]
    I --> J[Anomaly Engine (Robust Z-Score / IQR)]
    I --> K[Forecast Engine (Uncertainty Intervals)]
    I --> L[Climate Risk Engine (Transparent Weights)]

    J --> M[Compound Event Detector]
    L --> M

    M --> N[Action Engine (Prioritized Interventions)]
    M --> O[Climate Scenario Lab (Digital Twin Engine)]
    M --> P[Guardian AI Copilot (Tool Grounded)]

    N --> Q[Next.js Mission Control Frontend]
    O --> Q
    P --> Q
    H --> Q

    Q --> R[Decision Maker / Agronomist / County Official]
    R --> S[Proactive Climate Protection & Avoided Loss]
```

---

## 2. Microservice Architecture
The platform is organized as a production monorepo containing modular, decoupled services:

* **Frontend (`apps/web`)**:
  * Next.js 16 with React 19 and App Router.
  * Tailwind CSS with mission-control high information density styling.
  * MapLibre GL for client-side geospatial vector rendering and temporal timeline playback.
  * TanStack Query for caching and server state synchronization.
* **Backend API (`apps/api`)**:
  * Python FastAPI with asynchronous request handlers.
  * Pydantic v2 schemas enforcing strict domain data contracts.
  * SQLAlchemy async engine supporting SQLite (local dev) and PostgreSQL + PostGIS (production/docker).
* **Adapters (`apps/api/adapters`)**:
  * `ProductionConduitAdapter`: Connects directly to the live UCAR 3D-PAWS FEWSNET REST API (`https://3d-fewsnet.icdp.ucar.edu/api/v1/data/61.geojson`).
  * `DemoConduitAdapter`: Loads 2,092 authentic observations from the JKUAT Conduit station, ensuring zero network latency and guaranteed reliability during judging.
* **Domain Engines (`apps/api/domain`)**:
  * `anomalies`: Robust statistical deviations against 30-year baselines.
  * `compound`: Multivariate hazard correlation (Compound Water Stress).
  * `risk`: Transparent weighted risk calculations (`AQUAGUARD-RISK-v0.3`).
  * `forecast`: 24-hour to 14-day physical continuity projections.
  * `scenarios`: Interactive Digital Twin parameter simulations.
  * `actions`: Urgency-stratified interventions with verified avoided loss estimates.
  * `copilot`: Tool-grounded AI copilot executing verified backend APIs without hallucination.

---

## 3. Database Schema & Data Models
The data layer is modeled in PostgreSQL / SQLite:
* `stations`: Metadata for 69 active weather stations across Kenya (coordinates, elevation, affiliation).
* `observations`: 1-minute time-series observations (precipitation, 3 thermistors, barometric pressure, relative humidity, solar irradiance, wind velocity).
* `historical_baselines`: 30-year monthly averages, percentiles, and standard deviations.
* `risk_assessments`: Computed probabilities, confidence scores, and SHAP driver attributions.
* `alerts`: System notifications with acknowledgment and resolution lifecycle.
* `action_recommendations`: Operational field tasks with urgency, sector, and avoided impact metrics.

---

## 4. Deployment Architecture
* Containerized using `docker-compose.yml` supporting one-command deployment (`docker compose up --build`).
* Automated CI/CD pipeline via GitHub Actions validating backend tests, seeding integrity, and Next.js static builds.
