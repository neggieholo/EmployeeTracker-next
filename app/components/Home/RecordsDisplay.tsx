'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Search, Clock, MapPin, MessageSquare, ShieldCheck, HardDrive } from 'lucide-react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { fetchSearchData } from '@/app/Services/apis';
import { CleanClockEvent } from '@/app/Types/EmployeeTypes';
import RecordsControls from './RecordsControls';

interface RecordsDisplayProps {
  eventList: CleanClockEvent[];
  isLoading: boolean;
  message: string;
}

export function RecordsDisplay({ eventList, isLoading, message }: RecordsDisplayProps) {
  const searchParams = useSearchParams();
  const filterName = searchParams.get('name') || '';

  const [searchValue, setSearchValue] = useState('');
  const [events, setEvents] = useState<CleanClockEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setEvents(eventList);
    setTitle(message);
    setLoading(isLoading);
  }, [eventList, message, isLoading]);

  const handleSearch = (value: string) => setSearchValue(value);

  const handleDateFilter = async (start: string, end: string) => {
    if (!start) {
      toast.error('Enter a start date');
      return;
    }
    if (end && new Date(end) < new Date(start)) {
      toast.error('End date cannot be before start date');
      return;
    }

    try {
      setLoading(true);
      const searchEvents = await fetchSearchData(start, end, filterName);
      if (searchEvents && Array.isArray(searchEvents)) {
        setEvents(searchEvents);
        setTitle(`${start}${end ? ` to ${end}` : ''}`);
      } else {
        setEvents([]);
      }
    } catch (error) {
      toast.error('Error filtering records.');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = events.filter((entry) => {
    const search = searchValue.toLowerCase();
    return Object.values(entry).some((val) => String(val).toLowerCase().includes(search));
  });

  const handleDownloadCSV = () => {
    const data = filteredList.map((event) => ({
      Name: event.name,
      Dept: event.department,
      'Clock In': event.clockInTime ? new Date(event.clockInTime).toLocaleString() : 'N/A',
      'In Location': event.clockInLocation || 'N/A',
      'Clock Out': event.clockOutTime ? new Date(event.clockOutTime).toLocaleString() : 'N/A',
      'Out Location': event.clockOutLocation || 'N/A',
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_log_${new Date().getTime()}.csv`;
    link.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Employee Clock Records', 14, 15);
    const rows = filteredList.map((e) => [
      e.name,
      e.department,
      e.clockInTime ? new Date(e.clockInTime).toLocaleString() : 'N/A',
      e.clockOutTime ? new Date(e.clockOutTime).toLocaleString() : 'N/A',
      e.status,
    ]);
    autoTable(doc, {
      head: [['Name', 'Dept', 'Clock In', 'Clock Out', 'Status']],
      body: rows,
      startY: 25,
      theme: 'striped',
    });
    doc.save('records.pdf');
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <div className="shrink-0">
        <RecordsControls
          searchValue={searchValue}
          onSearch={handleSearch}
          onFilterByDate={handleDateFilter}
          onDownloadCSV={handleDownloadCSV}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>

      <div className="flex-1 min-h-0 bg-white shadow-xl border border-slate-100 flex flex-col rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-2">
              <HardDrive size={22} className="text-primary" />
              {title}
            </h2>
            {filterName && (
              <span className="badge badge-primary badge-outline font-bold text-xs mt-1 uppercase">
                Profile: {filterName}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Active Entries
            </p>
            <p className="text-3xl font-black text-primary leading-none">{filteredList.length}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
          ) : (
            <table className="table table-pin-rows table-zebra w-full">
              <thead className="z-10">
                <tr className="bg-slate-100 text-slate-500 border-none">
                  <th className="py-4 text-xs font-black uppercase tracking-wider">Employee</th>
                  <th className="text-xs font-black uppercase tracking-wider">Entry Detail</th>
                  <th className="text-xs font-black uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="text-xs font-black uppercase tracking-wider">Exit Detail</th>
                  <th className="text-xs font-black uppercase tracking-wider">Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors border-slate-50">
                      <td className="font-bold">
                        <div className="flex flex-col">
                          <span className="text-slate-800 uppercase italic font-black text-base">
                            {entry.name}
                          </span>
                          <span className="text-xs text-primary font-bold uppercase tracking-widest">
                            {entry.department}
                          </span>
                          <div className="text-xs text-slate-400 font-bold mt-1">
                            {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                            <Clock size={14} className="text-primary" />
                            {entry.clockInTime
                              ? new Date(entry.clockInTime).toLocaleTimeString()
                              : 'N/A'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                            <MapPin size={12} /> {entry.clockInLocation}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge badge-md font-black text-[11px] uppercase border-none py-4 px-4 ${
                            entry.status === 'clocked in'
                              ? 'bg-success text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td>
                        {entry.clockOutTime ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                              <ShieldCheck size={14} className="text-success" />
                              {new Date(entry.clockOutTime).toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-slate-400 italic">
                              {entry.clockOutLocation}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-slate-300 uppercase italic">
                            On-Site
                          </span>
                        )}
                      </td>
                      <td className="max-w-48">
                        <div className="flex items-start gap-2">
                          <MessageSquare size={14} className="text-slate-300 mt-1 shrink-0" />
                          <p className="text-xs text-slate-500 italic line-clamp-2">
                            {entry.clockInComment || entry.clockOutComment || '---'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <Search size={56} className="mx-auto text-slate-100 mb-4" />
                      <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
                        No matching records found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
