'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  BadgeCheck,
  Users,
  Briefcase,
} from 'lucide-react';
import { getAdminProfile } from '@/app/Services/apis';
import ConfirmModal from '@/app/Utils/ConfirmModal';
import { DeleteAccount } from '@/app/Services/apis';
import localforage from 'localforage';



const ProfilePage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile();
        if (data.success) {
          setUserData(data.userData);
        } else {
          toast.error(data.message || 'Failed to fetch profile');
        }
      } catch (error) {
        toast.error('Server error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    const result = await DeleteAccount();

    setIsDeleting(false);

    if (result.success) {
      toast.success('Account deleted successfully');

      await localforage.clear();

      window.location.replace('/');
    } else {
      toast.error(result.message);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header section */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-2 h-10 bg-primary rounded-full"></div>
          <div>
            <h1 className="text-2xl font-black italic text-slate-800 tracking-tight uppercase">
              Admin <span className="text-primary">Profile</span>
            </h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Account Details & Subscription
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card (Left) */}
          <div className="md:col-span-1 card bg-white shadow-xl shadow-slate-200/60 border border-slate-100 h-fit">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-primary text-primary-content rounded-full w-24 ring ring-primary flex justify-center items-center">
                  <span className="text-3xl font-bold uppercase">
                    {userData?.firstName?.[0]}
                    {userData?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <h2 className="card-title text-2xl font-black text-slate-800 italic">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <div className="badge badge-primary font-bold uppercase text-[10px] tracking-widest p-3">
                {userData?.role || 'Administrator'}
              </div>
              <div className="divider opacity-50"></div>
              <div className="w-full space-y-3 text-left">
                <ProfileItem icon={<Mail size={14} />} label="Email" value={userData?.email} />
                <ProfileItem
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={userData?.phoneNumber}
                />
                <ProfileItem
                  icon={<Briefcase size={14} />}
                  label="Gender"
                  value={userData?.gender}
                />
              </div>
            </div>
          </div>

          {/* Detailed Info (Right) */}
          <div className="md:col-span-2 space-y-6">
            <div className="card bg-white shadow-xl shadow-slate-200/60 border border-slate-100">
              <div className="card-body">
                <h3 className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-tighter mb-4 text-sm">
                  <Building2 size={18} className="text-primary" /> Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoBlock label="Company Name" value={userData?.companyName} />
                  <InfoBlock
                    label="Employee Capacity"
                    value={userData?.employeeCount}
                    icon={<Users size={14} />}
                  />
                  <InfoBlock
                    label="Account Plan"
                    value={userData?.plan}
                    icon={<BadgeCheck size={14} className="text-warning" />}
                  />
                  <InfoBlock label="Status" value={userData?.status} isBadge />
                </div>
              </div>
            </div>
            {/* Subscription Highlight */}
            <div className="card bg-slate-900 text-white shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calendar size={80} />
              </div>
              <div className="card-body">
                <h3 className="font-bold text-indigo-300 uppercase tracking-widest text-[10px]">
                  Subscription Validity
                </h3>
                <div className="flex flex-col sm:flex-row items-baseline gap-2 mt-2">
                  <span className="text-indigo-400 text-xs font-medium uppercase italic tracking-wider">
                    Expires on
                  </span>
                  <span className="text-3xl font-black italic tracking-tight text-white">
                    {formatValue(userData?.subscriptionExpiresAt)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium italic uppercase">
                  Registered: {formatValue(userData?.registeredAt)}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="btn btn-error text-white hover:bg-red-600" onClick={() => setIsModalOpen(true)}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        message="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        buttonText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
};

// --- Sub-Components ---

const ProfileItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
      {icon} {label}
    </span>
    <span className="text-sm font-semibold text-slate-700 truncate">{value || 'N/A'}</span>
  </div>
);

const InfoBlock = ({ label, value, icon, isBadge }: any) => (
  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/30 transition-colors">
    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    {isBadge ? (
      <span className="badge bg-primary badge-sm font-bold text-[10px] uppercase text-white tracking-tighter">
        {value || 'Active'}
      </span>
    ) : (
      <p className="font-bold text-slate-800">{value || 'N/A'}</p>
    )}
  </div>
);

// --- Format Helper (Refactored to avoid hasOwnProperty warning) ---
export const formatValue = (value: any) => {
  if (!value) return 'N/A';
  let date: Date;

  // Use Object.hasOwn for cleaner property checking
  if (typeof value === 'object' && Object.hasOwn(value, '_seconds')) {
    date = new Date(value._seconds * 1000 + Math.floor(value._nanoseconds / 1e6));
  } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else {
    return String(value);
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default ProfilePage;
