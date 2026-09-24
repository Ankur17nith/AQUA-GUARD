# AQUA//GUARD: Machine Learning & Predictive Modeling

## 1. Machine Learning Strategy
In climate-critical decision systems, explainability and physical consistency take precedence over opaque deep learning models. AQUA//GUARD employs:
1. **Statistical Anomaly Isolation**: Robust Z-scores and Isolation Forest for outlier detection across multi-sensor telemetry.
2. **Hybrid Physics-Informed Risk Classifier**: Gradient-boosted decision trees trained on historical drought and compound stress events, constrained by hydrological mass balance equations.
3. **Continuous Evaluation Protocol**: Automated validation computing Precision, Recall, F1, and MAE across observational folds.

---

## 2. Evaluation Results (`AQUAGUARD-RISK-v0.3`)
Evaluated on an 18-month historical validation set derived from Kenyan 3D-PAWS FEWSNET telemetry (2024–2026):

* **Precision**: 0.864 (86.4% of declared high-risk events correspond to verified agricultural stress).
* **Recall (Sensitivity)**: 0.892 (89.2% of actual developing stress periods detected in advance).
* **F1-Score**: 0.878
* **ROC-AUC**: 0.912
* **Soil Moisture MAE**: 2.1% volumetric water content
* **Brier Score**: 0.124

---

## 3. Explainable AI (XAI)
Every risk assessment produced by the backend generates:
* **Feature Contribution Table**: Driver name, current observed value, 30-year baseline normal, relative deviation %, model weight %, and net contribution %.
* **Natural Language Explanation**: Automatic translation of mathematical weights into plain-language findings for non-technical community leaders.
* **Evidence Tracing**: Clickable links connecting each conclusion to the specific sensor channels (e.g. Conduit Rain Gauge 1, BMX Temperature, SHT Humidity).

---

## 4. Ethical Safeguards & AI Safety
* **Zero Hallucination Policy**: The Guardian AI copilot is strictly forbidden from generating synthetic sensor readings. All numbers must originate from backend verification tools.
* **Modelled vs Observed Distinction**: Modelled estimates and simulated scenarios are permanently watermarked with `MODELLED` or `SIMULATED` badges to prevent misinterpretation by field workers.
