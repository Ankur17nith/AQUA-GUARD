'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  fallbackStations,
  fallbackEnvironment,
  fallbackRisks,
  fallbackActions,
  fallbackAlerts
} from '@/lib/demoData';
import { HeroEnvironmentalState } from '@/components/ui/HeroEnvironmentalState';
import { MetricStrip, MetricItem } from '@/components/ui/MetricStrip';
import { MapContainer } from '@/components/map/MapContainer';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  ExternalLink,
  Bell,
  MapPin,
  Bot,
  Radio
} from 'lucide-react';

export default function DashboardPage() {
  const [stationId, setStationId] = useState<number>(62);

  const { data: stations = fallbackStations } = useQuery({
    queryKey: ['stations'],
    queryFn: api.getStations
  });

  const { data: env = fallbackEnvironment } = useQuery({
    queryKey: ['env', stationId],
    queryFn: () => api.getCurrentEnvironment(stationId)
  });

  const { data: risks = fallbackRisks } = useQuery({
    queryKey: ['risks', stationId],
    queryFn: () => api.getCurrentRisks(stationId)
  });

  const { data: actions = fallbackActions } = useQuery({
    queryKey: ['actions', stationId],
    queryFn: () => api.getActions(stationId)
  });

  const { data: alerts = fallbackAlerts } = useQuery({
    queryKey: ['alerts', stationId],
    queryFn: () => api.getAlerts(stationId)
  });

  const currentStation = stations.find((s) => s.id === stationId) || stations[0];

  // Prepare unified metric strip items
  const metricItems: MetricItem[] = [
    {
      id: 'rain',
      label: 'Precipitation',
      value: env.rainfallCurrentMm,
      unit: 'mm',
      baseline: `${env.rainfallBaselineMm} mm`,
      deviation: `${env.rainfallAnomalyPct}%`,
      deviationTrend: 'DOWN',
      status: 'OBSERVED',
      source: 'Conduit Dual Gauges',
      provenanceExplanation: 'Recorded by dual tipping-bucket rain gauges (rg1, rg2) at JKUAT. Indicates 0.0 mm diurnal accumulation.'
    },
    {
      id: 'sm',
      label: 'Root-zone Moisture',
      value: env.soilMoistureCurrentPct,
      unit: '%',
      baseline: `${env.soilMoistureBaselinePct}%`,
      deviation: `${env.soilMoistureAnomalyPct}%`,
      deviationTrend: 'DOWN',
      status: 'DERIVED',
      source: 'Hydrological Balance',
      provenanceExplanation: 'Soil water mass balance model calibrated with Sentinel-1 SAR backscatter. Reflects severe root-zone desiccation.'
    },
    {
      id: 'temp',
      label: 'Surface Temperature',
      value: env.temperatureCurrentC,
      unit: '°C',
      baseline: `${env.temperatureBaselineC}°C`,
      deviation: `+${env.temperatureAnomalyC}°C`,
      deviationTrend: 'UP',
      status: 'OBSERVED',
      source: 'Conduit SHT & BMX',
      provenanceExplanation: 'Consensus ambient thermal reading across SHT31, MCP9808, and BMX280 precision thermistors at 2-meter instrument height.'
    },
    {
      id: 'et0',
      label: 'Evaporative Demand',
      value: env.evapotranspirationMmDay,
      unit: 'mm/day',
      baseline: '3.8 mm/day',
      deviation: '+21.5%',
      deviationTrend: 'UP',
      status: 'DERIVED',
      source: 'Hargreaves-Samani',
      provenanceExplanation: 'Atmospheric drying potential computed from Conduit thermal diurnal peak, SI1145 solar irradiance, and wind velocity.'
    }
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-mono">
      {/* 1. Header Command Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
            <h1 className="text-sm font-bold tracking-wider text-[#F1F4F8] uppercase">
              Environmental Command Center
            </h1>
          </div>
          <span className="hidden sm:inline text-xs text-[#5C6777]">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8E9BAE]">
            <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>{currentStation.county} County, Kenya</span>
            <span className="text-[#5C6777]">({currentStation.elevationMeters}m elev)</span>
          </div>
        </div>

        {/* Station Dropdown & Alerts Badge */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/alerts"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[11px] text-[#F87171] hover:bg-[rgba(239,68,68,0.2)] transition-colors"
          >
            <Bell className="w-3 h-3 text-[#EF4444]" />
            <span>{alerts.filter((a) => a.status === 'ACTIVE').length} ACTIVE ALERTS</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#8E9BAE]">Station:</span>
            <select
              value={stationId}
              onChange={(e) => setStationId(Number(e.target.value))}
              aria-label="Select Environmental Station"
              className="bg-[#15191F] border border-[rgba(255,255,255,0.1)] rounded px-2.5 py-1 text-xs text-[#F1F4F8] focus:outline-none focus:border-[#06B6D4] cursor-pointer"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.isPrimaryConduit ? `★ ${s.name}` : s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Hero Environmental State (Dominant State Metric) */}
      <HeroEnvironmentalState primaryRisk={risks[0]} stationName={currentStation.name} />

      {/* 3. Compact Continuous Metric Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#8E9BAE] px-0.5">
          <span className="uppercase tracking-wider text-[11px]">Primary Physical State (Observed & Derived)</span>
          <Link href="/timeline" className="text-[#06B6D4] hover:underline flex items-center gap-1 text-[11px]">
            <span>View Timeline</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <MetricStrip metrics={metricItems} />
      </div>

      {/* 4. Active Compound Hazard Notice */}
      <div className="p-3.5 rounded border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.06)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F1F4F8] text-xs uppercase tracking-wider">
                Active Compound Hazard: Agricultural & Hydrological Drought Concurrence
              </span>
              <RiskBadge severity="HIGH" size="sm" />
            </div>
            <p className="text-[11px] text-[#8E9BAE] font-sans mt-0.5">
              Simultaneous 100% rainfall deficit + 41.8% root-zone moisture collapse + thermal evaporative surge detected across Juja catchment.
            </p>
          </div>
        </div>
        <Link
          href="/scenarios"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition-colors shrink-0"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>SIMULATE SCENARIO</span>
        </Link>
      </div>

      {/* 5. Geospatial Workspace & Decision Engine Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E9BAE]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Geospatial Risk Observatory
            </span>
            <Link href="/map" className="text-[#06B6D4] hover:underline flex items-center gap-1 text-[11px]">
              <span>Expand Map Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <MapContainer
            stations={stations}
            selectedStationId={stationId}
            onSelectStation={(s) => setStationId(s.id)}
          />
        </div>

        {/* Analytical Risk & Interventions Split (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Assessed Climate Hazards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8E9BAE]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Assessed Hazard Threats
              </span>
              <Link href="/risk" className="text-[#06B6D4] hover:underline text-[11px]">
                All Hazards →
              </Link>
            </div>

            <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] divide-y divide-[rgba(255,255,255,0.06)]">
              {risks.slice(0, 3).map((risk, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-[#15191F] transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#F1F4F8] text-xs uppercase">
                        {risk.category.replace('_', ' ')}
                      </span>
                      <RiskBadge severity={risk.severity} size="sm" />
                    </div>
                    <div className="text-[10px] text-[#8E9BAE] font-sans">
                      Horizon: {risk.horizon} • Confidence: {risk.confidencePct}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#F1F4F8] tabular-nums">
                      {Math.round(risk.probabilityPct)}%
                    </div>
                    <div className="text-[9px] text-[#5C6777] uppercase font-semibold">Probability</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Interventions Quick Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8E9BAE]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Priority Interventions Queue
              </span>
              <Link href="/actions" className="text-[#06B6D4] hover:underline text-[11px]">
                Action Engine ({actions.length}) →
              </Link>
            </div>

            <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] divide-y divide-[rgba(255,255,255,0.06)]">
              {actions.slice(0, 2).map((act) => (
                <div key={act.id} className="p-3 hover:bg-[#15191F] transition-colors space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#F87171] font-bold tracking-wider">{act.urgency}</span>
                    <span className="text-[#5C6777]">{act.targetSector}</span>
                  </div>
                  <div className="font-semibold text-[#F1F4F8] text-xs leading-snug">{act.title}</div>
                  <div className="text-[10px] text-[#FBBF24]">
                    Avoided Loss: <strong className="font-medium">{act.avoidedLossEstimate}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guardian Insight Callout */}
          <div className="p-3 rounded border border-[#06B6D4]/30 bg-[#0E151B] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4] shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[#06B6D4] font-bold text-[11px] block">Guardian Copilot Available</span>
                <span className="text-[#8E9BAE] text-[10px] font-sans">Query physical telemetry & scenario impacts</span>
              </div>
            </div>
            <Link
              href="/copilot"
              className="px-2.5 py-1 rounded bg-[#06B6D4] hover:bg-[#0891B2] text-slate-950 font-bold text-[10.5px] transition-colors shrink-0"
            >
              Ask Guardian
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
