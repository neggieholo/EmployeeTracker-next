'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CreditCard } from 'lucide-react';

const MobilePricing = () => {
  const router = useRouter();

  return (
    <section className="py-16 bg-base-200">
      <div className="px-6 text-left">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-500 mb-4 uppercase italic tracking-tighter leading-none">
            Simple, <br />
            <span className="text-primary">Scalable</span> Pricing
          </h2>
          <p className="text-sm opacity-70 font-medium leading-relaxed text-gray-500">
            Per-user licensing that grows with your business. From 10 staff to 1,000+, we scale with
            you.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="card bg-white shadow-2xl p-6 border-t-4 border-primary relative overflow-hidden">
          {/* Subtle Background Icon */}
          <CreditCard className="absolute -right-4 -bottom-4 text-slate-100" size={120} />

          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                Enterprise Ready
              </p>
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">
                Flexible <br /> Plans
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">
                  No Hidden Setup Fees
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Per-User Licensing</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/pricing')}
              className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-between px-6"
            >
              <span>View All Plans</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Contact Note */}
        <p className="mt-6 text-center text-[10px] font-bold opacity-40 uppercase tracking-widest text-gray-900">
          Custom quotes available for 500+ users
        </p>
      </div>
    </section>
  );
};

export default MobilePricing;
