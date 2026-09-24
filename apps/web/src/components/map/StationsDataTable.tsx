'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import { StationMetadata } from '@aquaguard/shared-types';
import { ArrowUpDown, Search, Radio, ChevronLeft, ChevronRight } from 'lucide-react';

const columnHelper = createColumnHelper<StationMetadata>();

interface StationsDataTableProps {
  stations: StationMetadata[];
  selectedStationId: number;
  onSelectStation: (station: StationMetadata) => void;
}

export function StationsDataTable({
  stations,
  selectedStationId,
  onSelectStation
}: StationsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-[#F1F4F8] cursor-pointer"
          >
            <span>Station Name</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => {
          const s = info.row.original;
          return (
            <div className="flex items-center gap-1.5 font-medium">
              {s.isPrimaryConduit && (
                <span className="text-[#F59E0B]" title="Primary Conduit Station">★</span>
              )}
              <span className="text-[#F1F4F8]">{info.getValue()}</span>
            </div>
          );
        }
      }),
      columnHelper.accessor('county', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-[#F1F4F8] cursor-pointer"
          >
            <span>County</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => <span className="text-[#8E9BAE]">{info.getValue()}</span>
      }),
      columnHelper.accessor('coordinates', {
        header: 'Coordinates',
        cell: (info) => {
          const [lon, lat] = info.getValue();
          return (
            <span className="text-[#5C6777] font-mono text-[10.5px]">
              {lat.toFixed(3)}°N, {lon.toFixed(3)}°E
            </span>
          );
        }
      }),
      columnHelper.accessor('elevationMeters', {
        header: 'Elevation',
        cell: (info) => <span className="text-[#8E9BAE] font-mono">{info.getValue()}m</span>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: () => (
          <span className="inline-flex items-center gap-1 text-[9.5px] px-1.5 py-0.2 rounded bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)] font-semibold">
            <Radio className="w-2.5 h-2.5" />
            ONLINE
          </span>
        )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectStation(info.row.original);
            }}
            className="text-[#06B6D4] hover:underline font-semibold text-[11px] cursor-pointer"
          >
            Focus Map
          </button>
        )
      })
    ],
    [onSelectStation]
  );

  const table = useReactTable({
    data: stations,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6
      }
    }
  });

  return (
    <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[#111418] font-mono text-xs overflow-hidden">
      {/* Table Header & Search Filter */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between gap-3 bg-[#15191F]">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[#F1F4F8] text-[11px]">
            Station Telemetry Network
          </span>
          <span className="text-[10px] text-[#5C6777]">({stations.length} Registered)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#5C6777]" />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filter stations..."
              className="bg-[#0B0D0F] border border-[rgba(255,255,255,0.1)] rounded pl-8 pr-2.5 py-1 text-xs text-[#F1F4F8] focus:outline-none focus:border-[#06B6D4] w-44"
            />
          </div>
        </div>
      </div>

      {/* Main Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] text-[#5C6777] uppercase bg-[#14181D] border-b border-[rgba(255,255,255,0.06)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2.5 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {table.getRowModel().rows.map((row) => {
              const isSelected = row.original.id === selectedStationId;
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectStation(row.original)}
                  className={`hover:bg-[#181E25] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[rgba(6,182,212,0.08)] text-[#F1F4F8]' : 'text-[#8E9BAE]'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-[#8E9BAE] bg-[#15191F]">
        <div className="text-[10px]">
          Page <strong className="text-[#F1F4F8]">{table.getState().pagination.pageIndex + 1}</strong> of{' '}
          <strong className="text-[#F1F4F8]">{table.getPageCount()}</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded border border-[rgba(255,255,255,0.08)] bg-[#0B0D0F] disabled:opacity-40 hover:bg-[#1A2027] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded border border-[rgba(255,255,255,0.08)] bg-[#0B0D0F] disabled:opacity-40 hover:bg-[#1A2027] cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
