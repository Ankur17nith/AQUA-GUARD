'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import { StationMetadata } from '@aquaguard/shared-types';
import { Play, Pause, RotateCcw, MapPin, AlertTriangle } from 'lucide-react';
import { RiskBadge } from '@/components/ui/RiskBadge';

// Explicitly set worker URL for Next.js / Turbopack ESM worker resolution
if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
}

function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface MapContainerProps {
  stations: StationMetadata[];
  selectedStationId?: number;
  onSelectStation?: (station: StationMetadata) => void;
  className?: string;
}

export function MapContainer({
  stations,
  selectedStationId = 62,
  onSelectStation,
  className = ''
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && !isWebGLSupported()) {
      return 'Hardware acceleration or WebGL is unavailable in this environment. Showing simulated coordinate topology.';
    }
    return null;
  });

  // Temporal Timeline Control (PAST <- NOW -> FORECAST)
  const timelineSteps = ['-48h', '-24h', '-12h', 'NOW', '+24h', '+3d', '+7d', '+14d'];
  const [timelineIndex, setTimelineIndex] = useState(3); // default 'NOW'
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'STATIONS' | 'DROUGHT_RISK' | 'PRECIPITATION' | 'SOIL_MOISTURE'>('DROUGHT_RISK');

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  useEffect(() => {
    if (!mapContainer.current || mapError) return;
    if (map.current) return; // initialize once

    // Ensure worker URL is set prior to Map construction
    setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

    try {
      // Kenya center coords: Lat ~0.2, Lon ~37.5
      const jkuatCoords: [number, number] = [37.014528, -1.099736];

      const instance = new Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors, © CARTO'
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: jkuatCoords,
        zoom: 6.8
      });

      instance.addControl(new NavigationControl({ showCompass: true }), 'top-right');
      map.current = instance;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to initialize MapLibre GL';
      console.warn('MapLibre GL initialization notice:', errMsg);
      queueMicrotask(() => {
        setMapError(errMsg);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapError]);

  // Update Markers
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stations.forEach((station) => {
      const isSelected = station.id === selectedStationId;
      const isPrimary = station.isPrimaryConduit;

      const el = document.createElement('div');
      el.className = 'cursor-pointer group flex flex-col items-center';

      // Custom marker DOM
      const markerPin = document.createElement('div');
      markerPin.className = `w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected
          ? 'w-6 h-6 bg-cyan-500 border-white shadow-lg shadow-cyan-500/50 ring-4 ring-cyan-500/30'
          : isPrimary
          ? 'w-5 h-5 bg-emerald-500 border-white ring-4 ring-emerald-500/30'
          : 'bg-slate-700 border-slate-400 group-hover:bg-slate-500'
      }`;

      const pulse = document.createElement('div');
      if (isPrimary || isSelected) {
        pulse.className = 'absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping';
        el.appendChild(pulse);
      }

      el.appendChild(markerPin);

      // Label on hover/select
      const label = document.createElement('div');
      label.className = `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-200 border border-slate-700 whitespace-nowrap mt-1 ${
        isSelected ? 'block text-cyan-300 border-cyan-500/50' : 'hidden group-hover:block'
      }`;
      label.innerText = isPrimary ? `● Conduit@Empathy` : station.name.slice(0, 22);
      el.appendChild(label);

      el.addEventListener('click', () => {
        if (onSelectStation) onSelectStation(station);
        map.current?.flyTo({ center: station.coordinates, zoom: 8.5, speed: 1.2 });
      });

      const marker = new Marker({ element: el })
        .setLngLat(station.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [stations, selectedStationId, onSelectStation]);

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimelineIndex((prev) => (prev + 1) % timelineSteps.length);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timelineSteps.length]);

  return (
    <div className={`relative flex flex-col rounded-lg border border-slate-800 bg-slate-950 overflow-hidden ${className}`}>
      {/* Map Header / Layer Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Kenya National Sensor & Risk Observatory
          </span>
          <span className="text-[11px] font-mono text-slate-400">({stations.length} Active Stations)</span>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded text-xs font-mono">
          {(['DROUGHT_RISK', 'PRECIPITATION', 'SOIL_MOISTURE', 'STATIONS'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                activeLayer === layer
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div ref={mapContainer} className="w-full h-[480px] lg:h-[540px] relative">
        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/95 text-center z-10 font-mono">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
              Geospatial Acceleration Notice
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4 font-sans">
              {mapError}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg text-left text-xs">
              {stations.slice(0, 6).map((st) => (
                <button
                  key={st.id}
                  onClick={() => onSelectStation?.(st)}
                  className={`p-2 rounded border transition-colors cursor-pointer ${
                    st.id === selectedStationId
                      ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 font-bold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] truncate">{st.name}</div>
                  <div className="text-[9px] text-slate-500">{st.county}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Intelligence Overlay Drawer (Requirement #31) */}
      {selectedStation && (
        <div className="absolute bottom-16 left-3 z-20 w-80 p-3.5 rounded-lg border border-slate-700 bg-slate-950/95 backdrop-blur shadow-2xl text-xs font-mono">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-slate-100 text-xs truncate max-w-[180px]">
                  {selectedStation.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                County: {selectedStation.county} • Elev: {selectedStation.elevationMeters}m
              </p>
            </div>
            <RiskBadge severity="HIGH" size="sm" />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">Drought Risk</span>
              <div className="text-amber-400 font-bold text-base">78.4%</div>
              <span className="text-[9px] text-slate-400">High Risk State</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">Soil Moisture</span>
              <div className="text-slate-200 font-bold text-base">19.5%</div>
              <span className="text-[9px] text-red-400">-41.8% vs normal</span>
            </div>
          </div>

          <div className="mt-2 text-[10.5px] text-slate-300">
            <span className="text-slate-400">Precipitation:</span> <strong>0.0 mm</strong> (Deficit: -100%)
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Last Telemetry: {selectedStation.lastObservationTime?.slice(11, 16) || '11:32'} UTC</span>
            <span className="text-cyan-400 font-bold">100% Quality</span>
          </div>
        </div>
      )}

      {/* Temporal Timeline Playback Bar (Requirement #32) */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 z-10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY TIMELINE'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setTimelineIndex(3);
            }}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Reset to NOW"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Step: <strong className="text-cyan-300 font-bold">{timelineSteps[timelineIndex]}</strong>
          </span>
        </div>

        {/* Timeline Slider Track */}
        <div className="flex items-center gap-1 flex-1 max-w-md mx-2">
          <span className="text-[10px] text-slate-400">PAST</span>
          <div className="flex-1 flex items-center justify-between gap-1 px-2">
            {timelineSteps.map((step, idx) => (
              <button
                key={step}
                onClick={() => {
                  setIsPlaying(false);
                  setTimelineIndex(idx);
                }}
                className={`flex-1 py-1 rounded text-[10px] font-bold text-center cursor-pointer transition-all ${
                  timelineIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : idx === 3
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">FORECAST</span>
        </div>
      </div>
    </div>
  );
}
