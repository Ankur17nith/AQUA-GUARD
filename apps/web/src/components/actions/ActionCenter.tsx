'use client';

import React, { useState } from 'react';
import { ActionRecommendation } from '@aquaguard/shared-types';
import { CheckCircle2, Check } from 'lucide-react';

interface ActionCenterProps {
  actions: ActionRecommendation[];
  className?: string;
}

export function ActionCenter({ actions, className = '' }: ActionCenterProps) {
  const [activeActions, setActiveActions] = useState<ActionRecommendation[]>(actions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setActiveActions((prev) =>
      prev.map((act) =>
        act.id === id
          ? {
              ...act,
              status: act.status === 'EXECUTED' ? 'PENDING' : 'EXECUTED'
            }
          : act
      )
    );
  };

  const urgencies = ['IMMEDIATE', 'NEXT 24 HOURS', 'NEXT 7 DAYS', 'MONITOR'] as const;

  const urgencyColors = {
    IMMEDIATE: {
      badge: 'bg-red-950/80 text-red-300 border-red-800/80',
      dot: 'bg-red-500'
    },
    'NEXT 24 HOURS': {
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
      dot: 'bg-amber-500'
    },
    'NEXT 7 DAYS': {
      badge: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
      dot: 'bg-blue-500'
    },
    MONITOR: {
      badge: 'bg-slate-900 text-slate-400 border-slate-800',
      dot: 'bg-slate-500'
    }
  };

  return (
    <div className={`space-y-6 font-mono ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span>Environmental Decision Support Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Concrete, prioritized interventions derived from Conduit observations and verified physical models.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Interventions:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
            {activeActions.length} Actions
          </span>
        </div>
      </div>

      {/* Urgency Columns / Groupings (Requirement #80) */}
      <div className="space-y-6">
        {urgencies.map((urgency) => {
          const group = activeActions.filter((a) => a.urgency === urgency);
          if (group.length === 0) return null;

          const col = urgencyColors[urgency];

          return (
            <div key={urgency} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {urgency} INTERVENTIONS
                </span>
                <span className="text-[10px] text-slate-400">({group.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.map((act) => {
                  const isExpanded = expandedId === act.id;
                  const isDone = act.status === 'EXECUTED';

                  return (
                    <div
                      key={act.id}
                      className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'border-emerald-900/60 bg-emerald-950/20 opacity-80'
                          : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${col.badge}`}>
                              {act.urgency}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Sector: {act.targetSector}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleStatus(act.id)}
                            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{isDone ? 'EXECUTED' : 'MARK DONE'}</span>
                          </button>
                        </div>

                        {/* Title */}
                        <h4 className={`text-sm font-bold text-slate-100 mt-2.5 leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {act.title}
                        </h4>

                        {/* Reason */}
                        <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                          {act.reason}
                        </p>
                      </div>

                      {/* Action Traceability Drawer (Requirement #81) */}
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : act.id)}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full cursor-pointer"
                        >
                          <span className="font-bold">
                            {isExpanded ? 'Hide Traceability & Evidence' : 'Why this action? (Evidence Trace)'}
                          </span>
                          <span>{isExpanded ? '▲' : '▼'}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 p-3 rounded bg-slate-950 border border-slate-800 text-xs space-y-2 animate-in fade-in">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                                Verified Sensor Evidence:
                              </span>
                              {act.evidence.map((ev, i) => (
                                <div key={i} className="text-slate-300 text-[11px] flex items-start gap-1.5 font-sans">
                                  <span className="text-cyan-400">•</span>
                                  <span>{ev}</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-slate-800/80">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                                Expected Effect:
                              </span>
                              <p className="text-emerald-300 text-[11px] font-sans">
                                {act.expectedEffect}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                                Modelled Avoided Loss:
                              </span>
                              <p className="text-amber-300 text-[11px] font-sans font-bold">
                                {act.avoidedLossEstimate}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
