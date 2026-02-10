'use client';

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the PlanContainer component
interface PlanContainerProps {
  plan: string;
  number: number;
  price: number;
  isloading: boolean;
  payment: (plan: string) => void;
  isDisabled: boolean;
}

const PlanContainer: React.FC<PlanContainerProps> = ({
  plan,
  number,
  price,
  isloading,
  payment,
  isDisabled,
}) => {
  const totalPrice = number * price;

  return (
    <div className="card w-80 bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-2xl font-black capitalize">{plan} Plan</h2>
        <div className="divider"></div>
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            <span className="font-bold">Employees:</span> {number}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-bold">Price per employee:</span> ₦{price}
          </p>
          <p className="text-2xl font-black text-primary">Total: ₦{totalPrice.toLocaleString()}</p>
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-primary btn-block"
            onClick={() => payment(plan)}
            disabled={isDisabled || isloading}
          >
            {isloading ? <span className="loading loading-spinner"></span> : 'Select Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Planspage = () => {
  const [empNumber, setEmpNumber] = useState('');
  const [displayPlans, setDisplayPlans] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  // Define your plans pricing
  const plans = {
    basic: 500,
    standard: 750,
    premium: 1000,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpNumber(e.target.value);
  };

  const submitEmpNumber = () => {
    const num = parseInt(empNumber);
    if (!num || num <= 0) {
      toast.error('Please enter a valid number of employees');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setDisplayPlans(true);
      setIsLoading(false);
    }, 500);
  };

  const processPayment = (plan: string) => {
    setActivePlan(plan);
    toast.info(`Processing payment for ${plan} plan...`);
    // Add your payment processing logic here
    setTimeout(() => {
      toast.success(`${plan} plan selected successfully!`);
      setActivePlan(null);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10">
      {/* EMPLOYEE COUNT CARD */}
      <div className="card w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 text-white">
        <div className="card-body">
          <h2 className="text-2xl font-black mb-4">Scalability Check</h2>
          <label className="label-text text-white/70 mb-2 font-semibold">
            How many employees will you be tracking?
          </label>
          <input
            type="number"
            className="input input-bordered bg-white/5 border-white/10 text-white text-2xl font-bold text-center"
            value={empNumber}
            onChange={handleChange}
            placeholder="0"
            required
          />
          <button
            onClick={submitEmpNumber}
            className="btn btn-primary btn-block mt-4 shadow-lg shadow-primary/20"
          >
            {isLoading ? <span className="loading loading-spinner"></span> : 'Confirm & View Rates'}
          </button>
        </div>
      </div>

      {/* PLAN SELECTION AREA */}
      {displayPlans && (
        <div className="w-full max-w-7xl animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-4xl font-black text-white text-center mb-10">
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
                payment={processPayment}
                isDisabled={!!activePlan}
              />
            ))}
          </div>
        </div>
      )}
      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
};

export default Planspage;
