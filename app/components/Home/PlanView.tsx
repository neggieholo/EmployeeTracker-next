'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowUpCircle, ChevronLeft, AlertCircle } from 'lucide-react';
import { fetchRates, initiateUpgradePayment } from '@/app/Services/apis';
import { formatValue } from './Profile';
import { PlanContainer } from '../LandingPage/PlansContainer';
import localforage from 'localforage';
import { AdminUser } from '@/app/Types/AdminTypes';

const PlanView = () => {
  const [userData, setUserData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrade, setUpgrade] = useState(false);

  // Upgrade States
  const [plans, setPlans] = useState<Record<string, number>>({});
  const [newEmpNumber, setNewEmpNumber] = useState<number>(0);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data: AdminUser | null = await localforage.getItem('userData');

        if (data && data.email) {
          setUserData(data);
          // Default the upgrade number to their current slot limit, not employee count
          setNewEmpNumber(data.number || 0);
        } else {
          console.warn('No UserData found in local storage');
          // Optional: toast.error("Please log in to view subscription details");
        }
      } catch (err) {
        console.error('Error accessing localforage:', err);
      } finally {
        // THIS IS THE MISSING PIECE
        setLoading(false);
      }
    };

    getUserData();
  }, []);

 useEffect(() => {
   if (userData && newEmpNumber > 0 && newEmpNumber < (userData?.employeeCount || 0)) {
     toast.error(
       `Cannot reduce capacity below current staff count of (${userData?.employeeCount})`
     );
   }
 }, [newEmpNumber, userData]);
  const handleStartUpgrade = async () => {
    setLoading(true);
    try {
      const fetchedPlans = await fetchRates();
      setPlans(fetchedPlans);
      setUpgrade(true);
    } catch (err) {
      toast.error('Failed to load latest rates');
    } finally {
      setLoading(false);
    }
  };

  const onSelectUpgrade = async (plan: string, price: number) => {

    if (!userData?.email) {
      toast.error('User session not found. Please log in again.');
      return;
    }

    const amount = price * newEmpNumber;

    if (newEmpNumber < (userData?.employeeCount || 0)) {
      toast.error(
        `Cannot reduce capacity below current staff count of (${userData?.employeeCount})`
      );
      return;
    }

    // Safety check again before API call
    if (newEmpNumber < (userData?.employeeCount || 0)) {
      toast.error(`Cannot reduce capacity below current staff count of (${userData?.employeeCount})`);
      return;
    }

    setActivePlan(plan);
    try {
      const res = await initiateUpgradePayment({
        email: userData?.email,
        plan: plan,
        amount: amount,
        empNumber: newEmpNumber,
      });

      if (res.success && res.paymentLink) {
        toast.success('Redirecting to secure payment...');
        window.location.href = res.paymentLink; // Redirect to Flutterwave
      } else {
        throw new Error(res.error || 'Failed to initiate payment');
      }
    } catch (err: any) {
      toast.error(err.message);
      setActivePlan(null);
    }
  };

  // Logic to check if the current input is valid
  const isInvalidCapacity = newEmpNumber < (userData?.employeeCount || 0);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-primary rounded-full"></div>
          <div>
            <h1 className="text-2xl font-black italic text-slate-800 tracking-tight uppercase">
              Subscription <span className="text-primary">{upgrade ? 'Upgrade' : 'Plan'}</span>
            </h1>
          </div>
        </div>
        {upgrade && (
          <button onClick={() => setUpgrade(false)} className="btn btn-ghost btn-sm gap-2">
            <ChevronLeft size={16} /> Back
          </button>
        )}
      </div>

      {upgrade ? (
        <div className="space-y-10 animate-in zoom-in-95 duration-300">
          {/* Capacity Input Area */}
          <div
            className={`flex flex-col items-center p-8 rounded-3xl border transition-all max-w-5xl mx-auto ${isInvalidCapacity ? 'bg-error/5 border-error/20' : 'bg-base-200 border-base-300'}`}
          >
            <label className="label-text font-bold opacity-50 uppercase text-[10px] mb-2 tracking-widest text-center">
              Target Staff Capacity
            </label>
            <input
              type="number"
              className={`input input-bordered w-full max-w-xs text-center text-3xl font-black italic ${isInvalidCapacity ? 'input-error' : 'input-primary'}`}
              value={newEmpNumber}
              onChange={(e) => setNewEmpNumber(parseInt(e.target.value) || 0)}
            />
            {isInvalidCapacity ? (
              <p className="mt-3 text-xs text-error font-bold flex items-center gap-1 animate-pulse">
                <AlertCircle size={14} /> Minimum capacity required: {userData?.employeeCount}{' '}
                (Active Staff)
              </p>
            ) : (
              <p className="mt-2 text-[10px] font-medium opacity-40 italic">
                PRICING WILL UPDATE AUTOMATICALLY BELOW
              </p>
            )}
          </div>

          {/* Grid Area - Expands to 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {Object.entries(plans).map(([key, value]) => (
              <PlanContainer
                key={key}
                plan={key}
                number={newEmpNumber}
                price={value}
                isloading={activePlan === key}
                payment={() => onSelectUpgrade(key, value)}
                isDisabled={isInvalidCapacity || activePlan !== null}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Overview Mode */
        <div className="max-w-5xl mx-auto">
          <div className="card bg-white border border-slate-100 shadow-xl p-8 w-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Current Active Plan
                </h3>
                <p className="text-5xl font-black italic text-primary uppercase">
                  {userData?.plan}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="badge badge-outline opacity-50 font-bold uppercase text-[10px]">
                    {userData?.number} Slots Total
                  </div>
                  <div className="badge badge-primary text-white font-bold uppercase text-[10px]">
                    {userData?.employeeCount} Used
                  </div>
                </div>
              </div>
              <button
                onClick={handleStartUpgrade}
                className="btn btn-primary rounded-2xl shadow-lg shadow-primary/30 gap-2"
              >
                <ArrowUpCircle size={18} /> Change Plan
              </button>
            </div>
            <div className="divider opacity-50"></div>
            <div className="stats stats-horizontal w-full bg-transparent">
              <div className="stat px-0">
                <div className="stat-title uppercase text-[10px] font-bold">Renewal Date</div>
                <div className="stat-value text-xl font-bold">
                  {formatValue(userData?.subscriptionExpiresAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanView;
