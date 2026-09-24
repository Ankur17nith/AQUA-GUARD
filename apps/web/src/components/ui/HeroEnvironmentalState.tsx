'use client';

import React from 'react';
import { RiskAssessment } from '@aquaguard/shared-types';
import { ArrowUpRight, Radio, ShieldAlert } from 'lucide-react';
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
    { factor: 'Synoptic Rain Outlook', contributionPct: 5.6, weightPct: 5, deviation: 'Persisting Dry', currentValue: '0-2 mm/wk' },
  ];

  return (
    <div className={`p-5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] font-mono text-[#F1F4F8] ${className}`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2.5">
        <div className="flex items-center gap-2 text-xs">
          <Radio className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[#F1F4F8]">
            Dominant Environmental Threat • {stationName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#8E9BAE]">
          <span className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#8E9BAE]">
            MODELLED: AQUAGUARD-RISK-v0.3
          </span>
          <span>Confidence: 84%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Dominant Metric Block */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#8E9BAE]">
              {categoryName}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[rgba(239,68,68,0.15)] text-[#F87171] border border-[rgba(239,68,68,0.3)]">
              {severity} RISK
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-black text-[#F1F4F8] tabular-nums tracking-tight">
              {score}
            </span>
            <span className="text-lg font-bold text-[#8E9BAE]">/ 100</span>
          </div>

          <p className="text-xs text-[#8E9BAE] font-sans leading-relaxed">
            Root-zone soil moisture is <strong>41.8% below seasonal baseline</strong>. Persistent high vapor pressure deficit accelerates vegetative wilting across the Juja agricultural catchment.
          </p>

          <div className="pt-1 flex items-center gap-3 text-xs">
            <Link
              href="/risk"
              className="inline-flex items-center gap-1 text-[#06B6D4] hover:underline font-medium transition-colors"
            >
              <span>Driver Attribution</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#5C6777]">|</span>
            <Link
              href="/scenarios"
              className="inline-flex items-center gap-1 text-[#F59E0B] hover:underline font-medium transition-colors"
            >
              <span>Launch Twin Simulation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Drivers Attribution Breakdown */}
        <div className="lg:col-span-7 p-3.5 rounded bg-[#15191F] border border-[rgba(255,255,255,0.06)] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8E9BAE] border-b border-[rgba(255,255,255,0.06)] pb-1.5">
            <span className="uppercase tracking-wider text-[11px]">Attribution Drivers</span>
            <span className="text-[10px] text-[#5C6777]">Weight & Contribution</span>
          </div>

          <div className="space-y-2">
            {drivers.map((drv, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F1F4F8]">{drv.factor}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#5C6777] text-[10px]">val: {drv.currentValue} ({drv.deviation})</span>
                    <span className="text-[#F59E0B] font-bold tabular-nums w-10 text-right">
                      {drv.contributionPct}%
                    </span>
                  </div>
                </div>

                {/* Contribution Bar */}
                <div className="h-1.5 w-full bg-[#1F2630] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#06B6D4] rounded-full transition-all duration-500"
                    style={{ width: `${drv.contributionPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[10px] text-[#5C6777]">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#06B6D4]" />
              Formulation: Hybrid Physics-Informed Gradient Booster
            </span>
            <span className="text-[#10B981]">100% Traceable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
