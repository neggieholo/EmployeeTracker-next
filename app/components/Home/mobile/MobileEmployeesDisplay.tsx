'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Users,
  FileText,
  Trash2,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Plus,
} from 'lucide-react';
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

export function MobileEmployeesDisplay({
  eventList,
  isLoading,
  name,
  refresher,
}: EmployeesDisplayProps) {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

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
        setTimeout(() => refresher(), 500);
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
      <div className="flex flex-col h-full w-full gap-5">
        {/* Header */}
        <div className="flex flex-col gap-4">
          {/* Title Row */}
          <div className="flex items-center justify-between w-full">
            {/* LEFT SIDE TITLE (forced left) */}
            <div className="flex items-center gap-3">
              {name ? (
                <>
                  <Users size={26} className="text-primary shrink-0" />
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                      Hierarchy View
                    </span>
                    <h3 className="text-lg font-black text-slate-800 uppercase italic leading-tight">
                      {name}&apos;s Team
                    </h3>
                  </div>
                </>
              ) : (
                <>
                  <Users size={28} className="text-primary shrink-0" />
                  <h1 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">
                    Employees <span className="text-primary">List</span>
                  </h1>
                </>
              )}
            </div>

            {/* ADD EMPLOYEE BUTTON */}
            <button
              onClick={() => router.push('/home/employees/addemployee')}
              className="h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered w-full pl-12 bg-white shadow-sm border-slate-200 focus:border-primary font-bold text-sm rounded-2xl"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Card List */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-24 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
          ) : filteredList.length > 0 ? (
            filteredList.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4"
              >
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      {entry.role === 'manager' ? <ShieldCheck size={20} /> : <User size={20} />}
                    </div>
                    <div>
                      <div className="font-black text-slate-800 uppercase italic text-sm">
                        {entry.fullName}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {entry.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-bold truncate">
                    <Mail size={14} className="text-slate-300 shrink-0" />
                    {entry.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone size={14} className="text-slate-300 shrink-0" />
                    {entry.phoneNumber}
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase italic">
                  <Briefcase size={14} className="text-primary/60" />
                  {entry.department}
                  <span className="text-slate-400 font-bold normal-case ml-2">
                    • {entry.gender}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  {entry.role === 'worker' ? (
                    <button
                      className="flex-1 mr-2 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-wider"
                      onClick={() => handleNavigation('/home/subrecords', entry.id, entry.fullName)}
                    >
                      Reports
                    </button>
                  ) : (
                    <button
                      className="flex-1 mr-2 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-wider"
                      onClick={() =>
                        handleNavigation('/home/employees', entry.id, entry.fullName, 'manager')
                      }
                    >
                      Subordinates
                    </button>
                  )}

                  <button
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-wider"
                    onClick={() => triggerDeleteModal(entry.id, entry.role)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center opacity-20">
              <Search size={60} strokeWidth={3} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-[0.4em] text-xs">No Employees Found</p>
            </div>
          )}
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
