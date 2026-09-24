'use client';

import React, { useState } from 'react';
import { RiskAssessment } from '@aquaguard/shared-types';
import { RiskBadge } from './RiskBadge';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface RiskCardProps {
  risk: RiskAssessment;
  onExplore?: () => void;
  className?: string;
}

export function RiskCard({ risk, onExplore, className = '' }: RiskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`p-4 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700/80 transition-all ${className}`}>
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold tracking-wider text-slate-100 text-sm font-mono uppercase">
              {risk.category.replace('_', ' ')}
            </h3>
            <RiskBadge severity={risk.severity} size="sm" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            Horizon: {risk.horizon} • Confidence: {risk.confidencePct}%
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
            {risk.probabilityPct}%
          </div>
          <div className="text-[10px] font-mono text-slate-400">Probability</div>
        </div>
      </div>

      {/* Driver Contribution Progress Bars */}
      <div className="mt-3.5 space-y-2">
        <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex justify-between">
          <span>Key Contributing Drivers</span>
          <span>Contribution Weight</span>
        </div>
        {risk.drivers.slice(0, 3).map((driver, i) => (
          <div key={i} className="text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-300">{driver.factor}</span>
              <span className="text-slate-400 font-bold">{driver.deviation} ({driver.contributionPct}%)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  driver.status === 'DEFICIT'
                    ? 'bg-amber-500'
                    : driver.status === 'ELEVATED'
                    ? 'bg-red-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, driver.contributionPct * 1.5)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Why Explanation Toggle */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => {
            setExpanded(!expanded);
            if (onExplore) onExplore();
          }}
          className="flex items-center justify-between w-full text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1 font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            {expanded ? 'Hide Model Explanation' : 'Why did the model detect this risk?'}
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="mt-2.5 p-3 rounded bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
              Explainable AI Drivers (Model: {risk.modelVersion}):
            </div>
            {risk.whyExplanation.map((explanation, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono font-bold">•</span>
                <span className="leading-relaxed">{explanation}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              Evidence: {risk.evidence.join(' | ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
