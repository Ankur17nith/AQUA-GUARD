'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
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
  Settings, 
  Search,
  BookOpen
} from 'lucide-react';
import { fallbackStations } from '@/lib/demoData';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback((val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    if (!isControlled) setInternalOpen(val);
  }, [onOpenChange, isControlled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    startTransition(() => {
      command();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command, station, risk, or page... (ESC to close)"
              className="w-full bg-transparent text-sm placeholder:text-slate-500 text-slate-100 focus:outline-none"
            />
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">ESC</span>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2 space-y-2">
            <Command.Empty className="p-4 text-center text-xs text-slate-500">
              No matching intelligence signals, stations, or actions found.
            </Command.Empty>

            <Command.Group heading="NAVIGATION & COMMAND" className="text-[10px] text-cyan-400/80 font-bold px-2 py-1 uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Command Center (Overview)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/map'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Geospatial Intelligence Map (69 Stations)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/risk'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Risk Intelligence & Explainable Drivers</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/timeline'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Synchronized Multi-track Timeline</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/scenarios'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Climate Scenario Lab (Digital Twin Workspace)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/actions'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Action Engine & Concrete Interventions</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/alerts'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Bell className="w-4 h-4 text-red-400" />
                <span>Alert Center & Threshold Triggers</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/copilot'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Guardian AI Environmental Analyst</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/data'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Data Observatory & 96.4% Health Score</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/models'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Model Intelligence & Performance Cards</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/methodology'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Scientific Methodology & Equations</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/settings'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>System Settings (Live / Demo Mode)</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="MONITORING STATIONS" className="text-[10px] text-cyan-400/80 font-bold px-2 py-1 uppercase tracking-wider">
              {fallbackStations.slice(0, 5).map((station) => (
                <Command.Item
                  key={station.id}
                  onSelect={() => runCommand(() => router.push(`/map?station=${station.id}`))}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-slate-800/80 cursor-pointer text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{station.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{station.county}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500">
            <span>Navigation: ↑ ↓ Enter</span>
            <span>AQUA//GUARD Environmental Intelligence</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
