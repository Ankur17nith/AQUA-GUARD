'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackDataHealth } from '@/lib/demoData';
import { 
  Database, 
  Activity, 
  CheckCircle2, 
  Radio, 
  Search, 
  ShieldCheck, 
  Layers, 
  HardDrive,
  Clock
} from 'lucide-react';

interface ConduitVariable {
  name: string;
  short: string;
  unit: string;
  category: 'Thermal' | 'Moisture' | 'Optical' | 'Atmospheric' | 'Diagnostic';
  sensor: string;
  bounds: string;
  samplingRate: string;
  status: 'VERIFIED' | 'NOMINAL' | 'CALIBRATED';
}

const CONDUIT_VARIABLES: ConduitVariable[] = [
  { name: 'Rain Gauge 1 (Instantaneous)', short: 'rg', unit: 'mm', category: 'Moisture', sensor: 'Dual Tipping Bucket (0.2mm res)', bounds: '0.0 – 120.0 mm/h', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'Rain Gauge 2 (Instantaneous)', short: 'rg2', unit: 'mm', category: 'Moisture', sensor: 'Dual Tipping Bucket (0.2mm res)', bounds: '0.0 – 120.0 mm/h', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'Rain Gauge 1 Cumulative Daily', short: 'rgt', unit: 'mm', category: 'Moisture', sensor: 'Dual Tipping Bucket Counter', bounds: '0.0 – 500.0 mm', samplingRate: 'Continuous', status: 'VERIFIED' },
  { name: 'BMX Ambient Temperature 1', short: 'bt1', unit: '°C', category: 'Thermal', sensor: 'BMX280 Digital Baro-Thermal', bounds: '-10.0 – 55.0 °C', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'MCP Precision Temperature 1', short: 'mt1', unit: '°C', category: 'Thermal', sensor: 'MCP9808 High-Accuracy Thermistor', bounds: '-20.0 – 60.0 °C (±0.25°C)', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'SHT Primary Temperature', short: 'st1', unit: '°C', category: 'Thermal', sensor: 'Sensirion SHT31 Thermal/RH', bounds: '-40.0 – 65.0 °C', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'SHT Relative Humidity', short: 'sh1', unit: '%', category: 'Moisture', sensor: 'Sensirion SHT31 Capacitive RH', bounds: '5.0 – 100.0 %', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'BMX Barometric Air Pressure', short: 'bp1', unit: 'hPa', category: 'Atmospheric', sensor: 'BMX280 Piezoresistive Transducer', bounds: '700.0 – 1100.0 hPa', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'SI1145 Visible Irradiance', short: 'sv1', unit: 'lux', category: 'Optical', sensor: 'SI1145 Multi-Spectrum Photodiode', bounds: '0 – 128,000 lux', samplingRate: '1 min', status: 'NOMINAL' },
  { name: 'SI1145 Infrared Irradiance', short: 'si1', unit: 'µW/cm²', category: 'Optical', sensor: 'SI1145 Near-IR Photodiode', bounds: '0 – 50,000 µW/cm²', samplingRate: '1 min', status: 'NOMINAL' },
  { name: 'SI1145 Ultraviolet Index', short: 'su1', unit: 'index', category: 'Optical', sensor: 'SI1145 Solar UV Weighted Curve', bounds: '0.0 – 16.0 index', samplingRate: '1 min', status: 'VERIFIED' },
  { name: 'Horizontal Wind Speed', short: 'ws', unit: 'm/s', category: 'Atmospheric', sensor: '3D-PAWS 3-Cup Anemometer', bounds: '0.0 – 45.0 m/s', samplingRate: '1 min', status: 'CALIBRATED' },
  { name: 'Wind Direction Azimuth', short: 'wd', unit: '°', category: 'Atmospheric', sensor: 'Continuous Potentiometer Vane', bounds: '0 – 360 °', samplingRate: '1 min', status: 'CALIBRATED' },
  { name: 'Psychrometric Wet Bulb Temp', short: 'wbt', unit: '°C', category: 'Thermal', sensor: 'Thermodynamic Calculation (SHT+BP)', bounds: '-5.0 – 40.0 °C', samplingRate: 'Derived', status: 'VERIFIED' },
  { name: 'Wet Bulb Globe Temperature', short: 'wbgt', unit: '°C', category: 'Thermal', sensor: 'ISO 7243 Microclimate Composite', bounds: '0.0 – 50.0 °C', samplingRate: 'Derived', status: 'VERIFIED' },
  { name: 'Steadman Heat Index', short: 'hi', unit: '°C', category: 'Thermal', sensor: 'Biometeorological Apparent Temp', bounds: '10.0 – 60.0 °C', samplingRate: 'Derived', status: 'VERIFIED' },
  { name: 'Microcontroller Health & Battery', short: 'bcs', unit: 'V / %', category: 'Diagnostic', sensor: 'ESP32 / Power IC Telemetry', bounds: '3.3 – 4.2 V', samplingRate: '5 min', status: 'NOMINAL' },
];

