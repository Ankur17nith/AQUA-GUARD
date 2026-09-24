'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackStations } from '@/lib/demoData';
import { MapContainer } from '@/components/map/MapContainer';
import { MapPin, Info, Layers, Compass } from 'lucide-react';

export default function MapPage() {
  const [selectedStationId, setSelectedStationId] = useState<number>(62);

  const { data: stations = fallbackStations } = useQuery({
    queryKey: ['stations'],
    queryFn: api.getStations
  });

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-100">
              National Geospatial Risk & Sensor Network
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              69 Stations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Interactive multi-station environmental observatory across Kenya. Click any pin to inspect microclimate telemetry.
          </p>
        </div>
      </div>

      {/* Full Interactive Map Container with Timeline Slider */}
      <MapContainer
        stations={stations}
        selectedStationId={selectedStationId}
        onSelectStation={(s) => setSelectedStationId(s.id)}
      />

      {/* Stations Overview Table */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
          <span>ALL NETWORK OBSERVATION STATIONS</span>
          <span className="text-slate-400">COUNT: {stations.length}</span>
        </div>

        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80 sticky top-0">
              <tr>
                <th className="p-2">Station Name</th>
                <th className="p-2">County</th>
                <th className="p-2">Coordinates</th>
                <th className="p-2">Elevation</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {stations.map((s) => (
                <tr
                  key={s.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    s.id === selectedStationId ? 'bg-cyan-950/30 text-cyan-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  <td className="p-2 flex items-center gap-1.5">
                    {s.isPrimaryConduit && <span className="text-amber-400">★</span>}
                    <span>{s.name}</span>
                  </td>
                  <td className="p-2 text-slate-400">{s.county}</td>
                  <td className="p-2 text-[11px] text-slate-400">
                    {s.coordinates[1].toFixed(3)}°N, {s.coordinates[0].toFixed(3)}°E
                  </td>
                  <td className="p-2 text-slate-400">{s.elevationMeters}m</td>
                  <td className="p-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ONLINE
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => setSelectedStationId(s.id)}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Focus Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
