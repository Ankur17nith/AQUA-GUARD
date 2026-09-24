import React from 'react';
import { BookOpen, Sigma, ShieldCheck, Cpu } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Scientific Methodology & Mathematical Formulation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Rigorous mathematical documentation for environmental state estimation, anomaly detection, compound risk scoring, and digital twin simulation.
          </p>
        </div>
      </div>

      {/* Section 1: Anomaly Scoring & Robust Z-Scores */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sigma className="w-4 h-4" />
          <span>1. Statistical & Robust Z-Score Anomaly Detection</span>
        </h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Traditional mean and standard deviation metrics are susceptible to extreme outliers during flash droughts or abnormal sensor noise. AQUA//GUARD implements robust Z-scores using median absolute deviation (MAD):
        </p>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 overflow-x-auto">
          <code>
            Z_robust = (x - Median(X)) / (1.4826 * MAD(X))
          </code>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          Where MAD is defined as Median(|x_i - Median(X)|). An anomaly is flagged as HIGH when |Z_robust| ≥ 2.0 and CRITICAL when |Z_robust| ≥ 3.0.
        </p>
      </div>

      {/* Section 2: Evapotranspiration Physics */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sigma className="w-4 h-4" />
          <span>2. Potential Evapotranspiration (Hargreaves-Samani / Penman-Monteith)</span>
        </h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          To calculate atmospheric drying pressure without needing net radiometers, the platform computes Hargreaves-Samani daily potential evapotranspiration (ET_0) using Conduit temperature and SI1145 downwelling solar irradiance:
        </p>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 overflow-x-auto">
          <code>
            ET_0 = 0.0023 * (T_mean + 17.8) * (T_max - T_min)^0.5 * R_a
          </code>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          R_a is extraterrestrial solar radiation adjusted for JKUAT latitude (-1.0997°S). High daytime thermal excursions (&gt;30°C) coupled with dry relative humidity (31.7%) yield ET_0 = 4.62 mm/day.
        </p>
      </div>

      {/* Section 3: Compound Risk Scoring Engine */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sigma className="w-4 h-4" />
          <span>3. Compound Climate Risk Scoring Formulation</span>
        </h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The composite Drought Risk (R_drought) combines five independently normalized, physics-grounded indicators:
        </p>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 overflow-x-auto">
          <code>
            R_drought = 0.35 * Deficit(P) + 0.30 * Deficit(S) + 0.15 * Anomaly(T) + 0.15 * Stress(NDVI) + 0.05 * ForecastTrend
          </code>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          Every derived risk value retains complete feature attribution, allowing decision-makers to inspect the exact percentage contribution of each environmental driver.
        </p>
      </div>

      {/* Section 4: Digital Twin State Transitions */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          <span>4. Digital Twin State Transition Equations</span>
        </h2>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The Climate Scenario Lab simulates future soil water retention S(t+h) under counterfactual rainfall and temperature deviations:
        </p>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 overflow-x-auto">
          <code>
            S(t + h) = S(t) - [ d * (1 + 0.04 * Delta_T) * (1 / max(0.2, 1 + Delta_P/100)) ] * h
          </code>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          Where h is horizon days, Delta_T is warming perturbation in °C, and Delta_P is rainfall deficit percentage. This provides continuous physical realism for scenario experimentation.
        </p>
      </div>
    </div>
  );
}
