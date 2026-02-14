'use client';

import React, { useState } from 'react';
import { Calendar, Search, ArrowRight } from 'lucide-react';

interface TimelineMapControlsProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onFilterByDate: (start: string, end: string) => void;
}

const TimelineMapControls = ({
  searchValue,
  onFilterByDate,
  onSearch,
}: TimelineMapControlsProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      {/* Date Filter Group */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 px-2 text-slate-500">
          <Calendar size={18} />
          <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
            Range
          </span>
        </div>

        <input
          type="date"
          className="input input-sm input-ghost focus:bg-white font-bold text-xs"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <span className="text-slate-300 font-bold">/</span>

        <input
          type="date"
          className="input input-sm input-ghost focus:bg-white font-bold text-xs"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={() => onFilterByDate(startDate, endDate)}
          className="btn btn-sm btn-primary btn-square shadow-md shadow-primary/20"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Search Group */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Filter by name or timestamp..."
          className="input input-sm input-bordered w-full pl-10 bg-white font-medium focus:border-primary"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TimelineMapControls;
