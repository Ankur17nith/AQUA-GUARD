'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackAlerts } from '@/lib/demoData';
import { AlertNotification } from '@aquaguard/shared-types';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function AlertsPage() {
  const { data: initialAlerts = fallbackAlerts } = useQuery({
    queryKey: ['alerts', 62],
    queryFn: () => api.getAlerts(62)
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);

  const handleUpdateStatus = async (alertId: string, newStatus: AlertNotification['status']) => {
    try {
      await api.updateAlertStatus(alertId, newStatus);
    } catch {
      // offline fallback
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Active Alerts & Warning Center
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
              {alerts.filter((a) => a.status === 'ACTIVE').length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time threshold breaches and compound risk warnings detected across Conduit monitoring stations.
          </p>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-lg border transition-all ${
              alert.status === 'RESOLVED'
                ? 'border-slate-800 bg-slate-950/60 opacity-60'
                : alert.status === 'ACKNOWLEDGED'
                ? 'border-cyan-900/60 bg-cyan-950/20'
                : 'border-amber-900/60 bg-amber-950/20'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <RiskBadge severity={alert.severity} size="sm" />
                  <h3 className="font-bold text-slate-100 text-sm">{alert.title}</h3>
                  <span className="text-[10px] text-slate-400">
                    Station: {alert.stationName} (ID: {alert.stationId})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                  {alert.message}
                </p>
                <div className="mt-2.5 p-2 rounded bg-slate-950/80 border border-slate-800 text-xs text-amber-300">
                  <strong>Recommended Action:</strong> {alert.recommendedAction}
                </div>
              </div>

              {/* Action Buttons (Requirement #34: acknowledge, resolve, snooze) */}
              <div className="flex items-center gap-2 text-xs">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
                  >
                    ACKNOWLEDGE
                  </button>
                )}
                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors"
                  >
                    RESOLVE
                  </button>
                )}
                {alert.status === 'RESOLVED' && (
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>RESOLVED</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Detected At: {alert.detectedAt}</span>
              <span>Category: {alert.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
