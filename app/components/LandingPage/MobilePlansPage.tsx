/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchRates, selectPlanAndContinue } from '@/app/Services/apis';
import localforage from 'localforage';
import { PlanContainer } from './PlansContainer';
import { Users, ChevronLeft, CreditCard, Sparkles } from 'lucide-react';

const MobilePlansPage = () => {
  const [empNumber, setEmpNumber] = useState('');
  const [displayPlans, setDisplayPlans] = useState(false);
  const [plans, setPlans] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const router = useRouter();

  // Logic Preserved: Clear stale data strictly on mount
  useEffect(() => {
    const clearStaleData = async () => {
      await localforage.removeItem('selectedPlan');
    };
    clearStaleData();
  }, []);

  // Logic Preserved: Toggle display based on input
  useEffect(() => {
    if (empNumber === '' || parseInt(empNumber) === 0) {
      setDisplayPlans(false);
    }
  }, [empNumber]);

  // Logic Preserved: API call for rates
  const submitEmpNumber = async () => {
    const num = parseInt(empNumber);
    if (!num || num <= 0) {
      toast.error('Please enter a valid number of employees');
      return;
    }

    setIsLoading(true);
    try {
      const fetchedPlans = await fetchRates();
      setPlans(fetchedPlans);
      setDisplayPlans(true);

      // Mobile UX: Scroll to plans automatically after fetch
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load plans.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logic Preserved: Selection and localforage storage
  const handlePlanSelection = async (plan: string, price: number) => {
    const num = parseInt(empNumber);
    const amount = price * num;
    setActivePlan(plan);

    try {
      await selectPlanAndContinue({
        plan,
        amount,
        empNumber: num,
      });
      router.push('/signup');
    } catch (err: any) {
      toast.error(err.message);
      setActivePlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pb-20 mt-20">
      {/* Mobile Top Bar */}
      {/* <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-white/5 sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-white/40">
          <ChevronLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Licensing
        </span>
        <div className="w-6"></div>
      </div> */}

      <div className="px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
            Enterprise <br />
            <span className="text-primary text-shadow-glow">Scalability</span>
          </h1>
          {/* <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-3">
            Step 1: Define Workforce Size
          </p> */}
        </div>

        {/* EMPLOYEE COUNT CARD - RE-ARRANGED FOR MOBILE */}
        <div className="card w-full shadow-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white overflow-hidden mb-10">
          <div className="h-1 bg-primary/20 w-full overflow-hidden">
            <div
              className={`h-full bg-primary transition-all duration-500 ${displayPlans ? 'w-full' : 'w-1/2'}`}
            ></div>
          </div>

          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users size={20} />
              </div>
              <label className="text-xs font-bold text-white/70 uppercase tracking-wide">
                Workforce Size
              </label>
            </div>

            <div className="relative">
              <input
                type="number"
                className="input w-full bg-white/5 border-white/10 text-white text-4xl font-black text-center h-20 rounded-2xl focus:border-primary focus:ring-0"
                value={empNumber}
                onChange={(e) => setEmpNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitEmpNumber()}
                placeholder="0"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  Staff
                </span>
              </div>
            </div>

            <button
              onClick={submitEmpNumber}
              className="btn btn-primary w-full h-14 mt-6 rounded-xl shadow-lg shadow-primary/20 uppercase font-black tracking-widest border-none"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner"></span> : 'Calculate Rates'}
            </button>
          </div>
        </div>

        {/* PLAN SELECTION AREA - STACKED FOR MOBILE */}

        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-xl font-black text-white uppercase italic">
              Available <span className="text-primary">Plans</span>
            </h2>
          </div>

          {/* Logic Preserved: Vertical stack instead of flex-wrap for mobile */}
          <div className="flex flex-col gap-6">
            {Object.entries(plans).map(([key, value]) => (
              <div key={key} className="relative group">
                {/* We pass your exactly named props to PlanContainer */}
                <PlanContainer
                  plan={key}
                  number={parseInt(empNumber) || 0}
                  price={value}
                  isloading={activePlan === key}
                  payment={() => handlePlanSelection(key, value)}
                  isDisabled={!!activePlan}
                />
              </div>
            ))}
          </div>

          {/* <div className="mt-10 flex flex-col items-center gap-2 opacity-30 text-center">
              <CreditCard size={20} className="text-white" />
              <p className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">
                Secure payment via Paystack <br />
                Encrypted Transaction Processing
              </p>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default MobilePlansPage;
