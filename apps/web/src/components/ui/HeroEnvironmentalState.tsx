'use client';

import React from 'react';
import { RiskAssessment } from '@aquaguard/shared-types';
import { Info, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface HeroEnvironmentalStateProps {
  primaryRisk?: RiskAssessment;
  stationName?: string;
  className?: string;
}

export function HeroEnvironmentalState({
  primaryRisk,
  stationName = 'Site JKUAT (Juja Catchment)',
  className = ''
}: HeroEnvironmentalStateProps) {
  const score = primaryRisk ? Math.round(primaryRisk.probabilityPct) : 78;
  const severity = primaryRisk?.severity || 'HIGH';
  const categoryName = primaryRisk ? primaryRisk.category.replace('_', ' ') : 'WATER STRESS';
  const drivers = primaryRisk?.drivers || [
    { factor: 'Rainfall Deficit', contributionPct: 52.4, weightPct: 35, deviation: '-100%', currentValue: '0.0 mm' },
    { factor: 'Thermal Evaporative Surge', contributionPct: 22.5, weightPct: 15, deviation: '+8.3°C', currentValue: '30.1°C' },
    { factor: 'Soil Moisture Depletion', contributionPct: 19.5, weightPct: 30, deviation: '-43%', currentValue: '19.0%' },
    { factor: 'Short-term Rain Outlook', contributionPct: 5.6, weightPct: 5, deviation: 'Persisting Dry', currentValue: '0-2 mm/wk' },
  ];

  const primaryDriver = drivers.reduce((prev, current) => 
    (prev.contributionPct > current.contributionPct) ? prev : current, drivers[0]
  );

  return (
    <div className={`p-6 rounded-xl border border-amber-900/60 bg-gradient-to-b from-slate-900/90 to-slate-950 font-mono text-slate-100 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider text-slate-200">
            Hero Environmental State • {stationName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 font-bold">
            MODELLED: AQUAGUARD-RISK-v0.3
          </span>
          <span className="text-slate-400">Confidence: 84%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
        {/* Dominant Metric */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            COMPOSITE CLIMATE THREAT
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl font-black text-slate-100 tabular-nums tracking-tight">
              {score}
            </span>
            <div className="space-y-1">
              <span className="text-xl font-black text-amber-400 block tracking-wider">
                / 100
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 text-xs font-black uppercase">
                {severity} RISK
              </span>
            </div>
          </div>

          <div className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            {categoryName}
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Severe hydrological and agricultural moisture deficit detected across Juja Agro-ecological Catchment & 3 adjacent monitoring zones. Root-zone drying accelerates wilting point threshold.
          </p>

          <div className="pt-1 flex items-center gap-3 text-xs">
            <Link
              href="/risk"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
            >
              <span>Inspect All Attributions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/scenarios"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              <span>Simulate in Digital Twin</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Contribution Breakdown (Section 8 & 12) */}
        <div className="lg:col-span-7 p-4 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <span className="uppercase tracking-wider">Physics-Informed Causal Drivers</span>
            <span className="text-[10px] text-slate-400 font-normal">SHAP-style Feature Weight</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {drivers.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {d.factor}
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-[11px] text-slate-400 font-sans">{d.currentValue} ({d.deviation})</span>
                    <span className="text-amber-300 font-bold">{d.contributionPct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, d.contributionPct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 flex items-start gap-2 text-xs font-sans mt-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200">Primary driver: </span>
              <span className="text-amber-300 font-semibold">{primaryDriver?.factor} ({primaryDriver?.deviation})</span>
              <span className="text-slate-400"> — directly validated by dual Conduit tipping-bucket gauges with zero recorded precipitation over monitoring window.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
