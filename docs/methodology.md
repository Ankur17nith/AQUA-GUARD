# AQUA//GUARD: Scientific Methodology & Mathematical Models

## 1. Climatological Baselines
Environmental numbers lack meaning without localized historical context. Instead of presenting a solitary observation:
```text
Soil moisture = 19.5%
```
AQUA//GUARD calculates:
```text
Observed Soil Moisture: 19.5%
30-Year Seasonal Baseline: 33.5%
Relative Deviation: -41.8% (Agricultural Drought Stress Zone)
```
Baselines are derived from 30-year climatological records (CHIRPS precipitation, ERA5 atmospheric reanalysis, and Kenya Meteorological Department station archives) partitioned by calendar month and agro-ecological zone.

---

## 2. Statistical Anomaly Engine
Anomalies are detected using robust Z-scores with Median Absolute Deviation (MAD) to prevent distortion from short-duration convective spikes:
$$Z_{robust} = \frac{x - \text{Median}(X)}{1.4826 \cdot \text{MAD}(X)}$$
Where:
* $|Z_{robust}| \ge 1.5$: MEDIUM severity anomaly.
* $|Z_{robust}| \ge 2.0$: HIGH severity anomaly.
* $|Z_{robust}| \ge 3.0$: CRITICAL severity anomaly.

---

## 3. Compound Event Detection
A key differentiator of AQUA//GUARD is that environmental variables are not evaluated in isolation. A **Compound Water Stress Event** is triggered when:
$$\Delta P \le -30\% \quad \text{AND} \quad \Delta S \le -20\% \quad \text{AND} \quad \Delta T \ge +2.0^\circ\text{C}$$
This multi-variate condition signals acute soil desiccation, atmospheric moisture deficit, and rapid crop wilt risk.

---

## 4. Multi-Factor Climate Risk Formulation
The composite Drought Risk model (`AQUAGUARD-RISK-v0.3`) computes a transparent weighted probability score:
$$R_{drought} = 0.35 \cdot D(P) + 0.30 \cdot D(S) + 0.15 \cdot A(T) + 0.15 \cdot S(\text{NDVI}) + 0.05 \cdot F_{trend}$$
Where:
* $D(P)$: Normalized precipitation deficit.
* $D(S)$: Normalized root-zone soil water deficit.
* $A(T)$: Thermal evaporative surge anomaly.
* $S(\text{NDVI})$: Canopy chlorophyll vigor degradation.
* $F_{trend}$: Ensemble numerical weather prediction trend.

Every assessment outputs complete driver attributions and SHAP-style contributions so judges and agronomists can see the exact mathematical justification.

---

## 5. Digital Twin State Transitions
The Climate Scenario Lab simulates future soil water retention ($S_{t+h}$) under user-configured environmental stresses:
$$S(t + h) = S(t) - \left[ d \cdot (1 + 0.04 \cdot \Delta T) \cdot \frac{1}{\max(0.2, 1 + \Delta P / 100)} \right] \cdot h$$
Where $h$ is horizon duration in days, $\Delta T$ is thermal warming in °C, and $\Delta P$ is precipitation deviation percentage.
