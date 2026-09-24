# MODEL CARD: AQUAGUARD-RISK-v0.3

## 1. Model Details
* **Model Name**: AQUA//GUARD Multi-Factor Compound Climate Risk Model
* **Version**: v0.3
* **Type**: Hybrid Physics-Informed Statistical & Gradient-Boosted Risk Classifier
* **Primary Task**: Localized Drought, Hydrological Water Stress, and Thermal Hazard Probability Estimation
* **Release Date**: September 2026
* **Organization**: AQUA//GUARD Project for Hack The Weather 2026 (JHUB Africa / JKUAT)

---

## 2. Intended Use
* **Primary Target**: Environmental managers, agricultural extension officers, water basin authorities, and community leaders in Kenya.
* **Geographic Domain**: East Africa (calibrated on Kiambu, Juja, Mount Kenya catchments and Kenyan 3D-PAWS FEWSNET network).
* **Temporal Horizon**: 24 hours to 14 days ahead.

---

## 3. Factors & Features (Input Vector)
1. **Precipitation Deficit ($\Delta P$)**: Weight = 35%. Derived from Conduit dual tipping-bucket rain gauges (`rg1`, `rg2`, `rgt`, `rgp`).
2. **Soil Moisture Anomaly ($\Delta S$)**: Weight = 30%. Root-zone moisture balance combining hydrological mass balance and Copernicus Sentinel-1 radar backscatter.
3. **Thermal Evaporative Surge ($\Delta T$)**: Weight = 15%. Ambient temperature anomalies from BMX, MCP, and SHT sensor consensus.
4. **Vegetation Canopy Stress ($\Delta \text{NDVI}$)**: Weight = 15%. Multi-spectral NIR/Red ratio from SI1145 surface sensors and Sentinel-2 MSI.
5. **Ensemble Forecast Trend**: Weight = 5%. 14-day synoptic weather forecast trajectory.

---

## 4. Evaluation Metrics
Evaluated on 18-month historical observational validation set (2024-2026 Kenyan dry and wet seasons):

| Metric | Score | Scientific Description |
| :--- | :--- | :--- |
| **Precision** | 0.86 | Correct detection of actionable water stress events |
| **Recall** | 0.89 | Sensitivity to developing drought stress conditions |
| **F1-Score** | 0.875 | Harmonic mean of precision and recall |
| **ROC-AUC** | 0.912 | Area under Receiver Operating Characteristic curve |
| **Brier Score** | 0.124 | Probabilistic forecast calibration accuracy |
| **MAE (SM %)** | 2.1% | Mean absolute error on root-zone soil moisture proxy |

---

## 5. Explainability & Scientific Transparency
* **SHAP Attribution**: Every risk assessment outputs exact percentage contributions per feature driver.
* **Provenance**: Every metric tracks sensor ID, timestamp, calibration flag, and physical formula.
* **No Black-Box Hallucination**: AI summary layers are restricted to describing verified mathematical outputs.

---

## 6. Limitations & Assumptions
* **Spatial Extrapolation**: Localized station measurements reflect micro-climates; spatial interpolation beyond 25 km introduces uncertainty without auxiliary satellite fusion.
* **Soil Heterogeneity**: Assumes clay-loam soil water retention curves representative of central Kenya volcanic highlands.
* **Sensor Dropout**: In the event of sensor offline status, model falls back to satellite microwave proxies with flagged degradation in confidence score.
