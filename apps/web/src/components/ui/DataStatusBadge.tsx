import React from 'react';
import { DataStatus } from '@aquaguard/shared-types';

interface DataStatusBadgeProps {
  status: DataStatus;
  source?: string;
  timeAgo?: string;
  className?: string;
}

export function DataStatusBadge({ status, source = 'Conduit', timeAgo, className = '' }: DataStatusBadgeProps) {
  const configs: Record<DataStatus, { label: string; bg: string; text: string; border: string }> = {
    OBSERVED: {
      label: 'OBSERVED',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-400',
      border: 'border-emerald-800/60'
    },
    DERIVED: {
      label: 'DERIVED',
      bg: 'bg-cyan-950/70',
      text: 'text-cyan-400',
      border: 'border-cyan-800/60'
    },
    FORECAST: {
      label: 'FORECAST',
      bg: 'bg-blue-950/70',
      text: 'text-blue-400',
      border: 'border-blue-800/60'
    },
    MODELLED: {
      label: 'MODELLED',
      bg: 'bg-purple-950/70',
      text: 'text-purple-400',
      border: 'border-purple-800/60'
    },
    SIMULATED: {
      label: 'SIMULATED SCENARIO',
      bg: 'bg-amber-950/70',
      text: 'text-amber-400',
      border: 'border-amber-800/60'
    },
    CACHED: {
      label: 'CACHED',
      bg: 'bg-slate-900',
      text: 'text-slate-400',
      border: 'border-slate-800'
    }
  };

  const c = configs[status] || configs.OBSERVED;

  return (
    <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border ${c.bg} ${c.text} ${c.border} ${className}`}>
      <span className="font-bold">{c.label}</span>
      {source && <span className="opacity-70">({source})</span>}
      {timeAgo && <span className="text-slate-400">• {timeAgo}</span>}
    </div>
  );
}
