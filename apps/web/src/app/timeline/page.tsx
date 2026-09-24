'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackForecast } from '@/lib/demoData';
import { EnvironmentalTimeline } from '@/components/timeline/EnvironmentalTimeline';
import { Clock, Info } from 'lucide-react';

export default function TimelinePage() {
  const { data: forecast = fallbackForecast } = useQuery({
    queryKey: ['forecast', 62],
    queryFn: () => api.getForecast(62)
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Synchronized Multi-track Environmental Timeline
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Chronological multi-parameter alignment demonstrating physical causality from Conduit sensor readings into climate hazards.
          </p>
        </div>
      </div>

      <EnvironmentalTimeline forecast={forecast} />

      {/* Scientific Correlation Notes */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3 text-xs">
        <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Physical Correlation Insights</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 font-sans leading-relaxed text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <strong className="text-cyan-300 block font-mono font-bold mb-1">1. Acute Rain Deficit</strong>
            Conduit gauges show 0.0 mm rainfall persisting over multiple observation cycles, initiating meteorological drought.
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <strong className="text-amber-300 block font-mono font-bold mb-1">2. Soil Desiccation Lag</strong>
            Soil moisture drops from 26.5% to 19.5% over 48 hours, lagging the rain deficit as evapotranspiration draws from storage.
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <strong className="text-red-300 block font-mono font-bold mb-1">3. Risk Escalation</strong>
            As root-zone moisture drops below the 22% threshold, the model&apos;s compound water stress index escalates into the HIGH risk zone (78.4%).
          </div>
        </div>
      </div>
    </div>
  );
}
