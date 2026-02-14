/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchRates, selectPlanAndContinue } from '@/app/Services/apis';
import localforage from 'localforage'
import { PlanContainer } from './PlansContainer';


const Planspage = () => {
  const [empNumber, setEmpNumber] = useState('');
  const [displayPlans, setDisplayPlans] = useState(false);
  const [plans, setPlans] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const router = useRouter();

  // Clear stale data when the user lands on this page (handles back-button logic)
  useEffect(() => {
    const clearStaleData = async () => {
      await localforage.removeItem('selectedPlan');
    };
    clearStaleData();
  }, []);

  useEffect(() => {
    if (empNumber === '' || parseInt(empNumber) === 0) {
      setDisplayPlans(false);
    }
  }, [empNumber]);

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
    } catch (err: any) {
      toast.error(err.message || 'Failed to load plans.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelection = async (plan: string, price: number) => {
    const num = parseInt(empNumber);
    const amount = price * num;
    setActivePlan(plan);

    try {
      // 1. Await the save to localforage strictly
      await selectPlanAndContinue({
        plan,
        amount,
        empNumber: num,
      });

      // 2. Immediate route to Signup (removed timeout for better UX,
      // but you can keep it if you want a visual pause)
      router.push('/signup');
    } catch (err: any) {
      toast.error(err.message);
      setActivePlan(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10">
      {/* EMPLOYEE COUNT CARD */}
      <div className="card w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 text-white">
        <div className="card-body">
          <label className="label-text text-white/70 mb-2 font-semibold">
            How many employees will you be tracking?
          </label>
          <input
            type="number"
            className="input input-bordered bg-white/5 border-white/10 text-white text-2xl font-bold text-center"
            value={empNumber}
            onChange={(e) => setEmpNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitEmpNumber()} // Added Enter key support
            placeholder="0"
            required
          />
          <button
            onClick={submitEmpNumber}
            className="btn btn-primary btn-block mt-4 shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner"></span> : 'Confirm & View Rates'}
          </button>
        </div>
      </div>

      {/* PLAN SELECTION AREA */}
      {displayPlans && (
        <div className="w-full max-w-7xl animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-4xl font-black text-white text-center mb-10 italic uppercase">
            Select Enterprise Plan
          </h1>
          <div className="flex flex-wrap justify-center gap-8">
            {Object.entries(plans).map(([key, value]) => (
              <PlanContainer
                key={key}
                plan={key}
                number={parseInt(empNumber) || 0}
                price={value}
                isloading={activePlan === key}
                payment={() => handlePlanSelection(key, value)}
                isDisabled={!!activePlan}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default Planspage;
