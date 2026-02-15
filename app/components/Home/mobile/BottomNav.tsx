'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MapPin, Users, History, FileText, LogOut } from 'lucide-react';
import { logOut } from '@/app/Services/apis';

const MobBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logOut();
    if (success) router.replace('/');
  };

  const isActive = (path: string, partial = false) =>
    partial ? pathname.startsWith(path) : pathname === path;

  const navItems = [
    { path: '/home/dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
    { path: '/home/livemap', icon: <MapPin size={24} />, label: 'Live Map' },
    { path: '/home/employees/employeeslist', icon: <Users size={24} />, label: 'Employees' },
    { path: '/home/maptimelines', icon: <History size={24} />, label: 'Timeline' },
    { path: '/home/records', icon: <FileText size={24} />, label: 'Records' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-base-100 border-t border-base-300 shadow-lg md:hidden py-2">
      {navItems.map(({ path, icon, label }) => {
        const active = isActive(path, path.includes('employees'));
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex flex-col items-center px-2 py-1 transition-all duration-200
              ${
                active
                  ? 'text-primary font-semibold scale-110 bg-base-200 rounded-lg'
                  : 'text-base-content/60 hover:text-primary'
              }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] mt-0.5">{label}</span>
          </button>
        );
      })}

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center px-2 py-1 text-base-content/60 hover:text-error transition-all"
      >
        <LogOut size={20} />
        <span className="text-[10px] mt-0.5">Logout</span>
      </button>
    </nav>
  );
};

export default MobBottomNav;
