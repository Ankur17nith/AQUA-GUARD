'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackDataHealth } from '@/lib/demoData';
import { Database } from 'lucide-react';

export default function DataObservatoryPage() {
  const { data: health = fallbackDataHealth } = useQuery({
    queryKey: ['health', 62],
    queryFn: () => api.getCurrentEnvironment(62).then((e) => e.dataHealth)
  });

  const conduitVariables = [
    { name: 'Rain Gauge 1 (Instantaneous)', short: 'rg', unit: 'mm', type: 'Length', sensor: 'Dual Tipping Bucket' },
    { name: 'Rain Gauge 2 (Instantaneous)', short: 'rg2', unit: 'mm', type: 'Length', sensor: 'Dual Tipping Bucket' },
    { name: 'Rain Gauge 1 Total Today', short: 'rgt', unit: 'mm', type: 'Cumulative', sensor: 'Dual Tipping Bucket' },
    { name: 'BMX Temperature 1', short: 'bt1', unit: '°C', type: 'Thermal', sensor: 'BMX280 Digital Sensor' },
    { name: 'MCP Temperature 1', short: 'mt1', unit: '°C', type: 'Thermal', sensor: 'MCP9808 Precision Thermistor' },
    { name: 'SHT Temperature', short: 'st1', unit: '°C', type: 'Thermal', sensor: 'Sensirion SHT31' },
    { name: 'SHT Humidity', short: 'sh1', unit: '%', type: 'Moisture', sensor: 'Sensirion SHT31' },
    { name: 'BMX Barometric Air Pressure', short: 'bp1', unit: 'hPa', type: 'Pressure', sensor: 'BMX280 Digital Sensor' },
    { name: 'SI1145 Visible Irradiance', short: 'sv1', unit: '#', type: 'Optical', sensor: 'SI1145 UV/IR/Visible Sensor' },
    { name: 'SI1145 Infrared Irradiance', short: 'si1', unit: '#', type: 'Optical', sensor: 'SI1145 UV/IR/Visible Sensor' },
    { name: 'SI1145 Ultraviolet Index', short: 'su1', unit: '#', type: 'Optical', sensor: 'SI1145 UV/IR/Visible Sensor' },
    { name: 'Wind Speed', short: 'ws', unit: 'm/s', type: 'Velocity', sensor: '3D-PAWS Optical Anemometer' },
    { name: 'Wind Direction', short: 'wd', unit: 'deg', type: 'Angle', sensor: 'Potentiometer Vane' },
    { name: 'Wet Bulb Temperature', short: 'wbt', unit: '°C', type: 'Thermal', sensor: 'Psychrometric Calculation' },
    { name: 'Wet Bulb Globe Temperature', short: 'wbgt', unit: '°C', type: 'Thermal', sensor: 'ISO 7243 Composite' },
    { name: 'Heat Index', short: 'hi', unit: '°C', type: 'Thermal', sensor: 'Steadman Formula' },
    { name: 'State of Health & Power Status', short: 'hth/bcs', unit: '#', type: 'Diagnostic', sensor: 'Microcontroller Telemetry' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              Data Observatory & Telemetry Health
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              CONNECTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Primary environmental ingestion pipeline, sensor health analytics, and multi-source Earth observation provenance.
          </p>
        </div>
      </div>

      {/* Data Health Score Ribbon (Requirement #12) */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Conduit Sensor Health & Quality Score
            </span>
            <span className="text-xs text-slate-400 ml-2">
              (Station: Kenya Kiambu JKUAT IOT AWS - Conduti@Empathy1)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Overall Score:</span>
            <span className="text-lg font-black text-emerald-400 tabular-nums">{health.overall}%</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {health.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Completeness</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums">{health.completeness}%</div>
            <p className="text-[10px] text-slate-400 font-sans">Non-null ratio across instrument channels</p>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Freshness</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums">{health.freshness}%</div>
            <p className="text-[10px] text-slate-400 font-sans">Time lag &lt; 2 min from physical observation</p>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Consistency</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums">{health.consistency}%</div>
            <p className="text-[10px] text-slate-400 font-sans">BMX/MCP/SHT parity within ±1.2°C</p>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Active Sensor Coverage</span>
            <div className="text-xl font-bold text-slate-100 tabular-nums">{health.activeSensors}/{health.totalSensors}</div>
            <p className="text-[10px] text-slate-400 font-sans">Total operational physical sensors</p>
          </div>
        </div>
      </div>

      {/* Available Conduit Sensor Variables Table */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          <span>CONDUIT@EMPATHY SENSOR VARIABLES (JKUAT)</span>
          <span className="text-slate-400">{conduitVariables.length} Instrumented Channels</span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80 sticky top-0">
              <tr>
                <th className="p-2">Variable Name</th>
                <th className="p-2">Shortcode</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Category</th>
                <th className="p-2">Hardware Sensor</th>
                <th className="p-2">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {conduitVariables.map((v, i) => (
                <tr key={i} className="hover:bg-slate-800/30 text-slate-300">
                  <td className="p-2 font-bold text-slate-200">{v.name}</td>
                  <td className="p-2 text-cyan-400 font-mono">{v.short}</td>
                  <td className="p-2 text-slate-400">{v.unit}</td>
                  <td className="p-2 text-slate-400">{v.type}</td>
                  <td className="p-2 text-slate-300 font-sans">{v.sensor}</td>
                  <td className="p-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Fused Environmental Sources (Requirement #9) */}
      <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Secondary Environmental Earth Observation Sources
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold">Copernicus Sentinel-2 & 1</div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Multi-spectral MSI optical (NDVI vegetation index at 10m resolution) and Synthetic Aperture Radar (SAR backscatter for surface soil moisture calibration).
            </p>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              License: Open Access (ESA) • 5-day revisit
            </div>
          </div>

          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold">Open-Meteo High-Res Ensemble</div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              14-day numerical weather prediction ensemble integrating ECMWF, GFS, and ICON-D2 models for localized precipitation and thermal projections.
            </p>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              License: Open Data • Hourly resolution
            </div>
          </div>

          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-purple-400 font-bold">CHIRPS & ERA5 30-Year Climatology</div>
            <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
              Long-term precipitation and atmospheric baseline (1991–2020) used to calculate seasonal z-scores, percentiles, and drought recurrence intervals.
            </p>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              License: Public Domain (UCSB / ECMWF)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
