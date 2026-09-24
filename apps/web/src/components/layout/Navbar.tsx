'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  Search,
  Bell,
  SlidersHorizontal,
  MapPin
} from 'lucide-react';
import { CommandPalette } from '@/components/ui/CommandPalette';

interface NavbarProps {
  onTriggerDemoEvent?: () => void;
  onResetDemo?: () => void;
}

export function Navbar({ onTriggerDemoEvent, onResetDemo }: NavbarProps) {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleRunEvent = () => {
    setIsDemoRunning(true);
    if (onTriggerDemoEvent) onTriggerDemoEvent();
    setTimeout(() => setIsDemoRunning(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur px-4 py-2 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black tracking-tighter text-sm group-hover:border-cyan-400 transition-colors shadow-sm">
                A//G
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-wider text-slate-100 text-sm">AQUA//GUARD</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/80 text-cyan-300 font-mono">v1.0</span>
                </div>
                <p className="text-[10px] text-slate-400 hidden md:block">Environmental Intelligence System</p>
              </div>
            </Link>

            {/* Region & Telemetry Freshness */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Kenya • Juja / Kiambu Catchment</span>
              <span className="text-slate-600">|</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                OBSERVED · 1 min ago
              </span>
            </div>
          </div>

          {/* Quick Command Palette Launcher */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer w-48 md:w-64 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px]">Search signals, stations...</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">⌘K</kbd>
          </button>

          {/* Controls, Mode & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Demo Simulation Controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-md">
              <button
                onClick={handleRunEvent}
                disabled={isDemoRunning}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                title="Trigger deterministic Compound Water Stress demo sequence"
              >
                <Zap className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-bounce text-amber-400' : ''}`} />
                <span className="hidden sm:inline">SIMULATE EVENT</span>
              </button>
              <button
                onClick={onResetDemo}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
                title="Reset demo parameters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">RESET</span>
              </button>
            </div>

            {/* Notifications / Alert Center Link */}
            <Link
              href="/alerts"
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
              title="Alert Center"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Operational Settings & API Mode"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-300" />
            </Link>

            {/* Guardian AI Copilot */}
            <Link
              href="/copilot"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm shadow-cyan-950"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GUARDIAN</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Persistent Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
}
