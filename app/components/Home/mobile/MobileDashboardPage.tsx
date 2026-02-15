'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/UserContext';
import { Clock, Users, UserCheck, UserX, Activity } from 'lucide-react';
import { fetchRecentEvents } from '@/app/Services/apis';
import { EmployeeClockEvent } from '@/app/Types/EmployeeTypes';
import RecentActivitiesTable from '../RecenetActivitiesTable';
import ClocksDashboard from '../ClocksDashboard';
import OnlinersDisplay from '../OnlinersDisplay';

const DashboardPageMobile = () => {
  const { onlineMembers, clockEvents, offlineList, unclockedList } = useUser();
  const [recentEvents, setRecentEvents] = useState<EmployeeClockEvent[]>([]);
  const [activeTab, setActiveTab] = useState('Recent Activities');

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchRecentEvents();
      setRecentEvents(data);
    };

    getEvents();
    const interval = setInterval(getEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Recent Activities',
      count: (clockEvents?.in?.length || 0) + (clockEvents?.out?.length || 0),
      icon: <Activity />,
      color: 'text-indigo-600',
      ring: 'ring-indigo-500',
    },
    {
      label: 'Clock Ins',
      count: clockEvents?.in?.length || 0,
      icon: <UserCheck />,
      color: 'text-primary',
      ring: 'ring-primary',
    },
    {
      label: 'Clock Outs',
      count: clockEvents?.out?.length || 0,
      icon: <Clock />,
      color: 'text-primary',
      ring: 'ring-primary',
    },
    {
      label: 'Unclocked',
      count: unclockedList?.length || 0,
      icon: <UserX />,
      color: 'text-secondary',
      ring: 'ring-secondary',
    },
    {
      label: 'Online',
      count: onlineMembers?.length || 0,
      icon: <Users />,
      color: 'text-success',
      ring: 'ring-success',
    },
    {
      label: 'Offline',
      count: offlineList?.length || 0,
      icon: <UserX />,
      color: 'text-error',
      ring: 'ring-error',
    },
  ];

  const renderTable = () => {
    switch (activeTab) {
      case 'Clock Ins':
        return <ClocksDashboard eventList={clockEvents?.in} eventName="Clock ins" />;
      case 'Clock Outs':
        return <ClocksDashboard eventList={clockEvents?.out} eventName="Clock outs" />;
      case 'Unclocked':
        return <OnlinersDisplay eventList={unclockedList} title="Unclocked" />;
      case 'Online':
        return <OnlinersDisplay eventList={onlineMembers} title="Online" />;
      case 'Offline':
        return <OnlinersDisplay eventList={offlineList} title="Offline" />;
      case 'Recent Activities':
      default:
        return <RecentActivitiesTable data={recentEvents} />;
    }
  };

  return (
    <div className="space-y-6 flex flex-col overflow-y-auto">
      {/* STATISTICS SCROLLABLE ROW */}
      <section>
        <h2 className="text-xl font-black italic text-slate-800 tracking-tight uppercase mb-4">
          Today&apos;s <span className="text-primary">Overview</span>
        </h2>
        <div className="flex gap-4 overflow-x-auto p-2">
          {stats.map((stat) => {
            const isActive = activeTab === stat.label;
            return (
              <div
                key={stat.label}
                onClick={() => setActiveTab(stat.label)}
                className={`shrink-0 w-44 group relative cursor-pointer p-3 rounded-3xl border transition-all duration-500 overflow-hidden
                  ${
                    isActive
                      ? `bg-white border-primary shadow-2xl shadow-primary/10 -translate-y-1 ring-2 ring-offset-2 ${stat.ring}`
                      : 'bg-white/60 border-slate-500 hover:border-slate-300 shadow-lg'
                  }`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`p-2 rounded-xl transition-colors duration-500 ${isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10'}`}
                    >
                      {React.cloneElement(stat.icon as React.ReactElement<{ size?: number }>, {
                        size: 18,
                      })}
                    </span>
                    {isActive && (
                      <div className="badge badge-primary badge-xs animate-pulse">Active</div>
                    )}
                  </div>
                  <h3
                    className={`font-bold text-xs uppercase tracking-[1.5px] mb-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
                  >
                    {stat.label}
                  </h3>
                  <p
                    className={`text-3xl font-black tracking-tighter ${isActive ? 'text-slate-900' : 'text-slate-700'}`}
                  >
                    {stat.count}
                  </p>
                </div>
                <div
                  className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-5 transition-transform duration-1000 ${isActive ? 'scale-[2.2] bg-primary' : 'bg-slate-200'}`}
                ></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DYNAMIC TABLE SECTION */}
      <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-black italic text-slate-800 flex items-center gap-2 uppercase tracking-wider text-sm">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            {activeTab} Details
          </h2>
        </div>
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">{renderTable()}</div>
      </section>
    </div>
  );
};

export default DashboardPageMobile;
