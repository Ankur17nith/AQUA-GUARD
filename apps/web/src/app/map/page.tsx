'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackStations } from '@/lib/demoData';
import { MapContainer } from '@/components/map/MapContainer';
import { StationsDataTable } from '@/components/map/StationsDataTable';
import { Radio, Compass } from 'lucide-react';

export default function MapPage() {
  const [selectedStationId, setSelectedStationId] = useState<number>(62);

  const { data: stations = fallbackStations } = useQuery({
    queryKey: ['stations'],
    queryFn: api.getStations
  });

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-mono">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#111418]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#06B6D4]" />
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#F1F4F8]">
              National Geospatial Risk & Sensor Network
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#8E9BAE] border border-[rgba(255,255,255,0.08)]">
              {stations.length} Stations Active
            </span>
          </div>
          <p className="text-xs text-[#8E9BAE] mt-0.5 font-sans">
            Interactive environmental observatory across Kenya. Select any telemetry pin or table row to inspect localized microclimate signals.
          </p>
        </div>

        {selectedStation && (
          <div className="flex items-center gap-2 text-xs bg-[#15191F] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.06)]">
            <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
            <span className="text-[#8E9BAE]">Inspecting:</span>
            <strong className="text-[#F1F4F8]">{selectedStation.name}</strong>
          </div>
        )}
      </div>

      {/* Primary Geospatial Workspace (Map with Layers & Timeline Playback) */}
      <MapContainer
        stations={stations}
        selectedStationId={selectedStationId}
        onSelectStation={(s) => setSelectedStationId(s.id)}
      />

      {/* TanStack Table of All Observational Stations */}
      <StationsDataTable
        stations={stations}
        selectedStationId={selectedStationId}
        onSelectStation={(s) => setSelectedStationId(s.id)}
      />
    </div>
  );
}
