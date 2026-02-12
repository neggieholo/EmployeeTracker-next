'use client';

import React, { useState } from 'react';
import { useUser } from '@/app/UserContext';

const DashboardPage = () => {
  const { onlineMembers, clockEvents, offlineList, unclockedList, user } = useUser();

  const onlineCount = onlineMembers?.length || 0;

  // Calculate unclocked: Total employees minus those who have clocked in today
  const clockedInCount = clockEvents?.in?.length || 0;
  

  const stats = [
    { label: 'Clock Ins', value: clockedInCount, ring: 'ring-primary/20', text: 'text-primary' },
    { label: 'Clock Outs', value: clockEvents?.out?.length || 0, ring: 'ring-primary/20', text: 'text-primary' },
    { label: 'Unclocked', value: unclockedList.length, ring: 'ring-secondary/20', text: 'text-secondary' },
    { label: 'Online', value: onlineCount, ring: 'ring-success/20', text: 'text-success' },
    { label: 'Offline', value: offlineList.length, ring: 'ring-error/20', text: 'text-error' },
  ];
  
  

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* STATISTICS GRID */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-black italic text-slate-800 tracking-tight">
            Today&apos;s <span className="text-primary">Overview</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`relative group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Decorative background circle */}
              <div
                className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-slate-50 group-hover:scale-150 transition-transform duration-500`}
              ></div>

              <div className="relative z-10">
                <h3 className={`font-bold text-xs uppercase tracking-[2px] opacity-60 mb-1`}>
                  {stat.label}
                </h3>
                <p className={`text-5xl font-black ${stat.text} tracking-tighter`}>{stat.value}</p>
              </div>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-primary transition-colors"></div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT CLOCKINGS TABLE */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-secondary rounded-full"></div>
            <h2 className="text-2xl font-black italic text-slate-800 tracking-tight">
              Recent <span className="text-secondary">Activities</span>
            </h2>
          </div>
          {/* <button className="btn btn-ghost btn-sm text-primary font-bold">
            View All Records →
          </button> */}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Stylish Header */}
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-5 px-6 text-primary uppercase tracking-widest text-[11px] font-black">
                    Employee Name
                  </th>
                  <th className="text-slate-500 uppercase tracking-widest text-[11px] font-black">
                    In Time
                  </th>
                  <th className="text-slate-500 uppercase tracking-widest text-[11px] font-black">
                    In Location
                  </th>
                  <th className="text-slate-500 uppercase tracking-widest text-[11px] font-black">
                    In Comment
                  </th>
                  <th className="text-slate-500 uppercase tracking-widest text-[11px] font-black">
                    Out Time
                  </th>
                  <th className="text-slate-500 uppercase tracking-widest text-[11px] font-black">
                    Out Location
                  </th>
                  <th className="text-slate-500 uppercase tracking-widest text-[11px] font-black">
                    Out Comment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td colSpan={7} className="text-center py-28">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center ring-8 ring-slate-50/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-slate-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-800 font-bold text-lg">System is quiet...</p>
                        <p className="text-slate-400 text-sm">
                          No recent clocking events detected for today.
                        </p>
                      </div>
                      <button className="btn btn-outline btn-primary btn-sm rounded-full px-8">
                        Refresh Data
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
