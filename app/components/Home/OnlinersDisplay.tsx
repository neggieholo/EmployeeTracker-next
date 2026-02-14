import React, { useState } from 'react';
import { CleanSocketUser } from '@/app/Types/AdminTypes';
import { Employee } from '@/app/Types/EmployeeTypes';
import { Search, User, Mail, Phone, Briefcase } from 'lucide-react';

// Define a type that can be either one
type TableUser = CleanSocketUser | Employee;

interface OnlinersDisplayProps {
  eventList: TableUser[];
  title: string;
}

const OnlinersDisplay = ({ eventList, title }: OnlinersDisplayProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredList = eventList.filter((entry) => {
    const search = searchValue.toLowerCase();
    // Safely check fields that exist on both types
    return (
      (entry.firstName?.toLowerCase() || '').includes(search) ||
      (entry.lastName?.toLowerCase() || '').includes(search) ||
      (entry.email?.toLowerCase() || '').includes(search) ||
      (entry.department?.toLowerCase() || '').includes(search)
    );
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            className="input input-sm input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20"
            placeholder={`Search ${title}...`}
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <User size={14} />
          Total {title}: {filteredList.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full table-pin-rows">
          <thead className="bg-white">
            <tr className="text-slate-500 uppercase tracking-widest text-[11px] font-black border-b border-slate-100">
              <th className="bg-white/95 backdrop-blur-sm">Full Name</th>
              <th className="bg-white/95 backdrop-blur-sm">Contact Info</th>
              <th className="bg-white/95 backdrop-blur-sm">Department</th>
              <th className="bg-white/95 backdrop-blur-sm text-center">Role</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {filteredList.length > 0 ? (
              filteredList.map((entry) => {
                // HANDLE DYNAMIC ID: Extract ID regardless of if it's 'id' or '_id'
                const uniqueId = 'id' in entry ? entry.id : entry._id;

                return (
                  <tr key={uniqueId} className="hover:bg-primary/5 transition-colors group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-slate-200 text-slate-500 rounded-full w-8 flex justify-center items-center">
                            <span className="text-xs">
                              {entry.firstName?.[0]}
                              {entry.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="font-bold text-slate-800">
                          {entry.firstName} {entry.lastName}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail size={12} className="text-primary" />
                          <span>{entry.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] opacity-60">
                          <Phone size={10} />
                          <span>{entry.phoneNumber}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-1">
                        <Briefcase size={12} className="opacity-40" />
                        <span className="text-sm">{entry.department || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="text-center">
                      <span
                        className={`badge badge-sm font-bold text-[10px] uppercase ${
                          entry.role === 'manager' || entry.role === 'admin'
                            ? 'badge-secondary'
                            : 'badge-ghost border-slate-200'
                        }`}
                      >
                        {entry.role}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-20 opacity-40">
                  <div className="flex flex-col items-center">
                    <User size={40} className="mb-2" />
                    <p className="font-bold uppercase tracking-widest text-xs">
                      No one found in {title}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnlinersDisplay;
