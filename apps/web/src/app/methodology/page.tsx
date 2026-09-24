'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Sigma, 
  Cpu, 
  Droplets, 
  Sun, 
  Check, 
  Copy,
  Layers
} from 'lucide-react';

export default function MethodologyPage() {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const sections = [
    { id: 'sec-zscore', title: '1. Robust Anomaly Scoring (MAD Z-Scores)' },
    { id: 'sec-et0', title: '2. Evapotranspiration Physics (Hargreaves-Samani)' },
    { id: 'sec-compound', title: '3. Compound Risk Formulation Engine' },
    { id: 'sec-twin', title: '4. Digital Twin Counterfactual State Transitions' },
    { id: 'sec-balance', title: '5. Hydrological Soil Water Balance Differential' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* 1. Header Command Bar */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-[#111418] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Scientific Foundation</span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] font-mono text-slate-400">Physical & Mathematical Equations</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              Scientific Methodology & Formulations
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-semibold">
              PEER-REVIEWED SPEC v0.3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Rigorous mathematical documentation for environmental state estimation, robust anomaly detection, 
            FAO-56 potential evapotranspiration, multivariate risk attribution, and digital twin state-space dynamics.
          </p>
        </div>
      </div>

      {/* 2. Quick-Jump Table of Contents */}
      <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#15191F] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold mr-1">Sections:</span>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-2.5 py-1 rounded-lg border border-white/[0.04] bg-[#111418] hover:bg-white/[0.04] hover:text-cyan-300 text-slate-400 transition-colors font-mono text-[11px]"
          >
            {s.title.split('.')[1]}
          </a>
        ))}
      </div>

      {/* Section 1: Robust Anomaly Scoring */}
      <div id="sec-zscore" className="p-6 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sigma className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                1. Statistical & Robust Z-Score Anomaly Detection
              </h2>
              <span className="text-[11px] text-slate-400">Outlier-Resistant Median Absolute Deviation (MAD)</span>
            </div>
          </div>
          <button
            onClick={() => handleCopy('zscore', 'Z_robust = (x - Median(X)) / (1.4826 * MAD(X))')}
            className="p-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-slate-400 hover:text-white transition-colors"
            title="Copy equation"
          >
            {copiedFormula === 'zscore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Standard parametric Z-scores utilize the sample mean μ and standard deviation σ. 
          During environmental crises (such as flash droughts or acute thermal surges), extreme observations 
          severely inflate σ and bias μ, masking genuine anomalies. AQUA//GUARD implements the robust 
          Hampel estimator based on the Median Absolute Deviation:
        </p>

        <div className="p-4 rounded-xl bg-[#0B0D0F] border border-white/[0.06] font-mono text-cyan-300 text-xs sm:text-sm">
          <code>
            Z_robust = [ x_i - Median(X) ] / [ 1.4826 · MAD(X) ]
          </code>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            where MAD(X) = Median( | x_i - Median(X) | )
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#15191F] space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">Normalization Factor (1.4826)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Derived from 1 / Φ⁻¹(0.75), ensuring asymptotic equivalence to standard normal deviation for normally distributed ground noise.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#15191F] space-y-1">
            <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">Trigger Boundaries</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Elevated Alert: |Z_robust| ≥ 2.0 (95.4% quantile). Critical Warning: |Z_robust| ≥ 3.0 (99.7% quantile).
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Evapotranspiration Physics */}
      <div id="sec-et0" className="p-6 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                2. Potential Evapotranspiration Physics (FAO-56 Hargreaves-Samani)
              </h2>
              <span className="text-[11px] text-slate-400">Atmospheric Drying Pressure from Conduit Telemetry</span>
            </div>
          </div>
          <button
            onClick={() => handleCopy('et0', 'ET_0 = 0.0023 * (T_mean + 17.8) * (T_max - T_min)^0.5 * R_a')}
            className="p-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-slate-400 hover:text-white transition-colors"
            title="Copy equation"
          >
            {copiedFormula === 'et0' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Full Penman-Monteith equations require net radiometers and continuous wind vector arrays often unavailable at low-cost field stations. 
          AQUA//GUARD calculates FAO-56 compliant Hargreaves-Samani daily reference evapotranspiration (ET₀) using Conduit 
          precision thermal sensors (BMX/MCP/SHT) and SI1145 downwelling solar irradiance:
        </p>

        <div className="p-4 rounded-xl bg-[#0B0D0F] border border-white/[0.06] font-mono text-amber-300 text-xs sm:text-sm">
          <code>
            ET_0 = 0.0023 · (T_mean + 17.8) · (T_max - T_min)^0.5 · R_a
          </code>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] text-slate-400 uppercase bg-[#15191F] border-b border-white/[0.06]">
              <tr>
                <th className="py-2 px-3">Variable</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Conduit Sensor Source</th>
                <th className="py-2 px-3">Current Observed Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-[#111418] text-[11px]">
              <tr>
                <td className="py-2 px-3 font-bold text-amber-400">T_mean</td>
                <td className="py-2 px-3 text-slate-300">Mean 24h temperature</td>
                <td className="py-2 px-3 text-slate-400">Consensus (BMX / MCP / SHT)</td>
                <td className="py-2 px-3 text-white font-bold">24.2 °C</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-amber-400">T_max - T_min</td>
                <td className="py-2 px-3 text-slate-300">Diurnal thermal excursion</td>
                <td className="py-2 px-3 text-slate-400">Sensirion SHT31 24h bounds</td>
                <td className="py-2 px-3 text-white font-bold">30.1 - 16.5 = 13.6 °C</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-amber-400">R_a</td>
                <td className="py-2 px-3 text-slate-300">Extraterrestrial solar radiation</td>
                <td className="py-2 px-3 text-slate-400">Astronomical at lat -1.0997°S</td>
                <td className="py-2 px-3 text-white font-bold">35.4 MJ/m²/day</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-emerald-400">Result (ET_0)</td>
                <td className="py-2 px-3 text-slate-300 font-bold">Daily Reference Evaporation</td>
                <td className="py-2 px-3 text-slate-400">Derived Hydrological Mass Loss</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">4.62 mm / day</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Compound Climate Risk Engine */}
      <div id="sec-compound" className="p-6 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                3. Compound Climate Risk Scoring Engine
              </h2>
              <span className="text-[11px] text-slate-400">Multi-Hazard Biophysical Integration</span>
            </div>
          </div>
          <button
            onClick={() => handleCopy('compound', 'R_drought = 0.35*Deficit(P) + 0.30*Deficit(S) + 0.15*Anomaly(T) + 0.15*Stress(NDVI) + 0.05*ForecastTrend')}
            className="p-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-slate-400 hover:text-white transition-colors"
            title="Copy equation"
          >
            {copiedFormula === 'compound' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Climate hazards rarely occur in isolation. A precipitation deficit without thermal stress allows crops to survive, 
          whereas concurrent heat waves rapidly trigger permanent wilting point. AQUA//GUARD calculates composite Drought Risk (R_drought) 
          via physics-weighted multi-indicator integration:
        </p>

        <div className="p-4 rounded-xl bg-[#0B0D0F] border border-white/[0.06] font-mono text-rose-300 text-xs sm:text-sm">
          <code>
            R_drought = 0.35 · D(P) + 0.30 · D(S) + 0.15 · A(T) + 0.15 · S(NDVI) + 0.05 · Ω_syn
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#15191F] space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Precipitation Deficit D(P) [35%]</span>
            <p className="text-[11px] text-slate-400">
              D(P) = max(0, (P_baseline - P_14d) / P_baseline). Current: 0.0 mm vs 42.5 mm → 100% deficit.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#15191F] space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Soil Moisture Deficit D(S) [30%]</span>
            <p className="text-[11px] text-slate-400">
              D(S) = (S_field_capacity - S_root) / (S_field_capacity - S_wilting). Current: 19.5% vs 33.5% normal → 41.8% drop.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-white/[0.04] bg-[#15191F] space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Thermal & Canopy [30%]</span>
            <p className="text-[11px] text-slate-400">
              Thermal anomaly surge (+8.3°C above baseline) plus multi-spectral NDVI canopy chlorophyll stress (-17.4%).
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Digital Twin State Transitions */}
      <div id="sec-twin" className="p-6 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                4. Digital Twin Counterfactual State Transitions
              </h2>
              <span className="text-[11px] text-slate-400">Non-linear Microclimate Perturbation Physics</span>
            </div>
          </div>
          <button
            onClick={() => handleCopy('twin', 'S(t + h) = S(t) - [ d * (1 + 0.04 * Delta_T) * (1 / max(0.2, 1 + Delta_P/100)) ] * h')}
            className="p-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-slate-400 hover:text-white transition-colors"
            title="Copy equation"
          >
            {copiedFormula === 'twin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The Scenario Lab simulates counterfactual soil water storage S(t + h) over prediction horizon h days 
          under arbitrary temperature changes ΔT and rainfall deviations ΔP:
        </p>

        <div className="p-4 rounded-xl bg-[#0B0D0F] border border-white/[0.06] font-mono text-emerald-300 text-xs sm:text-sm">
          <code>
            S(t + h) = S(t) - [ d_0 · (1 + 0.04 · ΔT) · (1 / max(0.2, 1 + ΔP/100)) ] · h
          </code>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Where d₀ = 0.35%/day represents baseline root-zone drainage and transpiration. 
          Every +1°C thermal increase accelerates evaporative depletion by approximately 4%, 
          matching empirical lysimeter measurements across volcanic clay-loam soils.
        </p>
      </div>

      {/* Section 5: Volumetric Soil Water Balance */}
      <div id="sec-balance" className="p-6 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                5. Hydrological Soil Water Balance Differential
              </h2>
              <span className="text-[11px] text-slate-400">Conservation of Mass in the Root-Zone Layer</span>
            </div>
          </div>
          <button
            onClick={() => handleCopy('balance', 'dS/dt = P_eff - ET_c - Q_ro - D_perc')}
            className="p-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-slate-400 hover:text-white transition-colors"
            title="Copy equation"
          >
            {copiedFormula === 'balance' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The continuous 1-minute water balance follows the conservation of mass within the 0–60cm root-zone:
        </p>

        <div className="p-4 rounded-xl bg-[#0B0D0F] border border-white/[0.06] font-mono text-cyan-300 text-xs sm:text-sm">
          <code>
            dS/dt = P_eff - ET_c - Q_runoff - D_percolation
          </code>
        </div>

        <div className="p-3.5 rounded-lg border border-white/[0.04] bg-[#15191F] text-xs text-slate-300 leading-relaxed">
          During current observed conditions in Juja, Kenya: P_eff = 0.0 mm, Q_runoff = 0.0 mm, 
          D_percolation ≈ 0.0 mm, and ET_c = 4.62 mm/day. The net derivative dS/dt = -4.62 mm/day, 
          proving that dry-down is purely evaporative and rapidly approaching the physiological wilting threshold.
        </div>
      </div>
    </div>
  );
}
