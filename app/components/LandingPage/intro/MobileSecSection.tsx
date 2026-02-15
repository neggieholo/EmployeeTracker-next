'use client';

import React from 'react';
import { Zap, Globe, Shield } from 'lucide-react';

const MobileStatsSection = () => {
  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow effect positioned for mobile */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-12">
          {/* TEXT HEADER */}
          <div className="text-left">
            <h2 className="text-3xl font-black leading-tight mb-4 uppercase italic tracking-tighter">
              Built for <span className="text-primary text-shadow-glow">Scale.</span>
            </h2>
            <p className="text-base text-white/60 leading-relaxed font-medium">
              Engineering high-performance tracking for hundreds of agents across Nigeria with zero
              latency.
            </p>
          </div>

          {/* STATS STRIP - Vertical Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-3xl font-black text-primary">500+</div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1 font-bold">
                Workers
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-3xl font-black text-primary">99.9%</div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1 font-bold">
                Uptime
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 col-span-2 flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-primary">24/7</div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1 font-bold">
                  Monitoring
                </p>
              </div>
              <Zap className="text-primary animate-pulse" size={32} />
            </div>
          </div>

          {/* VISUAL STATUS CARD */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Network Status
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {['Lagos', 'Abuja', 'P-Harcourt', 'Kano'].map((city) => (
                <div
                  key={city}
                  className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5"
                >
                  <span className="text-xs font-bold uppercase tracking-tight">{city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-green-400 uppercase tracking-tighter">
                      Optimized
                    </span>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileStatsSection;
