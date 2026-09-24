'use client';

import React, { useState } from 'react';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Minus, X } from 'lucide-react';
import { DataStatus } from '@aquaguard/shared-types';
import { DataStatusBadge } from './DataStatusBadge';

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  baseline?: string | number;
  deviation?: string;
  deviationTrend?: 'UP' | 'DOWN' | 'NEUTRAL';
  status: DataStatus;
  source: string;
  provenanceExplanation?: string;
}

interface MetricStripProps {
  metrics: MetricItem[];
  className?: string;
}

export function MetricStrip({ metrics, className = '' }: MetricStripProps) {
  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);

  const activeMetric = metrics.find((m) => m.id === activeInfoId);

  return (
    <div className={`relative rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] font-mono text-xs ${className}`}>
      {/* Horizontal Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.06)]">
        {metrics.map((m) => {
          return (
            <div
              key={m.id}
              className="p-3.5 flex flex-col justify-between hover:bg-[#15191F] transition-colors relative group"
            >
              {/* Top Row: Label & Status */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10.5px] uppercase tracking-wider text-[#8E9BAE] font-medium truncate">
                  {m.label}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <DataStatusBadge status={m.status} source={m.source} />
                  {m.provenanceExplanation && (
                    <button
                      onClick={() => setActiveInfoId(activeInfoId === m.id ? null : m.id)}
                      className="text-[#5C6777] hover:text-[#06B6D4] transition-colors cursor-pointer"
                      title="View sensor provenance"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Middle Row: Main Metric Value */}
              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-2xl font-bold tracking-tight text-[#F1F4F8] tabular-nums">
                  {m.value}
                </span>
                {m.unit && <span className="text-xs text-[#8E9BAE]">{m.unit}</span>}
              </div>

              {/* Bottom Row: Baseline & Deviation */}
              <div className="mt-1 pt-1.5 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between text-[10px]">
                {m.baseline !== undefined && (
                  <span className="text-[#5C6777] truncate">
                    Norm: <strong className="text-[#8E9BAE] font-normal">{m.baseline}</strong>
                  </span>
                )}
                {m.deviation && (
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold shrink-0 ${
                      m.deviationTrend === 'DOWN'
                        ? 'text-[#F87171]'
                        : m.deviationTrend === 'UP'
                        ? 'text-[#FBBF24]'
                        : 'text-[#8E9BAE]'
                    }`}
                  >
                    {m.deviationTrend === 'DOWN' && <ArrowDownRight className="w-3 h-3" />}
                    {m.deviationTrend === 'UP' && <ArrowUpRight className="w-3 h-3" />}
                    {m.deviationTrend === 'NEUTRAL' && <Minus className="w-3 h-3" />}
                    {m.deviation}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Provenance Inspection Modal / Drawer */}
      {activeMetric && activeMetric.provenanceExplanation && (
        <div className="absolute inset-0 z-20 p-4 rounded bg-[#15191F] border border-[#06B6D4]/50 shadow-2xl flex flex-col justify-between animate-in fade-in">
          <div>
            <div className="flex items-center justify-between text-xs text-[#06B6D4] font-bold border-b border-[rgba(255,255,255,0.08)] pb-1.5 mb-2">
              <span className="uppercase tracking-wider">
                Scientific Provenance: {activeMetric.label}
              </span>
              <button
                onClick={() => setActiveInfoId(null)}
                className="text-[#8E9BAE] hover:text-[#F1F4F8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#F1F4F8] font-sans leading-relaxed">
              {activeMetric.provenanceExplanation}
            </p>
          </div>

          <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] text-[#8E9BAE]">
            <span>Channel: {activeMetric.source}</span>
            <span className="text-[#10B981] font-semibold">Tier: {activeMetric.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
