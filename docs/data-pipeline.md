# AQUA//GUARD: Data Pipeline & Normalization Specification

## 1. Primary Data Source: Conduit@Empathy (3D-PAWS UCAR)
The primary data source is the **Conduit@Empathy** weather station installed at Jomo Kenyatta University of Agriculture and Technology (JKUAT) in Juja, Kenya.
* **Portal**: `https://conduit.jhubafrica.com/`
* **Underlying Telemetry API**: `https://3d-fewsnet.icdp.ucar.edu/api/v1/data/61.geojson?email=3dpaws@meteo.go.ke&api_key=YOUR_CONDUIT_API_KEY`
* **Sampling Rate**: Continuous 1-minute observational cadence.
* **Coordinates**: Latitude -1.099736° S, Longitude 37.014528° E, Elevation 1,523 meters.

---

## 2. Ingestion & Quality Validation Pipeline
Raw sensor readings pass through eight sequential quality gates before reaching the machine learning and risk layers:

```text
RAW CONDUIT GEOJSON
        ↓
1. Schema & Type Validation (Pydantic v2)
        ↓
2. Unit Conversion & Normalization
        ↓
3. Timestamp & Chronological Continuity Check
        ↓
4. Duplicate Observation Detection
        ↓
5. Physical Bounds & Impossible Value Clamping
   • Temperature: -10.0°C to 55.0°C
   • Relative Humidity: 0.0% to 100.0%
   • Barometric Pressure: 700 to 1050 hPa (elevation adjusted)
   • Rainfall: >= 0.0 mm
        ↓
6. Multi-Sensor Consensus Validation
   • Cross-validation across BMX280, MCP9808, and SHT31 thermistors (|T_bmx - T_sht| <= 4.0°C)
        ↓
7. Sensor Dropout & Stale Signal Detection
        ↓
8. Data Health Score Calculation (Completeness, Freshness, Consistency, Coverage)
        ↓
CANONICAL OBSERVATION VECTOR
```

---

## 3. Physical State & Physics Proxies
In addition to direct observations, the data pipeline calculates physics-grounded proxies:
1. **Potential Evapotranspiration ($ET_0$)**: Hargreaves-Samani formulation integrating diurnal temperature excursion and SI1145 solar irradiance.
2. **Root-zone Soil Moisture ($S$)**: Hydrological water balance integrating antecedent rainfall, potential evapotranspiration, and calibrated with Copernicus Sentinel-1 SAR backscatter.
3. **Vegetation Canopy Greenness ($\text{NDVI}$)**: Spectral surface reflectance computed from visible and infrared solar sensors and aligned with Sentinel-2 MSI.

---

## 4. Provenance & Scientific Transparency
Every environmental metric stored and displayed in AQUA//GUARD carries:
* Sensor hardware ID and channel name.
* Direct physical observation timestamp (UTC).
* Mathematical derivation method and equation reference.
* Model version identifier (`AQUAGUARD-RISK-v0.3`).
* Scientific status tag: `OBSERVED`, `DERIVED`, `FORECAST`, `MODELLED`, or `SIMULATED`.
