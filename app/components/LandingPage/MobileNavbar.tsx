'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, LogIn, Info, Tag, Laptop } from 'lucide-react';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogin = () => {
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <nav className="bg-primary text-white h-17.5 px-4 flex items-center justify-between fixed top-0 w-full z-[100] shadow-md">
      {/* LEADING: Logo & Site Name */}
      <div className="flex items-center gap-2">
        <div className="avatar">
          <div className="w-9 rounded-full ring-2 ring-white/30">
            <img src="/empt_tracker_logo.png" alt="Logo" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-tighter uppercase leading-none">
            Employee<span className="text-slate-300">Tracker</span>
          </span>
        </div>
      </div>

      {/* TRAILING: Hamburger Icon */}
      <div className="flex items-center">
        <button onClick={toggleMenu} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* FULL SCREEN OVERLAY MENU */}
      {isOpen && (
        <div className="fixed inset-0 top-[70px] bg-base-100 z-[99] animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full p-6 bg-white">
            <ul className="space-y-4">
              <li className="border-b border-slate-100 pb-4">
                <a className="flex items-center gap-4 text-slate-600 font-black uppercase text-xs tracking-widest">
                  <Laptop size={18} className="text-primary" /> Product
                </a>
              </li>
              <li className="border-b border-slate-100 pb-4">
                <a className="flex items-center gap-4 text-slate-600 font-black uppercase text-xs tracking-widest">
                  <Tag size={18} className="text-primary" /> Pricing
                </a>
              </li>
              <li className="border-b border-slate-100 pb-4">
                <a className="flex items-center gap-4 text-slate-600 font-black uppercase text-xs tracking-widest">
                  <Info size={18} className="text-primary" /> About Us
                </a>
              </li>
            </ul>

            <div className="mt-auto mb-10">
              <button
                onClick={handleLogin}
                className="btn btn-primary w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest shadow-lg"
              >
                <LogIn size={20} />
                Admin Portal
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
                Engineered by SnameTech
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
