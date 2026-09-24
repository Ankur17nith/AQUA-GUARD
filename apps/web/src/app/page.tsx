import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    { num: '01', title: 'RAW DATA', desc: 'Conduit@Empathy dual rain gauges, thermal profiling, solar irradiance + Copernicus Sentinel-2/1 Earth observations.' },
    { num: '02', title: 'DATA QUALITY', desc: 'Continuous schema, bounds, outlier z-score, and sensor consensus validation yielding 96.4% Health Score.' },
    { num: '03', title: 'INSIGHT', desc: 'Climatological baseline comparison detecting -100% precipitation deficit and -41.8% root-zone soil water collapse.' },
    { num: '04', title: 'COMPOUND RISK', desc: 'Physics-informed machine learning estimating localized Drought (78.4%) and Hydrological Water Stress.' },
    { num: '05', title: 'DECISION & TWIN', desc: 'Interactive Digital Twin simulating counterfactual climate stress scenarios (-30% rain, +2°C temp).' },
    { num: '06', title: 'ACTION & IMPACT', desc: 'Concrete, urgency-prioritized interventions avoiding an estimated 25-35% localized harvest loss.' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-16 font-mono">
      {/* 1. Hero Section (Requirement #75) */}
      <div className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-xs text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Hack The Weather 2026 • JHUB Africa / JKUAT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          AQUA<span className="text-cyan-400">{"//"}</span>GUARD
        </h1>

        <p className="text-lg sm:text-xl font-bold text-slate-300 max-w-2xl mx-auto font-sans">
          Environmental intelligence that turns physical signals into decisions that protect communities.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mx-auto font-sans leading-relaxed">
          Most environmental dashboards only answer <em>“What is the temperature?”</em>. AQUA//GUARD combines real-world 
          <strong> Conduit@Empathy</strong> observations, satellite radar, and climatological patterns to detect abnormal conditions, 
          forecast localized climate risks, explain why they occur, simulate future scenarios, and recommend concrete interventions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-cyan-950 cursor-pointer"
          >
            <span>OPEN COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/scenarios"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>LAUNCH CLIMATE SCENARIO LAB</span>
          </Link>
        </div>
      </div>

      {/* 2. The Core Pipeline: DATA → INSIGHT → DECISION → IMPACT (Requirement #65) */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            The Fundamental Transformation
          </span>
          <h2 className="text-xl font-extrabold text-slate-100 mt-1 uppercase">
            Data → Insight → Decision → Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.num} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-extrabold">
                <span>{s.title}</span>
                <span className="text-slate-500">{s.num}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Product Preview Teaser */}
      <div className="p-6 rounded-xl border border-cyan-900/40 bg-gradient-to-b from-slate-900/80 to-slate-950 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Field Telemetry: Conduit@Empathy Station (Site 62, Inst 61)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Juja, Kiambu County, Kenya • Coordinates: 1.0997°S, 37.0145°E • Elev: 1,523m
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <span>Enter Operations View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Rainfall Today</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums mt-0.5">0.0 mm</div>
            <span className="text-[10px] text-red-400 font-bold">-100% Deficit</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Soil Water Content</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums mt-0.5">19.5%</div>
            <span className="text-[10px] text-amber-400 font-bold">-41.8% vs Baseline</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Thermal Surge</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums mt-0.5">30.1°C</div>
            <span className="text-[10px] text-red-400 font-bold">+8.3°C Peak Surge</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Modelled Drought Risk</span>
            <div className="text-xl font-bold text-red-400 tabular-nums mt-0.5">78.4%</div>
            <span className="text-[10px] text-red-400 font-bold">HIGH RISK STATE</span>
          </div>
        </div>
      </div>

      {/* 4. Why AQUA//GUARD is Different (Requirement #3, #104) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-5 rounded-lg border border-red-950 bg-red-950/10 space-y-3">
          <div className="text-red-400 font-bold uppercase tracking-wider text-sm">
            ✕ What AQUA//GUARD Is NOT
          </div>
          <ul className="space-y-1.5 text-slate-400 font-sans">
            <li>• Not another passive weather forecast dashboard.</li>
            <li>• Not an LLM wrapper that hallucinates fabricated sensor readings.</li>
            <li>• Not disconnected charts without decision support.</li>
            <li>• Not a static map with meaningless colored pins.</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg border border-emerald-950 bg-emerald-950/10 space-y-3">
          <div className="text-emerald-400 font-bold uppercase tracking-wider text-sm">
            ✓ What AQUA//GUARD Delivers
          </div>
          <ul className="space-y-1.5 text-slate-300 font-sans">
            <li>• Ingests 1-minute real-world telemetry from JKUAT Conduit@Empathy.</li>
            <li>• Detects multivariate Compound Water Stress events.</li>
            <li>• Explains exact mathematical driver weights and evidence.</li>
            <li>• Interactive Digital Twin simulating counterfactual climate scenarios.</li>
            <li>• Concrete urgency-stratified interventions avoiding verified losses.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
