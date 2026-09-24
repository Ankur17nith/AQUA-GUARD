'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Radio, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onTriggerDemoEvent?: () => void;
  onResetDemo?: () => void;
}

export function Navbar({ onTriggerDemoEvent, onResetDemo }: NavbarProps) {
  const pathname = usePathname();
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRunEvent = () => {
    setIsDemoRunning(true);
    if (onTriggerDemoEvent) onTriggerDemoEvent();
    setTimeout(() => setIsDemoRunning(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black tracking-tighter text-sm group-hover:border-cyan-400 transition-colors">
              A//G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-slate-100 text-sm">AQUA//GUARD</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono">v1.0</span>
              </div>
              <p className="text-[10.5px] text-slate-400 hidden sm:block">Climate Risk Intelligence & Digital Twin</p>
            </div>
          </Link>

          {/* Conduit Connectivity Indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-medium tracking-tight">CONDUIT CONNECTED</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[10px]">JKUAT Field Stn (1-min)</span>
          </div>
        </div>

        {/* System & Demo Controls */}
        <div className="flex items-center gap-2.5">
          {/* Demo Controls */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-md">
            <button
              onClick={handleRunEvent}
              disabled={isDemoRunning}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
              title="Trigger deterministic Compound Water Stress demo sequence"
            >
              <Zap className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-bounce text-amber-400' : ''}`} />
              <span className="hidden sm:inline">RUN CLIMATE EVENT</span>
            </button>
            <button
              onClick={onResetDemo}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
              title="Reset demo parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          </div>

          {/* System Health Status Pills */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded">
            <span className="text-emerald-400">CONDUIT ●</span>
            <span className="text-emerald-400">POSTGIS ●</span>
            <span className="text-emerald-400">ML/AI ●</span>
            <span className="text-emerald-400">SATELLITE ●</span>
          </div>

          {/* Copilot Quick Launch */}
          <Link
            href="/copilot"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>GUARDIAN</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
