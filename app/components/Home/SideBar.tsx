'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/app/UserContext';// Added to show badge count
import {
  LayoutDashboard,
  MapPin,
  Users,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { badgeCount } = useUser(); // Pulling real-time count for the badge
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
      isActive
        ? 'bg-primary text-primary-content shadow-lg font-bold scale-[1.02]'
        : 'hover:bg-primary/10 hover:text-primary text-slate-500'
    }`;
  };

  return (
    <aside
      className={`relative bg-base-100 border-r border-base-300 flex flex-col h-screen top-0 z-20 transition-all duration-500 ease-in-out ${
        isCollapsed ? 'w-24' : 'w-80'
      }`}
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-12 bg-white text-primary rounded-full p-2 shadow-xl border border-slate-200 z-50 hover:bg-primary hover:text-white transition-all active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* LOGO SECTION */}
      <div className={`h-32 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'px-8'}`}>
        <div className={`relative h-12 ${isCollapsed ? 'w-12' : 'w-48'}`}>
          <Image src="/empt_tracker_logo.png" alt="Logo" fill priority className="object-contain" />
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        <ul className="space-y-3">
          <li>
            <Link href="/home/dashboard" className={getLinkStyle('/home/dashboard')}>
              <LayoutDashboard size={24} className="shrink-0" />
              {!isCollapsed && <span className="text-sm uppercase tracking-wider">Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link href="/home/live-location" className={getLinkStyle('/home/live-location')}>
              <MapPin size={24} className="shrink-0" />
              {!isCollapsed && <span className="text-sm uppercase tracking-wider">Live Map</span>}
            </Link>
          </li>

          {/* EMPLOYEES DROPDOWN */}
          <li>
            {isCollapsed ? (
              <Link href="/home/employees/list" className={getLinkStyle('/home/employees/list')}>
                <Users size={24} className="shrink-0" />
              </Link>
            ) : (
              <details className="group/details collapse collapse-arrow overflow-hidden bg-transparent">
                <summary className="flex items-center justify-between gap-4 px-4 py-4 rounded-2xl hover:bg-primary/10 text-slate-500 cursor-pointer list-none transition-all">
                  <div className="flex items-center gap-4">
                    <Users size={24} className="shrink-0" />
                    <span className="text-sm uppercase tracking-wider font-medium">Employees</span>
                  </div>
                  {/* Rotating Downward Arrow */}
                  <ChevronDown
                    size={18}
                    className="transition-transform duration-300 group-open/details:rotate-180"
                  />
                </summary>
                <div className="bg-primary/40 text-white rounded-xl mt-1 mx-2">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/home/employees/list"
                        className="block py-3 pl-12 text-[11px] font-bold hover:text-primary uppercase"
                      >
                        Staff List
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/home/employees/add"
                        className="block py-3 pl-12 text-[11px] font-bold hover:text-primary uppercase"
                      >
                        Onboarding
                      </Link>
                    </li>
                  </ul>
                </div>
              </details>
            )}
          </li>

          <li>
            <Link href="/home/timeline" className={getLinkStyle('/home/timeline')}>
              <History size={24} className="shrink-0" />
              {!isCollapsed && <span className="text-sm uppercase tracking-wider">Timeline</span>}
            </Link>
          </li>

          <li>
            <Link href="/home/records" className={getLinkStyle('/home/records')}>
              <FileText size={24} className="shrink-0" />
              {!isCollapsed && <span className="text-sm uppercase tracking-wider">Records</span>}
            </Link>
          </li>

          {/* NEW NOTIFICATIONS LINK */}
          <li>
            <Link href="/home/notifications" className={getLinkStyle('/home/notifications')}>
              <Bell size={24} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm uppercase tracking-wider">Notifications</span>
              )}
            </Link>
          </li>

        </ul>
      </nav>

      {/* FOOTER */}
      <div className="p-4 mt-auto shrink-0">
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center border border-slate-100 shadow-sm">
          {!isCollapsed && (
            <span className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-[2px]">
              Engineered By
            </span>
          )}
          <div className={`relative ${isCollapsed ? 'h-8 w-8' : 'h-10 w-full'}`}>
            <Image
              src={isCollapsed ? '/Sname_logo.png' : '/snametech_logo.png'}
              alt="SnameTech"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
