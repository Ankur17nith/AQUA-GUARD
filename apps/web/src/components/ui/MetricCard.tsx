'use client';

import React, { useState } from 'react';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { DataStatusBadge } from './DataStatusBadge';
import { DataStatus } from '@aquaguard/shared-types';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  baseline?: string | number;
  deviation?: string;
  deviationTrend?: 'UP' | 'DOWN' | 'NEUTRAL';
  status?: DataStatus;
  source?: string;
  provenanceExplanation?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  baseline,
  deviation,
  deviationTrend,
  status = 'OBSERVED',
  source = 'Conduit',
  provenanceExplanation,
  className = ''
}: MetricCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={`p-4 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-slate-700/80 transition-all flex flex-col justify-between relative ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono font-medium tracking-tight text-slate-400 uppercase">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <DataStatusBadge status={status} source={source} />
          {provenanceExplanation && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              title="View Scientific Provenance"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono tabular-nums">
          {value}
        </span>
        {unit && <span className="text-sm font-mono text-slate-400">{unit}</span>}
      </div>

      {/* Baseline & Deviation Comparison */}
      {(baseline !== undefined || deviation !== undefined) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
          {baseline !== undefined && (
            <div className="text-slate-400 text-[11px]">
              Baseline: <span className="text-slate-300 font-semibold">{baseline}</span>
            </div>
          )}
          {deviation && (
            <div
              className={`flex items-center gap-0.5 text-[11px] font-bold ${
                deviationTrend === 'DOWN'
                  ? 'text-red-400'
                  : deviationTrend === 'UP'
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }`}
            >
              {deviationTrend === 'DOWN' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {deviationTrend === 'UP' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {deviationTrend === 'NEUTRAL' && <Minus className="w-3.5 h-3.5" />}
              <span>{deviation}</span>
            </div>
          )}
        </div>
      )}

      {/* Scientific Provenance Popover (Requirement #83) */}
      {showInfo && provenanceExplanation && (
        <div className="absolute inset-0 z-20 p-3.5 rounded-lg bg-slate-900 border border-cyan-500/50 shadow-2xl flex flex-col justify-between animate-in fade-in">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-2">
              <span>Scientific Provenance</span>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
              {provenanceExplanation}
            </p>
          </div>
          <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
            <span>Source: {source}</span>
            <span className="text-emerald-400">Status: {status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
