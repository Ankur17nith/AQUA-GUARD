import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ModelsPage() {
  const metrics = [
    { name: 'Precision (Water Stress)', val: '0.864', desc: 'Ratio of true severe water stress alerts among all triggers' },
    { name: 'Recall (Sensitivity)', val: '0.892', desc: 'Ability to detect evolving drought conditions before crop wilt' },
    { name: 'F1-Score', val: '0.878', desc: 'Harmonic mean of precision and recall on historical test fold' },
    { name: 'ROC-AUC', val: '0.912', desc: 'Area under Receiver Operating Characteristic curve' },
    { name: 'Soil Moisture MAE', val: '2.1%', desc: 'Mean absolute error on root-zone volumetric soil moisture proxy' },
    { name: 'Brier Reliability Score', val: '0.124', desc: 'Mean squared error of probabilistic risk forecast predictions' }
  ];

  const features = [
    { name: 'Precipitation Deficit (ΔP)', weight: '35%', source: 'Conduit Tipping Bucket Dual Gauges', desc: 'Rolling 14-day rainfall deficit compared to 30-year seasonal baseline' },
    { name: 'Soil Water Content (ΔS)', weight: '30%', source: 'Hydrological Mass Balance + Sentinel-1', desc: 'Root-zone moisture depletion calculated from antecedent rainfall and ET0' },
    { name: 'Thermal Anomaly (ΔT)', weight: '15%', source: 'Conduit BMX / MCP / SHT Sensors', desc: 'Daytime surface thermal peak deviation driving vapor pressure deficit' },
    { name: 'Vegetation Canopy Vigor (ΔNDVI)', weight: '15%', source: 'SI1145 Surface IR/Vis + Sentinel-2', desc: 'Spectral reflectance ratio tracking chlorophyll greenness reduction' },
    { name: 'Synoptic Forecast Outlook', weight: '5%', source: 'Open-Meteo High-Resolution Ensemble', desc: '14-day persistent dry outlook factor' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Model Center & Scientific Cards
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              VERSION: v0.3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Formal model transparency, feature weights, validation metrics, and boundary limitations.
          </p>
        </div>
      </div>

      {/* Model Card Header */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Model Architecture Card</span>
            <h2 className="text-xl font-black text-slate-100 mt-1">AQUAGUARD-RISK-v0.3</h2>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Hybrid Physics-Informed Statistical & Gradient-Boosted Risk Classifier for Localized Climate Hazards.
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400">Status:</span>{' '}
            <strong className="text-emerald-400 font-bold">PRODUCTION EVALUATED</strong>
            <div className="text-[10px] text-slate-400 mt-0.5">Last Calibration: September 2026</div>
          </div>
        </div>

        {/* Evaluation Metrics Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Validation Performance Metrics
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-sans">{m.name}</span>
                <div className="text-xl font-black text-cyan-300 tabular-nums">{m.val}</div>
                <p className="text-[9px] text-slate-400 font-sans leading-tight">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Attribution Table */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Model Input Vector & Weights
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80">
              <tr>
                <th className="p-2.5">Feature Name</th>
                <th className="p-2.5">Weight %</th>
                <th className="p-2.5">Primary Source</th>
                <th className="p-2.5">Scientific Formulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-slate-800/30 text-slate-300">
                  <td className="p-2.5 font-bold text-slate-200">{f.name}</td>
                  <td className="p-2.5 text-cyan-400 font-bold">{f.weight}</td>
                  <td className="p-2.5 text-slate-400 font-sans">{f.source}</td>
                  <td className="p-2.5 text-slate-300 font-sans text-[11px]">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Limitations & Assumptions (Requirement #96) */}
      <div className="p-5 rounded-lg border border-amber-900/50 bg-amber-950/20 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Scientific Assumptions & Known Limitations</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 font-sans text-xs leading-relaxed">
          <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
            <strong className="text-slate-100 block font-mono mb-1">Spatial Extrapolation Radius</strong>
            Single-station Conduit telemetry captures local micro-climates within ~20 km radius; regional extrapolation requires auxiliary satellite fusion.
          </div>
          <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
            <strong className="text-slate-100 block font-mono mb-1">Soil Retention Curve Assumptions</strong>
            Soil moisture estimation utilizes van Genuchten parameters for volcanic clay-loam soils representative of the Kenyan central highlands.
          </div>
          <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
            <strong className="text-slate-100 block font-mono mb-1">Causal Disclaimer</strong>
            Model outputs are probabilistic risk projections and scenario simulations, not deterministic certainties. Interventions should be validated with local agronomists.
          </div>
        </div>
      </div>
    </div>
  );
}
