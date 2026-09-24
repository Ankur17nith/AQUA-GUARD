'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackRisks } from '@/lib/demoData';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RiskPage() {
  const stationId = 62;
  const [activeCategory, setActiveCategory] = useState<'DROUGHT' | 'WATER_STRESS' | 'HEAT' | 'FLOOD' | 'VEGETATION' | 'COMPOUND'>('DROUGHT');

  const { data: risks = fallbackRisks } = useQuery({
    queryKey: ['risks', stationId],
    queryFn: () => api.getCurrentRisks(stationId)
  });

  const currentRisk = risks.find((r) => r.category === activeCategory) || risks[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Climate Risk Intelligence & Driver Center
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
              MODEL: AQUAGUARD-RISK-v0.3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Transparent mathematical risk decomposition and evidence attribution derived from Conduit observations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
          {(['DROUGHT', 'WATER_STRESS', 'HEAT', 'FLOOD', 'VEGETATION', 'COMPOUND'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Risk Overview Banner */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4 border-r border-slate-800/80 pr-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Assessed Threat Level</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl font-black text-slate-100 tabular-nums">
                {currentRisk.probabilityPct}%
              </span>
              <RiskBadge severity={currentRisk.severity} size="lg" />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Horizon: <strong>{currentRisk.horizon}</strong> • Confidence: <strong>{currentRisk.confidencePct}%</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5">
            <div className="text-[10px] uppercase text-slate-400 font-bold">Affected Geographic Catchment:</div>
            <div className="text-slate-200 font-bold">{currentRisk.affectedArea.name}</div>
            <div className="text-[11px] text-slate-400">
              Radius: {currentRisk.affectedArea.radiusKm} km from Conduit station
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/actions"
              className="w-full py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>VIEW RECOMMENDED ACTIONS ({currentRisk.recommendedActionsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Explainable AI Driver Breakdown (SHAP style) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Mathematical Driver Attribution (Model Weights & Evidence)
            </span>
            <span className="text-[10px] text-cyan-400">100% Traceable</span>
          </div>

          <div className="space-y-3">
            {currentRisk.drivers.map((d, i) => (
              <div key={i} className="p-3 rounded bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{d.factor}</span>
                  <div className="flex items-center gap-3 tabular-nums">
                    <span className="text-slate-400 text-[11px]">Model Weight: {d.weightPct}%</span>
                    <span className="text-cyan-300 font-bold text-xs">Contribution: {d.contributionPct}%</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.status === 'DEFICIT' ? 'bg-amber-500' : d.status === 'ELEVATED' ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (d.contributionPct || 0) * 1.5)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5">
                  <span>Current: <strong className="text-slate-200">{d.currentValue}</strong></span>
                  <span>Baseline: <strong className="text-slate-200">{d.baselineValue}</strong></span>
                  <span>Deviation: <strong className={d.status === 'DEFICIT' ? 'text-amber-400' : 'text-slate-300'}>{d.deviation}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Did The Model Detect This Risk? (Requirement #22) */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Explanation & Provenance Findings</span>
        </h3>
        <div className="space-y-2 text-xs">
          {currentRisk.whyExplanation.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2 rounded bg-slate-950/70 border border-slate-800/80">
              <span className="text-cyan-400 font-bold">•</span>
              <span className="text-slate-200 font-sans leading-relaxed">{line}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span className="text-slate-400 font-bold uppercase block mb-1">Direct Sensor Evidence:</span>
          <div className="flex flex-wrap gap-2">
            {currentRisk.evidence.map((ev, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10.5px]">
                {ev}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
