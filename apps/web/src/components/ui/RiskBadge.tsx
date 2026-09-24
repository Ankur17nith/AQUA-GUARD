import React from 'react';
import { RiskSeverity } from '@aquaguard/shared-types';

interface RiskBadgeProps {
  severity: RiskSeverity;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ severity, className = '', size = 'md' }: RiskBadgeProps) {
  const configs: Record<RiskSeverity, { bg: string; text: string; border: string; dot: string }> = {
    CRITICAL: {
      bg: 'bg-red-950/80',
      text: 'text-red-300',
      border: 'border-red-800/80',
      dot: 'bg-red-500'
    },
    HIGH: {
      bg: 'bg-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-800/80',
      dot: 'bg-amber-500'
    },
    MEDIUM: {
      bg: 'bg-yellow-950/80',
      text: 'text-yellow-300',
      border: 'border-yellow-800/80',
      dot: 'bg-yellow-500'
    },
    LOW: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-800/80',
      dot: 'bg-emerald-500'
    }
  };

  const c = configs[severity] || configs.LOW;
  const sizeClasses = {
    sm: 'text-[9.5px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded font-mono font-bold border ${c.bg} ${c.text} ${c.border} ${sizeClasses} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <span>{severity}</span>
    </span>
  );
}
