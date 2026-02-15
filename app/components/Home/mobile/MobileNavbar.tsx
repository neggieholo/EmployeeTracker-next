'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import Image from 'next/image';


const HomeNavbarMobile = () => {
  const { user, badgeCount } = useUser();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
      function checkUserAndMount() {
        if (user) {
          setMounted(true);
        }
      }
      checkUserAndMount();
    }, [user]);

  const displayFirstName = mounted ? user?.firstName || 'Admin' : '';
  const displayLastName = mounted ? user?.lastName || '' : '';
  const displayEmail = mounted ? user?.email || '' : '';
  const displayPlan = mounted ? user?.plan || 'Free' : 'Free';
  const fullname = `${displayFirstName} ${displayLastName}`;

  return (
    <header className="bg-white shadow-md backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
      {/* LEFT: App Logo / Name */}
      <div className="relative h-12 w-12">
        <Image src="/empt_tracker_logo.png" alt="Logo" fill priority className="object-contain" />
      </div>

      {/* RIGHT: Hamburger menu */}
      <div className="relative flex items-center">
        <button
          className="p-2 rounded-md bg-slate-50 hover:bg-primary/10 transition-colors shadow-sm border border-slate-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-6 w-6 text-slate-800" />
        </button>

        {/* DROPDOWN MENU */}
        {menuOpen && (
          <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-4 animate-in fade-in scale-in origin-top-right z-50">
            {/* Welcome Section */}
            <div className="flex flex-col mx-auto">
              <span className="text-sm font-bold text-slate-400 truncate">{displayEmail}</span>
              <span className="text-lg font-black text-slate-800 truncate">
                Welcome, <span className="text-primary">{displayFirstName || 'Admin'}</span>
              </span>
            </div>

            {/* PLAN STATUS */}
            <Link
              href="/home/settings/plandetails"
              className="flex flex-col items-center gap-1 w-full "
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Current Plan
              </span>
              <div className="badge badge-warning font-black h-7 px-4 rounded-full shadow-lg shadow-warning/20 border-none text-[11px] italic">
                {displayPlan}
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex justify-evenly gap-2">
              {/* Notifications */}
              <button
                className="btn btn-ghost btn-circle bg-primary text-white transition-all duration-300 shadow-sm border border-slate-100 relative"
                onClick={() => router.push('/home/notifications')}
              >
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 indicator-item badge badge-primary badge-sm text-white font-bold border-white border-2 scale-110 animate-bounce"></span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Settings */}
              <button
                className="btn btn-ghost btn-circle bg-primary text-white transition-all duration-300 shadow-sm border border-slate-100"
                onClick={() => router.push('/home/settings')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100 mt-10">
              <div className="flex flex-col items-end">
                <span className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">
                  {displayFirstName} {displayLastName?.[0] ? `${displayLastName[0]}.` : 'ADMIN'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 truncate max-w-37.5 tracking-tight">
                  {displayEmail ||'Admin@email.com'}
                </span>
              </div>
              <div className="avatar group cursor-pointer">
                <div className="w-12 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg bg-slate-100">
                  {mounted && (
                    <img
                      src={`https://ui-avatars.com/api/?name=${fullname|| 'Admin'}&background=00A99D&color=fff&bold=true`}
                      alt="Profile"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop layout remains intact */}
      <div className="hidden lg:flex items-center gap-8">
        {/* PLAN STATUS */}
        <Link
          href="/home/settings/plandetails"
          className="flex flex-col items-end hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <span className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest group-hover:text-primary transition-colors">
            Current Plan
          </span>
          <div className="badge badge-warning font-black h-7 px-4 rounded-full shadow-lg shadow-warning/20 border-none text-[11px] italic">
            {displayPlan}
          </div>
        </Link>

        {/* NOTIFICATION HUB */}
        <div className="flex items-center gap-2">
          {badgeCount > 0 && (
            <span className="indicator-item badge badge-primary badge-sm text-white font-bold border-white border-2 scale-110 animate-bounce"></span>
          )}
          <button
            className="btn btn-ghost btn-circle bg-slate-50 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm border mx-2 border-slate-100"
            onClick={() => router.push('/home/notifications')}
          >
            {/* svg icon omitted for brevity */}
          </button>
          <button
            className="btn btn-ghost btn-circle bg-slate-50 hover:bg-secondary/10 hover:text-secondary transition-all duration-300 shadow-sm border mx-4 border-slate-100"
            onClick={() => router.push('/home/settings')}
          >
            {/* svg icon omitted for brevity */}
          </button>
        </div>

        {/* USER PROFILE */}
        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">
              {displayFirstName} {displayLastName?.[0] ? `${displayLastName[0]}.` : ''}
            </span>
            <span className="text-[10px] font-bold text-slate-400 truncate max-w-37.5 tracking-tight">
              {displayEmail}
            </span>
          </div>
          <div className="avatar group cursor-pointer">
            <div className="w-12 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg bg-slate-100">
              {mounted && (
                <img
                  src={`https://ui-avatars.com/api/?name=${fullname}&background=00A99D&color=fff&bold=true`}
                  alt="Profile"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbarMobile;
