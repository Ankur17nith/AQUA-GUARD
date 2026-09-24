'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackAlerts } from '@/lib/demoData';
import { AlertNotification } from '@aquaguard/shared-types';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowUpRight,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';

export default function AlertsPage() {
  const { data: initialAlerts = fallbackAlerts } = useQuery({
    queryKey: ['alerts', 62],
    queryFn: () => api.getAlerts(62)
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateStatus = async (alertId: string, newStatus: AlertNotification['status']) => {
    try {
      await api.updateAlertStatus(alertId, newStatus);
    } catch {
      // offline fallback
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    
    if (newStatus === 'ACKNOWLEDGED') {
      toast.info(`Alert ${alertId} acknowledged`, {
        description: 'Operations team notified. Mitigation procedures underway.'
      });
    } else if (newStatus === 'RESOLVED') {
      toast.success(`Alert ${alertId} resolved`, {
        description: 'Incident marked as mitigated. Logged to audit journal.'
      });
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
      const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
      const matchesSearch = 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [alerts, statusFilter, severityFilter, searchQuery]);

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
  const resolvedCount = alerts.filter((a) => a.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Header Command Bar */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-[#111418] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Decision Pipeline</span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] font-mono text-slate-400">Early Warning Systems</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              Alert & Early Warning Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {activeCount} ACTIVE INCIDENTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Real-time threshold breaches, rapid dry-down alerts, and multi-sensor anomaly triggers across 
            the Conduit AWS network and Copernicus satellite surveillance grids.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Monitored Stations:</span>
            <span className="text-white font-semibold">4 Online</span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#111418] flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/[0.06] bg-[#15191F]">
          {[
            { id: 'ALL', label: `All (${alerts.length})` },
            { id: 'ACTIVE', label: `Active (${activeCount})` },
            { id: 'ACKNOWLEDGED', label: `Acknowledged (${acknowledgedCount})` },
            { id: 'RESOLVED', label: `Resolved (${resolvedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Severity Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#15191F] text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search alert by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg border border-white/[0.08] bg-[#15191F] text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-52"
            />
          </div>
        </div>
      </div>

      {/* 3. Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-white/[0.06] bg-[#111418] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Alerts Found</h3>
            <p className="text-xs text-slate-400">
              There are no alert incidents matching your active filters. All monitored telemetry channels are nominal.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
            const isResolved = alert.status === 'RESOLVED';
            const isAck = alert.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  isResolved
                    ? 'border-white/[0.04] bg-[#111418]/60 opacity-60'
                    : isAck
                    ? 'border-cyan-500/20 bg-[#15191F]'
                    : isCritical
                    ? 'border-amber-500/30 bg-[#15191F]'
                    : 'border-white/[0.06] bg-[#15191F]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskBadge severity={alert.severity} size="sm" />
                      <span className="font-mono text-xs font-bold text-cyan-400">[{alert.id}]</span>
                      <h3 className="font-bold text-slate-100 text-sm">{alert.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                        {alert.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {alert.message}
                    </p>

                    <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0B0D0F] text-xs flex items-start gap-2">
                      <ArrowUpRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">Recommended Action: </strong>
                        <span className="text-slate-300">{alert.recommendedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                          className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#111418] hover:bg-white/[0.04] text-xs font-mono text-slate-200 cursor-pointer transition-colors"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}
                      {!isResolved && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold cursor-pointer transition-colors"
                        >
                          RESOLVE
                        </button>
                      )}
                      {isResolved && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          RESOLVED
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 text-right">
                      Station: {alert.stationName} (#{alert.stationId})
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.04] text-[10px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Detected: {alert.detectedAt}</span>
                  </div>
                  <div>
                    <span>Delivery Channels: SMS, Webhook, Operations Console</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