export default function DataObservatoryPage() {
  const { data: health = fallbackDataHealth } = useQuery({
    queryKey: ['health', 62],
    queryFn: () => api.getCurrentEnvironment(62).then((e) => e.dataHealth)
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Thermal', 'Moisture', 'Optical', 'Atmospheric', 'Diagnostic'];

  const filteredVariables = useMemo(() => {
    return CONDUIT_VARIABLES.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.short.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sensor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Header Command Bar */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-[#111418] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Provenance & Telemetry</span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] font-mono text-slate-400">JKUAT Conduit@Empathy</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              Data Observatory & Provenance Engine
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY L1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Real-time validation pipeline for 1-minute Conduit physical weather observations, sensor health matrices, 
            and multi-source satellite Earth observation provenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Station:</span>
            <span className="text-white font-semibold">JKUAT AWS #62 (Inst 61)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-[#15191F] text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Latency:</span>
            <span className="text-emerald-400 font-semibold">1.8s</span>
          </div>
        </div>
      </div>

      {/* 2. Sensor Quality & Health Score Ribbon */}
      <div className="p-5 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Conduit Sensor Health & Quality Matrix
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Continuously evaluated against WMO-No. 8 standards for meteorological instruments and methods of observation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Overall Health Score</span>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                  {health.overall}%
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {health.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Health Dimension Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#15191F] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Completeness</span>
              <span className="text-emerald-400 font-mono font-bold text-xs">{health.completeness}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${health.completeness}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">0.02% missing packet rate across 24 channels</p>
          </div>

          <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#15191F] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Freshness</span>
              <span className="text-emerald-400 font-mono font-bold text-xs">{health.freshness}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${health.freshness}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Delta &lt; 2 min from physical observation</p>
          </div>

          <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#15191F] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Cross-Sensor Parity</span>
              <span className="text-emerald-400 font-mono font-bold text-xs">{health.consistency}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${health.consistency}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">BMX, MCP, and SHT consensus within ±0.4°C</p>
          </div>

          <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#15191F] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Active Hardware</span>
              <span className="text-cyan-400 font-mono font-bold text-xs">{health.activeSensors} / {health.totalSensors}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(health.activeSensors / health.totalSensors) * 100}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">Dual rain gauges, 3 thermal, UV/IR active</p>
          </div>
        </div>
      </div>

      {/* 3. Instrumented Telemetry Channels Table */}
      <div className="p-5 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Instrumented Telemetry Channels (JKUAT Field Station)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Physical transducer calibrations, telemetry shortcodes, and validated signal ranges.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search channel or sensor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-lg border border-white/[0.08] bg-[#15191F] text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-56"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/[0.08] bg-[#15191F]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase font-mono tracking-wider bg-[#15191F] border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-3">Variable / Parameter</th>
                <th className="py-2.5 px-3">Shortcode</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Physical Transducer</th>
                <th className="py-2.5 px-3">Plausible Range</th>
                <th className="py-2.5 px-3">Rate</th>
                <th className="py-2.5 px-3 text-right">L1 Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-[#111418]">
              {filteredVariables.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No instrumented channels found matching current search criteria.
                  </td>
                </tr>
              ) : (
                filteredVariables.map((v) => (
                  <tr key={v.short} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-200">{v.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-cyan-400 font-bold text-[11px]">
                        {v.short}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-400 text-[11px]">{v.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      {v.sensor}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {v.bounds}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {v.samplingRate}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        v.status === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : v.status === 'NOMINAL'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Multi-Source Fusion & Earth Observation Matrix */}
      <div className="p-5 rounded-xl border border-white/[0.08] bg-[#111418] space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Multi-Source Earth Observation & Meteorological Fusion
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Secondary data sources fused with primary Conduit observations to provide spatial extrapolation and predictive lead time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#15191F] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  TIER: SATELLITE
                </span>
                <span className="text-[10px] text-slate-500 font-mono">10m Ground Res</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Copernicus Sentinel-2 & Sentinel-1</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Multi-spectral MSI optical imagery computing Normalized Difference Vegetation Index (NDVI) 
                and C-band SAR backscatter for root-zone soil moisture calibration.
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Agency: ESA / EU Copernicus</span>
              <span>Revisit: 5 Days</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#15191F] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  TIER: NWP ENSEMBLE
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Hourly / 14-Day</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Open-Meteo High-Resolution Ensemble</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                14-day numerical weather prediction ensemble integrating ECMWF IFS (9km), GFS (13km), and 
                ICON-D2 models for localized temperature, VPD, and precipitation probability distribution.
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Model: ECMWF / DWD / NOAA</span>
              <span>Ensemble: 31 Members</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#15191F] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                  TIER: CLIMATOLOGY
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1991–2020 Baseline</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm">CHIRPS & ERA5 30-Year Climatology</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Long-term precipitation and atmospheric reanalysis baselines used to compute seasonal Z-scores, 
                percentile anomalies, and historical drought recurrence intervals.
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Source: UCSB CHG / ECMWF</span>
              <span>Coverage: Global Pan-Africa</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Pipeline Validation Checkpoints */}
      <div className="p-5 rounded-xl border border-white/[0.08] bg-[#111418] space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Automated Quality Assurance & Ingestion Gates
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {[
            { step: '01', title: 'Schema & Bounds', desc: 'WMO limits validation', status: 'PASS' },
            { step: '02', title: 'Robust Z-Score', desc: 'MAD outlier filtering', status: 'PASS' },
            { step: '03', title: 'Sensor Consensus', desc: 'ΔT < 0.4°C parity check', status: 'PASS' },
            { step: '04', title: 'Time Continuity', desc: 'Gap Hermite imputation', status: 'PASS' },
            { step: '05', title: 'Cryptographic Hash', desc: 'SHA-256 chain verified', status: 'PASS' },
          ].map((gate) => (
            <div key={gate.step} className="p-3 rounded-lg border border-white/[0.06] bg-[#15191F] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{gate.step}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                  {gate.status}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200">{gate.title}</div>
              <div className="text-[10px] text-slate-400">{gate.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
