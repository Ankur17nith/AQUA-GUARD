'use client';

import React, { useState } from 'react';
import { CanonicalObservation, ForecastPoint } from '@aquaguard/shared-types';
import { EnvironmentalEChart } from '@/components/charts/EnvironmentalEChart';
import { Clock } from 'lucide-react';

interface EnvironmentalTimelineProps {
  observations?: CanonicalObservation[];
  forecast?: ForecastPoint[];
  className?: string;
}

export function EnvironmentalTimeline({
  className = ''
}: EnvironmentalTimelineProps) {
  const [activeWindow, setActiveWindow] = useState<'24H' | '7D' | '30D' | '90D'>('7D');

  // Unified chronological steps across physical causality
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
    <div className={`p-5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] font-mono text-xs ${className}`}>
      {/* Header with Window Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-3 mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#F1F4F8] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#06B6D4]" />
            <span>Synchronized Environmental Risk Timeline</span>
          </h2>
          <p className="text-xs text-[#8E9BAE] mt-0.5 font-sans">
            Demonstrating physical causality: Rainfall Deficit → Root-zone Soil Desiccation → Thermal Evaporative Demand → Risk Escalation.
          </p>
        </div>

        {/* Range Toggles (Requirement #21: 24H, 7D, 30D, 90D) */}
        <div className="flex items-center gap-1 bg-[#15191F] p-0.5 rounded border border-[rgba(255,255,255,0.06)]">
          {(['24H', '7D', '30D', '90D'] as const).map((win) => (
            <button
              key={win}
              onClick={() => setActiveWindow(win)}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                activeWindow === win
                  ? 'bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border border-[#06B6D4]/40'
                  : 'text-[#8E9BAE] hover:text-[#F1F4F8]'
              }`}
            >
              {win}
            </button>
          ))}
        </div>
      </div>

      {/* Apache ECharts Multi-Signal Interactive Series */}
      <div className="mb-5 p-3.5 rounded bg-[#15191F] border border-[rgba(255,255,255,0.06)]">
        <div className="text-xs font-semibold text-[#8E9BAE] mb-2 flex items-center justify-between">
          <span className="uppercase tracking-wider text-[11px]">Continuous Signal Correlation Overlay</span>
          <span className="text-[10px] text-[#5C6777]">Interactive Zoom / Pan</span>
        </div>
        <EnvironmentalEChart height={270} />
      </div>

      {/* Synchronized Multi-Track Grid */}
      <div className="space-y-3.5">
        {/* Track 1: Rainfall */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#06B6D4] font-semibold">1. Precipitation (mm)</span>
            <span className="text-[#5C6777]">Observed: 0.0 mm | Baseline: 3.0 mm/day</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div
                key={i}
                className={`p-1.5 rounded border ${
                  pt.label === 'NOW'
                    ? 'bg-[rgba(6,182,212,0.12)] border-[#06B6D4]/60'
                    : 'bg-[#15191F] border-[rgba(255,255,255,0.04)]'
                }`}
              >
                <div className="text-[9.5px] text-[#5C6777]">{pt.label}</div>
                <div className="text-xs font-bold text-[#06B6D4] tabular-nums mt-0.5">{pt.rain}</div>
                <div className="text-[9px] text-[#5C6777]">mm</div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Surface Temperature */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F87171] font-semibold">2. Surface Temperature (°C)</span>
            <span className="text-[#5C6777]">Peak: +8.3°C above diurnal normal</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div
                key={i}
                className={`p-1.5 rounded border ${
                  pt.label === 'NOW'
                    ? 'bg-[rgba(239,68,68,0.12)] border-[#EF4444]/60'
                    : 'bg-[#15191F] border-[rgba(255,255,255,0.04)]'
                }`}
              >
                <div className="text-[9.5px] text-[#5C6777]">{pt.label}</div>
                <div className="text-xs font-bold text-[#F87171] tabular-nums mt-0.5">{pt.temp}°</div>
                <div className="text-[9px] text-[#5C6777]">°C</div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3: Root-zone Soil Moisture */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F59E0B] font-semibold">3. Soil Moisture Deficit (%)</span>
            <span className="text-[#5C6777]">Threshold: &lt;22% (Stress Zone)</span>
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {timePoints.map((pt, i) => (
              <div
                key={i}
                className={`p-1.5 rounded border ${
                  pt.label === 'NOW'
                    ? 'bg-[rgba(245,158,11,0.12)] border-[#F59E0B]/60'
                    : 'bg-[#15191F] border-[rgba(255,255,255,0.04)]'
                }`}
              >
                <div className="text-[9.5px] text-[#5C6777]">{pt.label}</div>
                <div className={`text-xs font-bold tabular-nums mt-0.5 ${pt.sm <= 18 ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                  {pt.sm}%
                </div>
                <div className="text-[9px] text-[#5C6777]">sm</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
