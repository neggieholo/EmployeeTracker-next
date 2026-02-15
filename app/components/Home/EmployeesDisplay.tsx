'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, FileText, Trash2, Briefcase, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import ConfirmModal from '@/app/Utils/ConfirmModal';
import { DeleteWorker } from '@/app/Services/apis';
import { toast } from 'react-toastify';

export interface Employee {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  gender: string;
  role: 'manager' | 'worker';
  managerId?: string;
}

interface EmployeesDisplayProps {
  eventList: Employee[];
  isLoading: boolean;
  name?: string;
  refresher: () => void;
}

export function EmployeesDisplay({ eventList, isLoading, name, refresher }: EmployeesDisplayProps) {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  // State for deletion
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; role: string } | null>(null);

  const filteredList = useMemo(() => {
    return eventList.filter((entry) =>
      Object.values(entry).some((val) =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [eventList, searchValue]);

  // Next.js routing uses Query Params instead of state
  const handleNavigation = (path: string, id: string, name: string, type?: string) => {
    const params = new URLSearchParams({ id, name });
    if (type) params.append('type', type);
    router.push(`${path}?${params.toString()}`);
  };

  const triggerDeleteModal = (id: string, role: string) => {
    setSelectedUser({ id, role });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setIsDeleting(true);
      const deleteResult = await DeleteWorker({
        userId: selectedUser.id,
        role: selectedUser.role,
        refresher,
      });

      if (deleteResult.success) {
        toast.success('User deleted successfully!');
        // Small delay to let the toast be seen before refresh
        setTimeout(() => {
          refresher();
        }, 500);
      } else {
        toast.error(deleteResult.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Deletion error:', error);
      toast.error('An error occurred while deleting the user.');
    } finally {
      setIsDeleting(false);
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full gap-5 overflow-hidden">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-1 shrink-0">
          <div>
            {name ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                  Hierarchy View
                </span>
                <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-2">
                  <Users size={24} className="text-primary" /> {name}&apos;s Team
                </h3>
              </div>
            ) : (
              <div className='flex gap-2'>
                <Users size={32} className="shrink-0 text-primary" />
                <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
                  Employees <span className="text-primary">List</span>
                </h1>
              </div>
            )}
          </div>

          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="input input-bordered w-full pl-12 bg-white shadow-sm border-slate-200 focus:border-primary font-bold text-sm rounded-2xl transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 min-h-0 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden">
          <div className="overflow-auto flex-1 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <span className="loading loading-ring loading-lg text-primary"></span>
              </div>
            ) : (
              <table className="table table-pin-rows table-zebra w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-slate-500">
                    <th className="bg-slate-50/80 py-5 px-8 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                      Personnel
                    </th>
                    <th className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                      Communication
                    </th>
                    <th className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                      Department
                    </th>
                    <th className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest text-center border-b border-slate-100">
                      Classification
                    </th>
                    <th className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest text-right px-8 border-b border-slate-100">
                      Control
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredList.length > 0 ? (
                    filteredList.map((entry) => (
                      <tr key={entry.id} className="hover:bg-blue-50/40 transition-all group">
                        <td className="px-8">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                              {entry.role === 'manager' ? (
                                <ShieldCheck size={24} />
                              ) : (
                                <User size={24} />
                              )}
                            </div>
                            <div>
                              <div className="font-black text-slate-800 uppercase italic text-[15px] leading-tight group-hover:text-primary transition-colors">
                                {entry.fullName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 truncate max-w-50">
                              <Mail size={14} className="text-slate-300 shrink-0" /> {entry.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                              <Phone size={14} className="text-slate-300 shrink-0" />{' '}
                              {entry.phoneNumber}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700 uppercase italic tracking-tight flex items-center gap-1.5">
                              <Briefcase size={14} className="text-primary/60" /> {entry.department}
                            </span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-0.5">
                              {entry.gender}
                            </span>
                          </div>
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge badge-md font-black text-[10px] uppercase border-none py-4 px-5 shadow-sm tracking-widest ${
                              entry.role === 'manager'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {entry.role}
                          </span>
                        </td>

                        <td className="px-8">
                          <div className="flex justify-end gap-2">
                            {entry.role === 'worker' ? (
                              <button
                                className="btn btn-square btn-ghost btn-md text-blue-500 hover:bg-blue-100 rounded-xl"
                                title="Reports"
                                onClick={() =>
                                  handleNavigation('/home/subrecords', entry.id, entry.fullName)
                                }
                              >
                                <FileText size={22} />
                              </button>
                            ) : (
                              <button
                                className="btn btn-square btn-ghost btn-md text-indigo-500 hover:bg-indigo-100 rounded-xl"
                                title="Subordinates"
                                onClick={() =>
                                  handleNavigation(
                                    '/home/employees',
                                    entry.id,
                                    entry.fullName,
                                    'manager'
                                  )
                                }
                              >
                                <Users size={22} />
                              </button>
                            )}
                            <button
                              className="btn btn-square btn-ghost btn-md text-rose-400 hover:bg-rose-100 hover:text-rose-600 rounded-xl"
                              title="Delete"
                              onClick={() => triggerDeleteModal(entry.id, entry.role)}
                            >
                              <Trash2 size={22} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-32 text-center">
                        <div className="flex flex-col items-center justify-center opacity-10">
                          <Search size={80} strokeWidth={3} />
                          <p className="font-black uppercase tracking-[0.4em] text-xs mt-4">
                            No Employees Found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-10 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center shrink-0">
            <span className="text-sm font-black text-slate-800 uppercase italic">
              Registered Staff:{' '}
              <span className="text-primary ml-1 text-lg">{filteredList.length}</span>
            </span>
          </div>
        </div>
      </div>

      <ConfirmModal
        message="Are you sure you want to delete this employee's account? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        isOpen={showModal}
        buttonText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
