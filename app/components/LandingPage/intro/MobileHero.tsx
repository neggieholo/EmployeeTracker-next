'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react'; // Using icons instead of checkboxes for a cleaner mobile look

export default function MobileHero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/planspage');
  };

  return (
    <div
      className="relative min-h-screen pt-24 pb-10 overflow-hidden flex flex-col"
      style={{
        backgroundImage: "url('/hero_background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Darker overlay for better text readability on mobile */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/80 to-black z-0"></div>

      <div className="relative z-10 px-6 flex flex-col gap-8">
        {/* TOP: The Hook */}
        <div className="text-left">
          <h1 className="text-4xl font-black leading-tight text-white drop-shadow-lg uppercase italic tracking-tighter">
            Track your <br />
            <span className="text-primary">Employees</span> <br />
            with Precision.
          </h1>
          <p className="py-4 text-base text-white/80 leading-snug font-medium">
            The ultimate field-force tracking tool. Monitor live locations and streamline attendance
            instantly.
          </p>
          <button
            className="btn btn-primary btn-md w-full sm:w-auto px-10 shadow-lg shadow-primary/30 uppercase font-black tracking-widest"
            onClick={handleGetStarted}
          >
            Get Started Now
          </button>
        </div>

        {/* BOTTOM: The Feature Card */}
        <div className="card w-full shadow-2xl bg-slate-900/60 backdrop-blur-lg border border-white/10 mt-4">
          <div className="card-body p-6">
            <h2 className="text-xl font-black mb-4 text-white uppercase tracking-tight border-b border-primary/30 pb-2">
              Key <span className="text-primary">Features</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {[
                'Real-time Tracking',
                'Digital Clockings',
                'Live Notifications',
                'Location History',
                'PDF/CSV Exporting',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={18} />
                  <span className="text-sm text-white font-bold tracking-wide uppercase">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SnameTech Footer Branding for Mobile */}
      <div className="mt-auto pt-10 text-center opacity-30">
        <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">
          Powered by SnameTech
        </p>
      </div>
    </div>
  );
}
