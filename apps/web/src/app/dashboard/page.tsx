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
import { MetricCard } from '@/components/ui/MetricCard';
import { RiskCard } from '@/components/ui/RiskCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { DataStatusBadge } from '@/components/ui/DataStatusBadge';
import { MapContainer } from '@/components/map/MapContainer';
import { 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  ExternalLink,
  Bell
} from 'lucide-react';
import { HeroEnvironmentalState } from '@/components/ui/HeroEnvironmentalState';

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Location Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider text-slate-100 uppercase">
              Environmental Command Center
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              ● TELEMETRY ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time physical monitoring and risk intelligence for <strong>{currentStation.name}</strong>.
          </p>
        </div>

        {/* Station Dropdown & Alerts */}
        <div className="flex items-center gap-3">
          <Link
            href="/alerts"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-[11px] text-red-300 hover:bg-red-900/60 transition-colors"
          >
            <Bell className="w-3 h-3 text-red-400 animate-pulse" />
            <span>{alerts.filter((a) => a.status === 'ACTIVE').length} ALERTS</span>
          </Link>

          <span className="text-xs text-slate-400">Station:</span>
          <select
            value={stationId}
            onChange={(e) => setStationId(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.isPrimaryConduit ? `★ [PRIMARY] ${s.name}` : s.name} ({s.county})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Hero Environmental State Visualization (Requirement #8 & #12) */}
      <HeroEnvironmentalState primaryRisk={risks[0]} stationName={currentStation.name} />

      {/* 3. Top Risk & Health KPI Ribbon (Requirement #42) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-lg border border-red-900/50 bg-red-950/20 font-mono">
          <div className="text-[10px] text-red-300 uppercase font-bold flex justify-between">
            <span>Drought Risk</span>
            <span>HIGH</span>
          </div>
          <div className="text-2xl font-black text-red-400 mt-1 tabular-nums">78.4%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Horizon: 7–14 days</div>
        </div>

        <div className="p-3.5 rounded-lg border border-amber-900/50 bg-amber-950/20 font-mono">
          <div className="text-[10px] text-amber-300 uppercase font-bold flex justify-between">
            <span>Water Stress</span>
            <span>HIGH</span>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1 tabular-nums">78.5%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">-4.6 mm/day net</div>
        </div>

        <div className="p-3.5 rounded-lg border border-yellow-900/50 bg-yellow-950/20 font-mono">
          <div className="text-[10px] text-yellow-300 uppercase font-bold flex justify-between">
            <span>Heat Hazard</span>
            <span>MED</span>
          </div>
          <div className="text-2xl font-black text-yellow-400 mt-1 tabular-nums">58.0%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">WBGT: 22.7°C</div>
        </div>

        <div className="p-3.5 rounded-lg border border-emerald-900/50 bg-emerald-950/20 font-mono">
          <div className="text-[10px] text-emerald-300 uppercase font-bold flex justify-between">
            <span>Flood Risk</span>
            <span>LOW</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">4.0%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">High soil capacity</div>
        </div>

        <div className="p-3.5 rounded-lg border border-cyan-900/50 bg-cyan-950/20 font-mono">
          <div className="text-[10px] text-cyan-300 uppercase font-bold flex justify-between">
            <span>Crop Vigor</span>
            <span>DEFICIT</span>
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1 tabular-nums">0.38</div>
          <div className="text-[10px] text-slate-400 mt-0.5">NDVI (-17.4%)</div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 font-mono">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
            <span>Data Health</span>
            <span className="text-emerald-400">96.4%</span>
          </div>
          <div className="text-2xl font-black text-slate-200 mt-1 tabular-nums">EXCELLENT</div>
          <div className="text-[10px] text-slate-400 mt-0.5">23/24 sensors live</div>
        </div>
      </div>

      {/* 3. Current Environmental State Cards (Section 5: WHAT IS HAPPENING?) */}
      <div>
        <div className="flex items-center justify-between mb-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Current Physical Environmental State
            </span>
            <DataStatusBadge status="OBSERVED" source="Conduit@Empathy" timeAgo="1 min ago" />
          </div>
          <Link href="/timeline" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            <span>Full Chronological Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Precipitation (Dual Gauges)"
            value={env.rainfallCurrentMm}
            unit="mm"
            baseline={`${env.rainfallBaselineMm} mm`}
            deviation={`${env.rainfallAnomalyPct}%`}
            deviationTrend="DOWN"
            status="OBSERVED"
            source="Conduit Tipping Bucket"
            provenanceExplanation="Measured directly by dual independent tipping-bucket rain gauges at the JKUAT field station. Represents accumulated rainfall over the current diurnal cycle."
          />

          <MetricCard
            label="Root-zone Soil Moisture"
            value={env.soilMoistureCurrentPct}
            unit="%"
            baseline={`${env.soilMoistureBaselinePct}%`}
            deviation={`${env.soilMoistureAnomalyPct}%`}
            deviationTrend="DOWN"
            status="DERIVED"
            source="Hydrological Balance + Radar"
            provenanceExplanation="Calculated via root-zone soil water mass balance integrating antecedent Conduit rainfall, temperature-driven evapotranspiration, and calibrated with Copernicus Sentinel-1 microwave backscatter."
          />

          <MetricCard
            label="Surface Air Temperature"
            value={env.temperatureCurrentC}
            unit="°C"
            baseline={`${env.temperatureBaselineC}°C`}
            deviation={`+${env.temperatureAnomalyC}°C`}
            deviationTrend="UP"
            status="OBSERVED"
            source="Conduit SHT & BMX"
            provenanceExplanation="Consensus measurement between BMX, MCP, and SHT precision thermistors at 2-meter instrument height. High thermal reading indicates increased vapor pressure deficit."
          />

          <MetricCard
            label="Evapotranspiration Demand (ET0)"
            value={env.evapotranspirationMmDay}
            unit="mm/day"
            baseline="3.8 mm/day"
            deviation="+21.5%"
            deviationTrend="UP"
            status="DERIVED"
            source="Hargreaves-Samani Model"
            provenanceExplanation="Potential evapotranspiration estimated using Conduit temperature extrema, SI1145 downwelling solar irradiance, and wind velocity."
          />
        </div>
      </div>

      {/* 4. Active Risk Events & Compound Warning */}
      <div className="p-4 rounded-lg border border-amber-800/60 bg-amber-950/20 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100 text-xs uppercase tracking-wider">
                  Active Compound Event: Compound Agricultural & Hydrological Water Stress
                </span>
                <RiskBadge severity="HIGH" size="sm" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Simultaneous 100% rainfall deficit + 41.8% soil moisture depletion + daytime thermal surge detected at JKUAT catchment.
              </p>
            </div>
          </div>
          <Link
            href="/scenarios"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>SIMULATE IN DIGITAL TWIN</span>
          </Link>
        </div>
      </div>

      {/* 5. Geospatial Intelligence & Risk Center Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View (7 columns) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Geospatial Risk Distribution
            </span>
            <Link href="/map" className="text-cyan-400 hover:underline flex items-center gap-1">
              <span>Expand Full Map</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <MapContainer stations={stations} selectedStationId={stationId} onSelectStation={(s) => setStationId(s.id)} />
        </div>

        {/* Active Risks Breakdown (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Assessed Climate Risks
            </span>
            <Link href="/risk" className="text-cyan-400 hover:underline flex items-center gap-1">
              <span>View All Drivers</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {risks.slice(0, 2).map((risk, idx) => (
              <RiskCard key={idx} risk={risk} />
            ))}
          </div>

          {/* Recommended Interventions Quick Box */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 font-mono">
            <div className="flex items-center justify-between text-xs font-bold mb-3">
              <span className="text-slate-300 uppercase">Immediate Interventions</span>
              <Link href="/actions" className="text-cyan-400 hover:underline text-[11px]">
                Action Center ({actions.length}) →
              </Link>
            </div>
            <div className="space-y-2">
              {actions.slice(0, 2).map((act) => (
                <div key={act.id} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-red-400 font-bold">{act.urgency}</span>
                    <span className="text-slate-400">{act.targetSector}</span>
                  </div>
                  <div className="font-bold text-slate-200 text-[11.5px] leading-snug">{act.title}</div>
                  <div className="text-[10px] text-amber-300 mt-1 font-bold">
                    Avoided Loss: {act.avoidedLossEstimate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
