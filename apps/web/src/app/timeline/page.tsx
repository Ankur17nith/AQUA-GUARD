'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackForecast } from '@/lib/demoData';
import { EnvironmentalTimeline } from '@/components/timeline/EnvironmentalTimeline';
import { Clock, Info, Radio } from 'lucide-react';

export default function TimelinePage() {
  const { data: forecast = fallbackForecast } = useQuery({
    queryKey: ['forecast', 62],
    queryFn: () => api.getForecast(62)
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Header Command Bar */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-[#111418] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Temporal Dynamics</span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] font-mono text-slate-400">Multi-Horizon Causality</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              Synchronized Environmental Timeline
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-semibold">
              SYNCHRONIZED (NOW → 14D)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-track chronological alignment demonstrating physical causality: from Conduit rainfall deficits 
            and surface heating, through root-zone moisture depletion, to compound climate risk emergence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Site:</span>
            <span className="text-white font-semibold">JKUAT AWS #62</span>
          </div>
        </div>
      </div>

      <EnvironmentalTimeline forecast={forecast} />

      {/* 2. Scientific Correlation Insights */}
      <div className="p-5 rounded-xl border border-white/[0.08] bg-[#111418] space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Biophysical Correlation & Lag Dynamics</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#15191F] space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">1. Acute Rain Deficit (Lag: 0h)</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Conduit tipping buckets record 0.0 mm rainfall, establishing an immediate meteorological deficit and zero infiltration.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#15191F] space-y-1.5">
            <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">2. Soil Desiccation (Lag: 24–48h)</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Soil moisture drops from 26.5% to 19.5% with a 48h phase lag as evapotranspiration continuously depletes the upper root zone.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#15191F] space-y-1.5">
            <span className="text-[10px] font-mono text-rose-300 uppercase font-bold block">3. Compound Hazard (Lag: 72h+)</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Breaching the 22% permanent wilting threshold couples with thermal peaks, escalating drought risk into the HIGH threat tier (78.4%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
