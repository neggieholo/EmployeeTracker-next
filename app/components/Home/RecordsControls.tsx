'use client';

import React, { useState } from 'react';
import { Download, FileJson, Search, Calendar, ArrowRight } from 'lucide-react';

interface RecordsControlsProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onFilterByDate: (start: string, end: string) => void;
  onDownloadCSV: () => void;
  onDownloadPDF: () => void;
}

const RecordsControls = ({
  searchValue,
  onSearch,
  onFilterByDate,
  onDownloadCSV,
  onDownloadPDF,
}: RecordsControlsProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="flex justify-evenly flex-wrap items-end gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm h-fit">
      {/* Export Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
          Export Data
        </span>
        <div className="flex gap-2">
          <button
            onClick={onDownloadCSV}
            className="btn btn-ghost btn-sm bg-green-300 hover:bg-slate-100 rounded-xl normal-case gap-2"
          >
            <FileJson size={14} className="bg-green-300 text-white" />
            CSV
          </button>
          <button
            onClick={onDownloadPDF}
            className="btn btn-ghost btn-sm bg-red-300 hover:bg-slate-100 rounded-xl normal-case gap-2"
          >
            <Download size={14} className="text-white bg-red-300" />
            PDF
          </button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-col gap-2 w-fit px-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
          Search Records
        </span>
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <div className="flex items-center px-3 gap-2">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              className="bg-transparent border-none text-xs font-bold focus:ring-0 text-slate-600 outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center px-3 gap-2">
            <input
              type="date"
              className="bg-transparent border-none text-xs font-bold focus:ring-0 text-slate-600 outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => onFilterByDate(startDate, endDate)}
            className="btn btn-primary btn-sm rounded-xl min-h-0 h-9 px-4"
          >
            <ArrowRight size={12} className="font-black" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-2 min-w-50">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
          Quick Search
        </span>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Name or Dept..."
            className="input input-sm h-11 w-full pl-10 rounded-2xl bg-slate-50 border-slate-100 focus:border-primary text-xs font-medium"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecordsControls;
