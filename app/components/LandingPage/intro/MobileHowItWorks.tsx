'use client';

import React, { useState } from 'react';
import { Smartphone, Map, Bell, Cloud } from 'lucide-react';
import Image from 'next/image';

const MobilePlatformShowcase = () => {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <section className="py-16 bg-base-100" id="platform">
      <div className="px-6">
        <div className="text-left mb-10">
          <h2 className="text-3xl text-gray-500 mb-2 uppercase italic tracking-tighter">
            One System, <br />
            <span className="text-primary">Two Experiences</span>
          </h2>
          <p className="text-sm opacity-60 font-bold text-gray-500 uppercase tracking-widest">
            Manager Tools & Field Apps.
          </p>
        </div>

        {/* CUSTOM MOBILE TABS */}
        <div className="flex bg-base-200 p-1 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              activeTab === 'admin' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            Admin Portal
          </button>
          <button
            onClick={() => setActiveTab('worker')}
            className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              activeTab === 'worker' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            Worker App
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-125 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'admin' ? (
            <div className="space-y-8">
              <div>
                <div className="w-12 h-1 bg-primary mb-4"></div>
                <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-4">
                  Command Center
                </h3>
                <p className="text-sm opacity-70 leading-relaxed mb-6 text-gray-500">
                  Get a &quot;God-eye view&quot; of your entire workforce. Monitor movement in
                  real-time and automate entry/exit reports.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-4 bg-primary/50 p-4 rounded-2xl border border-base-300">
                    <Map className="text-primary" size={24} />
                    <div>
                      <p className="font-black text-xs uppercase">Live Maps</p>
                      <p className="text-[10px] opacity-60 font-bold">
                        Real-time GPS pin movement.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-primary/50 p-4 rounded-2xl border border-base-300">
                    <Bell className="text-primary" size={24} />
                    <div>
                      <p className="font-black text-xs uppercase">Geo-Fencing</p>
                      <p className="text-[10px] opacity-60 font-bold">
                        Instant zone breach alerts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl border border-white/5 overflow-hidden">
                {/* Visual Placeholder for Map Dashboard */}
                <div className="relative aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
                  <Image
                    src="/EmptackerAdmin_dashboard.png"
                    alt="Dashboard example"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="w-12 h-1 bg-primary mb-4"></div>
                <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-4">
                  Field Integration
                </h3>
                <p className="text-sm opacity-70 leading-relaxed mb-6 text-gray-500">
                  Optimized for Android. Field agents simply tap to sync. Works seamlessly on 3G
                  networks across Nigeria.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/50 p-4 rounded-2xl border border-primary/10">
                    <Smartphone className="text-primary mb-2" size={20} />
                    <p className="font-black text-[10px] uppercase mb-1">Lite APK</p>
                    <p className="text-[9px] opacity-60 leading-tight">
                      Optimized for low data usage.
                    </p>
                  </div>
                  <div className="bg-primary/50 p-4 rounded-2xl border border-primary/10">
                    <Cloud className="text-primary mb-2" size={20} />
                    <p className="font-black text-[10px] uppercase mb-1">Auto Sync</p>
                    <p className="text-[9px] opacity-60 leading-tight">Instant cloud logging.</p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg">
                View Step-by-Step Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobilePlatformShowcase;
