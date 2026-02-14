'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HomeNavbar = () => {
  const { user, badgeCount } = useUser();
  const router = useRouter();
  
  // 1. Local state to handle hydration and ensure re-render when user loads
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function checkUserAndMount() {
      if (user) {
        setMounted(true);
      }
    }
    checkUserAndMount();
  }, [user]);

  // 2. Prevent rendering dynamic user data until client-side hydration is complete
  // This avoids the "text content does not match" error
  const displayFirstName = mounted ? (user?.firstName || 'Admin') : '';
  const displayLastName = mounted ? (user?.lastName || '') : '';
  const displayEmail = mounted ? (user?.email || '') : '';
  const displayPlan = mounted ? (user?.plan || 'Free') : 'Free';
  const fullname = `${displayFirstName} ${displayLastName}`;

  return (
    <header
      className="bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30"
      style={{ height: '90px' }}
    >
      {/* WELCOME SECTION */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
        </div>
        <h1 className="text-3xl font-black italic text-slate-800 tracking-tight">
          Welcome, <span className="text-primary">{displayFirstName}</span>
        </h1>
      </div>

      {/* ACTION CONTROLS */}
      <div className="flex items-center gap-8">
        {/* PLAN STATUS */}
        <Link
          href="/home/settings/plandetails"
          className="hidden lg:flex flex-col items-end hover:opacity-80 transition-opacity cursor-pointer group"
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
          <div className="indicator group">
            {badgeCount > 0 && (
              <span className="indicator-item badge badge-primary badge-sm text-white font-bold border-white border-2 scale-110 group-hover:animate-bounce">
                {badgeCount}
              </span>
            )}
            <button
              className="btn btn-ghost btn-circle bg-slate-50 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm border mx-2 border-slate-100"
              onClick={() => router.push('/home/notifications')}
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>

          <button
            className="btn btn-ghost btn-circle bg-slate-50 hover:bg-secondary/10 hover:text-secondary transition-all duration-300 shadow-sm border mx-4 border-slate-100"
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

export default HomeNavbar;