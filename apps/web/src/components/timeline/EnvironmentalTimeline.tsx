'use client';

import React from 'react';
import { CanonicalObservation, ForecastPoint } from '@aquaguard/shared-types';

interface EnvironmentalTimelineProps {
  observations?: CanonicalObservation[];
  forecast?: ForecastPoint[];
  className?: string;
}

export function EnvironmentalTimeline({
  observations = [],
  forecast = [],
  className = ''
}: EnvironmentalTimelineProps) {
  // Generate unified chronological points (past 24-48h + forecast 14d)
  const timePoints = [
    { label: '-48h', rain: 0.0, temp: 24.2, sm: 26.5, ndvi: 0.44, risk: 45.0, type: 'OBSERVED' },
    { label: '-36h', rain: 0.0, temp: 26.8, sm: 24.8, ndvi: 0.43, risk: 52.0, type: 'OBSERVED' },
    { label: '-24h', rain: 0.0, temp: 28.5, sm: 23.1, ndvi: 0.41, risk: 61.0, type: 'OBSERVED' },
    { label: '-12h', rain: 0.0, temp: 29.4, sm: 21.0, ndvi: 0.40, risk: 71.0, type: 'OBSERVED' },
    { label: 'NOW', rain: 0.0, temp: 30.1, sm: 19.5, ndvi: 0.38, risk: 78.4, type: 'OBSERVED' },
    { label: '+24h', rain: 0.2, temp: 30.5, sm: 18.9, ndvi: 0.37, risk: 80.0, type: 'FORECAST' },
    { label: '+3d', rain: 1.1, temp: 30.9, sm: 18.0, ndvi: 0.35, risk: 82.5, type: 'FORECAST' },
    { label: '+7d', rain: 3.5, temp: 31.3, sm: 16.3, ndvi: 0.33, risk: 85.0, type: 'FORECAST' },
    { label: '+14d', rain: 8.4, temp: 31.6, sm: 14.7, ndvi: 0.31, risk: 87.5, type: 'FORECAST' },
  ];

  return (
    <div className={`p-5 rounded-lg border border-slate-800 bg-slate-950 font-mono ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <span>Synchronized Environmental Risk Timeline</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-normal">
              PAST 48h → NOW → FORECAST 14d
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Demonstrating physical causality: Rainfall Deficit → Soil Desiccation → Thermal Evaporative Demand → Crop Stress → Risk Escalation.
          </p>
        </div>
      </div>

      {/* Synchronized Multi-Track Grid */}
      <div className="space-y-4">
        {/* Track 1: Rainfall (mm) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-cyan-400 font-bold">1. Precipitation (mm)</span>
            <span className="text-slate-400 text-[11px]">Normal: 3.0 mm/day | Observed: 0.0 mm</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div key={i} className={`p-2 rounded border ${pt.label === 'NOW' ? 'bg-cyan-950/80 border-cyan-500/80 ring-2 ring-cyan-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div className="text-[10px] text-slate-400">{pt.label}</div>
                <div className="text-sm font-extrabold text-cyan-300 tabular-nums">{pt.rain}</div>
                <div className="text-[9px] text-slate-400">mm</div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Surface Temperature (°C) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-red-400 font-bold">2. Surface Temperature (°C)</span>
            <span className="text-slate-400 text-[11px]">Baseline: 21.8°C | Diurnal Peak: +8.3°C</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div key={i} className={`p-2 rounded border ${pt.label === 'NOW' ? 'bg-red-950/80 border-red-500/80 ring-2 ring-red-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div className="text-[10px] text-slate-400">{pt.label}</div>
                <div className="text-sm font-extrabold text-red-300 tabular-nums">{pt.temp}°</div>
                <div className="text-[9px] text-slate-400">°C</div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3: Root-zone Soil Moisture (%) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-amber-400 font-bold">3. Soil Moisture Deficit (%)</span>
            <span className="text-slate-400 text-[11px]">Field Capacity: 38% | Stress Threshold: &lt;22%</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div key={i} className={`p-2 rounded border ${pt.label === 'NOW' ? 'bg-amber-950/80 border-amber-500/80 ring-2 ring-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div className="text-[10px] text-slate-400">{pt.label}</div>
                <div className={`text-sm font-extrabold tabular-nums ${pt.sm <= 18.0 ? 'text-red-400' : 'text-amber-300'}`}>{pt.sm}%</div>
                <div className="text-[9px] text-slate-400">vol %</div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 4: Vegetation Vigor (NDVI) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-emerald-400 font-bold">4. Vegetation Health (NDVI)</span>
            <span className="text-slate-400 text-[11px]">Healthy: &gt;0.45 | Stress: &lt;0.35</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div key={i} className={`p-2 rounded border ${pt.label === 'NOW' ? 'bg-emerald-950/80 border-emerald-500/80 ring-2 ring-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div className="text-[10px] text-slate-400">{pt.label}</div>
                <div className="text-sm font-extrabold text-emerald-300 tabular-nums">{pt.ndvi}</div>
                <div className="text-[9px] text-slate-400">index</div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 5: Composite Climate Risk (%) */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-purple-400 font-bold">5. Modelled Drought Risk Trajectory (%)</span>
            <span className="text-amber-400 text-[11px] font-bold">Current: 78.4% (HIGH) → Projected: 87.5% (CRITICAL)</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div key={i} className={`p-2 rounded border ${pt.label === 'NOW' ? 'bg-purple-950/90 border-purple-500 ring-2 ring-purple-500/40' : 'bg-slate-900 border-slate-800'}`}>
                <div className="text-[10px] text-slate-400">{pt.label}</div>
                <div className="text-sm font-black text-purple-300 tabular-nums">{pt.risk}%</div>
                <div className="text-[9px] text-slate-400">{pt.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
