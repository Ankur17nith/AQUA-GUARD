'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Clock,
  Cpu,
  CheckCircle2,
  Bell,
  Bot,
  Database,
  Layers,
  BookOpen,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard, badge: null },
  { href: '/map', label: 'Geo Intelligence', icon: MapPin, badge: '69' },
  { href: '/risk', label: 'Risk Intelligence', icon: AlertTriangle, badge: 'HIGH' },
  { href: '/timeline', label: 'Multi-track Timeline', icon: Clock, badge: null },
  { href: '/scenarios', label: 'Climate Scenario Lab', icon: Cpu, badge: 'Twin' },
  { href: '/actions', label: 'Action Engine', icon: CheckCircle2, badge: '4' },
  { href: '/alerts', label: 'Alert Center', icon: Bell, badge: '2' },
  { href: '/copilot', label: 'Guardian Copilot', icon: Bot, badge: 'AI' },
  { href: '/data', label: 'Data Observatory', icon: Database, badge: 'Live' },
  { href: '/models', label: 'Model Center', icon: Layers, badge: 'v0.3' },
  { href: '/methodology', label: 'Methodology', icon: BookOpen, badge: null },
  { href: '/settings', label: 'Settings', icon: Settings, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 bg-slate-950/60 flex-col shrink-0 min-h-[calc(100vh-53px)]">
      {/* Navigation Group */}
      <div className="p-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1.5 font-bold">
          Platform Navigation
        </div>
        <nav className="space-y-0.5 mt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      item.badge === 'HIGH'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        : item.badge === 'Twin' || item.badge === 'AI'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Primary Station Telemetry Card */}
      <div className="mt-auto p-3 m-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            STATION 62 (JKUAT)
          </span>
          <span className="text-slate-400">1,523m</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/60">
            <div className="text-[10px] text-slate-400">Rainfall Today</div>
            <div className="text-slate-200 font-bold tabular-nums">0.0 mm</div>
            <div className="text-[9px] text-red-400">-100% Deficit</div>
          </div>
          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/60">
            <div className="text-[10px] text-slate-400">Soil Moisture</div>
            <div className="text-slate-200 font-bold tabular-nums">19.5%</div>
            <div className="text-[9px] text-amber-400">-41.8% Anom</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Overall Risk: <strong className="text-amber-400">HIGH (78%)</strong></span>
          <Link href="/risk" className="text-cyan-400 hover:underline">View →</Link>
        </div>
      </div>
    </aside>

    {/* Mobile Bottom Navigation Bar */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
      {[
        { href: '/dashboard', label: 'Command', icon: LayoutDashboard },
        { href: '/map', label: 'Map', icon: MapPin },
        { href: '/risk', label: 'Risk', icon: AlertTriangle },
        { href: '/scenarios', label: 'Twin', icon: Cpu },
        { href: '/actions', label: 'Actions', icon: CheckCircle2 },
      ].map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || (tab.href === '/dashboard' && pathname === '/');
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-[10px] font-mono transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  </>
  );
}
