import React, { useState } from 'react';
import { CleanClockEvent } from '@/app/Types/EmployeeTypes';
import { Search, Clock, MapPin } from 'lucide-react';

interface ClocksInDashboardProps {
  eventList: CleanClockEvent[];
  eventName: 'Clock ins' | 'Clock outs';
}

const ClocksDashboard = ({ eventList, eventName }: ClocksInDashboardProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredList = eventList.filter((entry) => {
    const search = searchValue.toLowerCase();
    return (
      entry.name.toLowerCase().includes(search) ||
      entry.department.toLowerCase().includes(search) ||
      entry.status.toLowerCase().includes(search)
    );
  });

  const isClockIn = eventName === 'Clock ins';

  return (
    <div className="flex flex-col">
      {/* Search Header */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="input input-sm input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20"
            placeholder={`Search ${eventName}...`}
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Clock size={14} />
          Total: {filteredList.length}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-auto">
        <table className="table table-zebra w-full table-pin-rows">
          <thead className="bg-white">
            <tr className="text-slate-500 uppercase tracking-widest text-[11px] font-black border-b border-slate-100">
              <th className="bg-white/95 backdrop-blur-sm">Employee</th>
              <th className="bg-white/95 backdrop-blur-sm">Department</th>
              <th className="bg-white/95 backdrop-blur-sm">Time</th>
              <th className="bg-white/95 backdrop-blur-sm">Location</th>
              <th className="bg-white/95 backdrop-blur-sm text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {filteredList.length > 0 ? (
              filteredList.map((entry) => (
                <tr key={entry._id} className="hover:bg-primary/5 transition-colors">
                  <td className="font-bold text-slate-800">{entry.name}</td>
                  <td>
                    <span className="badge badge-ghost badge-sm font-medium uppercase text-[10px]">
                      {entry.department}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold ${isClockIn ? 'text-primary' : 'text-secondary'}`}
                      >
                        {new Date(
                          isClockIn ? entry.clockInTime : entry.clockOutTime || ''
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] opacity-50">
                        {new Date(
                          isClockIn ? entry.clockInTime : entry.clockOutTime || ''
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-[150px]">
                    <div className="flex items-center gap-1 text-xs italic opacity-70">
                      <MapPin size={12} className="shrink-0" />
                      <span
                        className="truncate"
                        title={isClockIn ? entry.clockInLocation : entry.clockOutLocation}
                      >
                        {(isClockIn ? entry.clockInLocation : entry.clockOutLocation) || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge badge-sm font-bold text-[10px] uppercase ${
                        entry.status === 'clocked in' ? 'badge-primary' : 'badge-ghost'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-20 opacity-40">
                  <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClocksDashboard;
