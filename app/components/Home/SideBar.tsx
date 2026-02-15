'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { logOut } from '@/app/Services/apis';
import {
  LayoutDashboard,
  MapPin,
  Users,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname(); // Pulling real-time count for the badge
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logOut();
    if (success) {
      router.replace('/');
    }
  };

  const getLinkStyle = (path: string, partial = false) => {
    const isActive = partial ? pathname.startsWith(path) : pathname === path;
    return `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
      isActive
        ? 'bg-primary text-primary-content shadow-lg font-bold scale-[1.02]'
        : 'hover:bg-primary/10 hover:text-primary text-slate-500'
    }`;
  };

  return (
    <aside
      className={`relative bg-base-100 border-r border-base-300 flex flex-col h-screen top-0 z-20 transition-all duration-500 ease-in-out ${
        isCollapsed ? 'w-24' : 'w-60'
      }`}
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-10 bg-white text-primary rounded-full p-2 shadow-xl border border-base-300 z-50 hover:bg-primary hover:text-white transition-all active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* LOGO SECTION */}
      <div
        className={`h-32 flex items-center shrink-0 bg-white ${isCollapsed ? 'justify-center' : 'px-8'}`}
      >
        <div className={`relative h-12 ${isCollapsed ? 'w-12' : 'w-48'}`}>
          <Image src="/empt_tracker_logo.png" alt="Logo" fill priority className="object-contain" />
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar pt-12">
        <ul className="space-y-3">
          <li>
            <Link href="/home/dashboard" className={getLinkStyle('/home/dashboard')}>
              <LayoutDashboard size={24} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-black uppercase tracking-widest">Dashboard</span>
              )}
            </Link>
          </li>

          <li>
            <Link href="/home/livemap" className={getLinkStyle('/home/livemap')}>
              <MapPin size={24} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-black uppercase tracking-widest">Live Map</span>
              )}
            </Link>
          </li>

          {/* EMPLOYEES DROPDOWN */}
          {/* EMPLOYEES DROPDOWN */}
          <li>
            {isCollapsed ? (
              <Link
                href="/home/employees/employeeslist"
                className={getLinkStyle('/home/employees', true)}
              >
                <Users size={24} className="shrink-0" />
              </Link>
            ) : (
              <details
                className="group/details collapse collapse-arrow overflow-hidden bg-transparent"
                // This keeps the dropdown open if we are on a sub-page
                open={pathname.startsWith('/home/employees')}
              >
                <summary
                  className={`${getLinkStyle('/home/employees', true)} cursor-pointer list-none justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <Users size={24} className="shrink-0" />
                    <span className="text-sm font-black uppercase tracking-widest">Employees</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className="transition-transform duration-300 group-open/details:rotate-180"
                  />
                </summary>

                <div className="bg-primary/10 rounded-xl mt-1 mx-2 border border-primary/5">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/home/employees/employeeslist"
                        className={`block py-3 pl-12 text-[11px] font-bold uppercase transition-colors ${
                          pathname === '/home/employees/employeeslist'
                            ? 'text-primary'
                            : 'text-slate-400 hover:text-primary'
                        }`}
                      >
                        Staff List
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/home/employees/addemployee"
                        className={`block py-3 pl-12 text-[11px] font-bold uppercase transition-colors ${
                          pathname === '/home/employees/addemployee'
                            ? 'text-primary'
                            : 'text-slate-400 hover:text-primary'
                        }`}
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
            <Link href="/home/maptimelines" className={getLinkStyle('/home/maptimelines')}>
              <History size={24} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-black uppercase tracking-widest">Timeline</span>
              )}
            </Link>
          </li>

          <li>
            <Link href="/home/records" className={getLinkStyle('/home/records')}>
              <FileText size={24} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-black uppercase tracking-widest">Records</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      {/* FOOTER */}
      <div className="p-4 mt-auto shrink-0 flex flex-col gap-12">
        <div className={`flex ${isCollapsed ? 'justify-center' : 'px-4'}`}>
          <div className="before:text-[10px] before:font-bold">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 text-slate-400 hover:text-error transition-all duration-300 group p-2 rounded-xl hover:bg-error/5"
            >
              <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
              {!isCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
              )}
            </button>
          </div>
        </div>
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
