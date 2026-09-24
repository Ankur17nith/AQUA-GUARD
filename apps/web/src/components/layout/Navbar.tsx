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
      <header className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.07)] bg-[#0B0D0F]/95 backdrop-blur px-4 py-2 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-[#15191F] border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4] font-black tracking-tighter text-xs group-hover:border-[#06B6D4] transition-colors shadow-sm">
                A//G
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold tracking-wider text-[#F1F4F8] text-sm">AQUA//GUARD</span>
                  <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#8E9BAE] font-mono">v1.0</span>
                </div>
                <p className="text-[10px] text-[#5C6777] hidden md:block mt-0.5">Environmental Intelligence</p>
              </div>
            </Link>

            {/* Region & Telemetry Freshness */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#14181D] border border-[rgba(255,255,255,0.06)] text-[11px] text-[#8E9BAE]">
              <MapPin className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
              <span className="text-[#F1F4F8]">Kenya • Juja Catchment</span>
              <span className="text-[#5C6777]">|</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                OBSERVED · 1m ago
              </span>
            </div>
          </div>

          {/* Quick Command Palette Launcher */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded bg-[#14181D] hover:bg-[#1A2027] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)] text-[#8E9BAE] hover:text-[#F1F4F8] text-xs transition-colors cursor-pointer w-auto sm:w-48 md:w-60 justify-between"
            aria-label="Search signals and stations"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#8E9BAE]" />
              <span className="text-[11px] hidden sm:inline">Search signals, stations...</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#0E1115] border border-[rgba(255,255,255,0.08)] text-[#5C6777] hidden sm:inline">⌘K</kbd>
          </button>

          {/* Controls, Mode & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Demo Simulation Controls */}
            <div className="flex items-center gap-1 bg-[#14181D] border border-[rgba(255,255,255,0.07)] p-0.5 rounded">
              <button
                onClick={handleRunEvent}
                disabled={isDemoRunning}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(245,158,11,0.12)] hover:bg-[rgba(245,158,11,0.2)] border border-[rgba(245,158,11,0.3)] text-[#FBBF24] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                title="Trigger deterministic Compound Water Stress demo sequence"
              >
                <Zap className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-bounce text-[#FBBF24]' : ''}`} />
                <span className="hidden sm:inline text-[11px]">SIMULATE EVENT</span>
              </button>
              <button
                onClick={onResetDemo}
                className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-[#1F2630] text-[#8E9BAE] hover:text-[#F1F4F8] text-xs transition-colors cursor-pointer"
                title="Reset demo parameters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">RESET</span>
              </button>
            </div>

            {/* Notifications / Alert Center Link */}
            <Link
              href="/alerts"
              className="p-1.5 rounded bg-[#14181D] hover:bg-[#1A2027] border border-[rgba(255,255,255,0.07)] text-[#8E9BAE] hover:text-[#F1F4F8] transition-colors relative"
              title="Alert Center"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping"></span>
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              className="p-1.5 rounded bg-[#14181D] hover:bg-[#1A2027] border border-[rgba(255,255,255,0.07)] text-[#8E9BAE] hover:text-[#F1F4F8] transition-colors"
              title="Operational Settings & API Mode"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </Link>

            {/* Guardian AI Copilot */}
            <Link
              href="/copilot"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px]">GUARDIAN</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Persistent Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
}
