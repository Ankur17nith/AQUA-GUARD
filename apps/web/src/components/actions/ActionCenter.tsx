'use client';

import React, { useState } from 'react';
import { ActionRecommendation } from '@aquaguard/shared-types';
import { CheckCircle2, Check, ArrowRight, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface ActionCenterProps {
  actions: ActionRecommendation[];
  className?: string;
}

export function ActionCenter({ actions, className = '' }: ActionCenterProps) {
  const [activeActions, setActiveActions] = useState<ActionRecommendation[]>(actions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setActiveActions((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const newStatus = act.status === 'EXECUTED' ? 'PENDING' : 'EXECUTED';
          if (newStatus === 'EXECUTED') {
            toast.success(`Action marked executed: ${act.title}`);
          }
          return { ...act, status: newStatus };
        }
        return act;
      })
    );
  };

  const urgencies = ['IMMEDIATE', 'NEXT 24 HOURS', 'NEXT 7 DAYS', 'MONITOR'] as const;

  const urgencyPillStyles = {
    IMMEDIATE: 'bg-[rgba(239,68,68,0.15)] text-[#F87171] border-[rgba(239,68,68,0.3)]',
    'NEXT 24 HOURS': 'bg-[rgba(245,158,11,0.15)] text-[#FBBF24] border-[rgba(245,158,11,0.3)]',
    'NEXT 7 DAYS': 'bg-[rgba(2,132,199,0.15)] text-[#38BDF8] border-[rgba(2,132,199,0.3)]',
    MONITOR: 'bg-[rgba(255,255,255,0.06)] text-[#8E9BAE] border-[rgba(255,255,255,0.08)]'
  };

  return (
    <div className={`space-y-5 font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418]">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-[#F1F4F8] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
            <span>Environmental Decision & Action Engine</span>
          </h1>
          <p className="text-xs text-[#8E9BAE] mt-0.5 font-sans">
            Priority interventions derived from physical Conduit observations, soil moisture deficit, and calibrated risk thresholds.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8E9BAE]">Active Queue:</span>
          <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#F1F4F8] border border-[rgba(255,255,255,0.08)] font-semibold">
            {activeActions.filter((a) => a.status !== 'EXECUTED').length} Pending
          </span>
        </div>
      </div>

      {/* Decision Workflow Banner: RISK -> EVIDENCE -> ACTION -> OUTCOME */}
      <div className="p-3 rounded border border-[rgba(255,255,255,0.06)] bg-[#15191F] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8E9BAE]">
        <div className="flex items-center gap-2">
          <span className="text-[#F87171] font-bold">1. ASSESSED RISK</span>
          <ArrowRight className="w-3 h-3 text-[#5C6777]" />
          <span className="text-[#FBBF24] font-bold">2. SENSOR EVIDENCE</span>
          <ArrowRight className="w-3 h-3 text-[#5C6777]" />
          <span className="text-[#06B6D4] font-bold">3. INTERVENTION</span>
          <ArrowRight className="w-3 h-3 text-[#5C6777]" />
          <span className="text-[#10B981] font-bold">4. AVOIDED LOSS</span>
        </div>
        <span className="text-[10px] text-[#5C6777]">Strict Causal Provenance</span>
      </div>

      {/* Urgency Columns */}
      <div className="space-y-5">
        {urgencies.map((urgency) => {
          const group = activeActions.filter((a) => a.urgency === urgency);
          if (group.length === 0) return null;

          return (
            <div key={urgency} className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F1F4F8]">
                  {urgency} INTERVENTIONS
                </span>
                <span className="text-[10px] text-[#5C6777]">({group.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {group.map((act) => {
                  const isExpanded = expandedId === act.id;
                  const isDone = act.status === 'EXECUTED';

                  return (
                    <div
                      key={act.id}
                      className={`p-4 rounded border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.04)] opacity-75'
                          : 'border-[rgba(255,255,255,0.08)] bg-[#111418] hover:border-[rgba(255,255,255,0.14)]'
                      }`}
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-semibold border ${urgencyPillStyles[urgency]}`}>
                              {act.urgency}
                            </span>
                            <span className="text-[10px] text-[#5C6777]">
                              Sector: {act.targetSector}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleStatus(act.id)}
                            className={`flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.3)] font-semibold'
                                : 'bg-[#15191F] text-[#8E9BAE] hover:text-[#F1F4F8] border-[rgba(255,255,255,0.08)]'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{isDone ? 'EXECUTED' : 'MARK DONE'}</span>
                          </button>
                        </div>

                        {/* Title */}
                        <h2 className={`text-sm font-semibold text-[#F1F4F8] mt-2 leading-snug ${isDone ? 'line-through text-[#8E9BAE]' : ''}`}>
                          {act.title}
                        </h2>

                        {/* Reason */}
                        <p className="text-xs text-[#8E9BAE] mt-1.5 font-sans leading-relaxed">
                          {act.reason}
                        </p>
                      </div>

                      {/* Evidence & Traceability Drawer */}
                      <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.05)]">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : act.id)}
                          className="text-[11px] text-[#06B6D4] hover:underline flex items-center justify-between w-full cursor-pointer"
                        >
                          <span className="font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {isExpanded ? 'Hide Evidence & Expected Outcome' : 'Why this action? (Evidence Trace)'}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-2.5 rounded bg-[#15191F] border border-[rgba(255,255,255,0.06)] space-y-2 animate-in fade-in">
                            <div>
                              <span className="text-[10px] text-[#8E9BAE] uppercase font-semibold block mb-1">
                                Verified Physical Evidence:
                              </span>
                              {act.evidence.map((ev, i) => (
                                <div key={i} className="text-[#F1F4F8] text-[10.5px] flex items-start gap-1.5 font-sans">
                                  <span className="text-[#06B6D4]">•</span>
                                  <span>{ev}</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-1.5 border-t border-[rgba(255,255,255,0.05)]">
                              <span className="text-[10px] text-[#8E9BAE] uppercase font-semibold block mb-0.5">
                                Projected Outcome:
                              </span>
                              <p className="text-[#10B981] text-[10.5px] font-sans">
                                {act.expectedEffect}
                              </p>
                            </div>

                            <div className="pt-1.5 border-t border-[rgba(255,255,255,0.05)]">
                              <span className="text-[10px] text-[#8E9BAE] uppercase font-semibold block mb-0.5">
                                Avoided Harvest Loss:
                              </span>
                              <p className="text-[#FBBF24] text-[10.5px] font-bold">
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
