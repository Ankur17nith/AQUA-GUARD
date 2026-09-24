'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackRisks } from '@/lib/demoData';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RiskTrendChart } from '@/components/charts/RiskTrendChart';
import { AlertTriangle, ShieldCheck, ArrowRight, TrendingUp, MapPin } from 'lucide-react';
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
    <div className="space-y-5 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418]">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#F1F4F8]">
              Climate Risk Intelligence & Driver Center
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#8E9BAE] border border-[rgba(255,255,255,0.08)]">
              MODEL: AQUAGUARD-RISK-v0.3
            </span>
          </div>
          <p className="text-xs text-[#8E9BAE] mt-0.5 font-sans">
            Transparent mathematical risk decomposition and evidence attribution derived from Conduit observations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-[#15191F] p-1 rounded border border-[rgba(255,255,255,0.06)] text-xs">
          {(['DROUGHT', 'WATER_STRESS', 'HEAT', 'FLOOD', 'VEGETATION', 'COMPOUND'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer text-xs ${
                activeCategory === cat
                  ? 'bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border border-[#06B6D4]/40 font-semibold'
                  : 'text-[#8E9BAE] hover:text-[#F1F4F8]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Threat Overview & Trend Split */}
      <div className="p-5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assessed Level */}
        <div className="lg:col-span-4 space-y-3.5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] lg:pr-6 pb-4 lg:pb-0">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8E9BAE]">Assessed Threat Level</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-5xl font-black text-[#F1F4F8] tabular-nums">
                {currentRisk.probabilityPct}%
              </span>
              <RiskBadge severity={currentRisk.severity} size="lg" />
            </div>
            <div className="text-xs text-[#8E9BAE] mt-1 font-sans">
              Horizon: <strong className="text-[#F1F4F8] font-mono">{currentRisk.horizon}</strong> • Confidence: <strong className="text-[#F1F4F8] font-mono">{currentRisk.confidencePct}%</strong>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[rgba(255,255,255,0.05)] text-xs space-y-1">
            <div className="text-[10px] uppercase text-[#8E9BAE] font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#06B6D4]" />
              Geographic Catchment:
            </div>
            <div className="text-[#F1F4F8] font-semibold">{currentRisk.affectedArea.name}</div>
            <div className="text-[11px] text-[#5C6777]">
              Radius: {currentRisk.affectedArea.radiusKm} km around Conduit@Empathy hub
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/actions"
              className="w-full py-2 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Recommended Actions ({currentRisk.recommendedActionsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Trend Chart */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 text-xs">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="font-semibold text-[#F1F4F8] uppercase tracking-wider text-[11px]">
                Hazard Evolution Trajectory (Past 48h → Forecast 14d)
              </span>
            </div>
            <span className="text-[10px] text-[#5C6777]">Critical Threshold &gt;75%</span>
          </div>

          <RiskTrendChart currentScore={currentRisk.probabilityPct} height={210} />
        </div>
      </div>

      {/* Driver Attribution Breakdown */}
      <div className="p-5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] space-y-3">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
          <span className="text-xs font-semibold text-[#F1F4F8] uppercase tracking-wider">
            Mathematical Driver Attribution & Feature Weights
          </span>
          <span className="text-[10px] text-[#10B981]">100% Traceable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentRisk.drivers.map((d, i) => (
            <div key={i} className="p-3 rounded bg-[#15191F] border border-[rgba(255,255,255,0.06)] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#F1F4F8]">{d.factor}</span>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="text-[#5C6777] text-[10.5px]">Wt: {d.weightPct}%</span>
                  <span className="text-[#F59E0B] font-bold text-xs">{d.contributionPct}%</span>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-[#1F2630] overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    d.status === 'DEFICIT' ? 'bg-[#F59E0B]' : d.status === 'ELEVATED' ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                  }`}
                  style={{ width: `${Math.min(100, (d.contributionPct || 0) * 1.5)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-[#8E9BAE] pt-0.5">
                <span>Obs: <strong className="text-[#F1F4F8]">{d.currentValue}</strong></span>
                <span>Norm: <strong className="text-[#F1F4F8]">{d.baselineValue}</strong></span>
                <span>Dev: <strong className={d.status === 'DEFICIT' ? 'text-[#F59E0B]' : 'text-[#8E9BAE]'}>{d.deviation}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Explanation & Evidence */}
      <div className="p-5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] space-y-3">
        <h3 className="text-xs font-semibold text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Findings & Direct Sensor Evidence</span>
        </h3>
        <div className="space-y-1.5 text-xs">
          {currentRisk.whyExplanation.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded bg-[#15191F] border border-[rgba(255,255,255,0.05)]">
              <span className="text-[#06B6D4] font-bold">•</span>
              <span className="text-[#F1F4F8] font-sans leading-relaxed">{line}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#8E9BAE] text-[10px] uppercase font-semibold">Evidence:</span>
          {currentRisk.evidence.map((ev, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-[#15191F] border border-[rgba(255,255,255,0.06)] text-[#F1F4F8] text-[10.5px]">
              {ev}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
