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
  Settings,
  Radio
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeType?: 'danger' | 'accent' | 'neutral';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard }
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { href: '/map', label: 'Geo Intelligence', icon: MapPin, badge: '69', badgeType: 'neutral' },
      { href: '/risk', label: 'Risk Intelligence', icon: AlertTriangle, badge: 'HIGH', badgeType: 'danger' },
      { href: '/timeline', label: 'Timeline', icon: Clock }
    ]
  },
  {
    title: 'DECISION',
    items: [
      { href: '/scenarios', label: 'Scenario Lab', icon: Cpu, badge: 'Twin', badgeType: 'accent' },
      { href: '/actions', label: 'Action Engine', icon: CheckCircle2, badge: '4', badgeType: 'neutral' },
      { href: '/alerts', label: 'Alerts', icon: Bell, badge: '2', badgeType: 'danger' }
    ]
  },
  {
    title: 'ANALYSIS',
    items: [
      { href: '/copilot', label: 'Guardian', icon: Bot, badge: 'AI', badgeType: 'accent' },
      { href: '/data', label: 'Data Observatory', icon: Database, badge: 'Live', badgeType: 'accent' },
      { href: '/models', label: 'Model Center', icon: Layers, badge: 'v0.3', badgeType: 'neutral' }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/methodology', label: 'Methodology', icon: BookOpen },
      { href: '/settings', label: 'Settings', icon: Settings }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-[rgba(255,255,255,0.07)] bg-[#0E1115] flex-col shrink-0 min-h-[calc(100vh-52px)] justify-between select-none">
        <div className="p-3 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C6777] font-semibold px-2 py-0.5">
                {group.title}
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                        isActive
                          ? 'bg-[rgba(255,255,255,0.07)] text-[#F1F4F8] font-medium border-l-2 border-[#06B6D4]'
                          : 'text-[#8E9BAE] hover:text-[#F1F4F8] hover:bg-[rgba(255,255,255,0.03)] border-l-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#06B6D4]' : 'text-[#8E9BAE]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono font-medium ${
                            item.badgeType === 'danger'
                              ? 'bg-[rgba(239,68,68,0.15)] text-[#F87171] border border-[rgba(239,68,68,0.3)]'
                              : item.badgeType === 'accent'
                              ? 'bg-[rgba(6,182,212,0.12)] text-[#38BDF8] border border-[rgba(6,182,212,0.25)]'
                              : 'bg-[rgba(255,255,255,0.05)] text-[#8E9BAE] border border-[rgba(255,255,255,0.08)]'
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
          ))}
        </div>

        {/* Primary Station Telemetry Footer */}
        <div className="p-3 m-2.5 rounded border border-[rgba(255,255,255,0.06)] bg-[#14181D] text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#8E9BAE]">
            <span className="flex items-center gap-1.5 text-[#F1F4F8] font-medium">
              <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
              Conduit@Empathy
            </span>
            <span className="text-[#5C6777]">Site 62</span>
          </div>
          <div className="text-[10px] text-[#8E9BAE] flex items-center justify-between pt-1 border-t border-[rgba(255,255,255,0.05)]">
            <span>Tele: <strong className="text-[#F1F4F8]">1m cadence</strong></span>
            <span className="text-[#10B981] font-semibold">100% Quality</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E1115]/95 backdrop-blur border-t border-[rgba(255,255,255,0.08)] px-2 py-1.5 flex items-center justify-around">
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
                isActive ? 'text-[#06B6D4] font-bold' : 'text-[#8E9BAE] hover:text-[#F1F4F8]'
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
