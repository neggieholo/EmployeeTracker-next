import React from 'react';
import { EmployeeClockEvent } from '@/app/Types/EmployeeTypes';
import { Activity } from 'lucide-react';

interface RecentActivitiesTableProps {
  data: EmployeeClockEvent[];
}

const RecentActivitiesTable = ({ data }: RecentActivitiesTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead className="bg-slate-50">
          <tr className="text-slate-500 uppercase tracking-widest text-[11px] font-black border-b border-slate-100">
            <th className="py-5 px-6">Employee</th>
            <th>Clock In</th>
            <th>In Location</th>
            <th>Clock Out</th>
            <th>Out Location</th>
          </tr>
        </thead>
        <tbody className="text-slate-600">
          {data && data.length > 0 ? (
            data.map((event) => (
              <tr key={event._id} className="hover:bg-primary/5 transition-colors group">
                {/* Employee Name & Dept */}
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{event.name}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                      {event.department}
                    </span>
                  </div>
                </td>

                {/* Clock In Info */}
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium text-primary">
                      {new Date(event.clockInTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] opacity-50">
                      {new Date(event.clockInTime).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* In Location */}
                <td className="max-w-[150px]">
                  <p
                    className="truncate italic text-xs text-slate-500"
                    title={event.clockInLocation}
                  >
                    {event.clockInLocation || '—'}
                  </p>
                </td>

                {/* Clock Out Info */}
                <td>
                  {event.clockOutTime ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-secondary">
                        {new Date(event.clockOutTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ) : (
                    <span className="badge badge-primary badge-outline badge-sm text-[10px] font-bold animate-pulse">
                      ON SITE
                    </span>
                  )}
                </td>

                {/* Out Location */}
                <td className="max-w-[150px]">
                  <p
                    className="truncate italic text-xs text-slate-500"
                    title={event.clockOutLocation}
                  >
                    {event.clockOutLocation || '—'}
                  </p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-20">
                <div className="flex flex-col items-center opacity-30">
                  <Activity size={48} />
                  <p className="mt-2 font-bold uppercase tracking-widest text-xs">
                    No activities detected today
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivitiesTable;
