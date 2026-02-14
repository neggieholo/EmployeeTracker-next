import React from 'react';

interface PlanContainerProps {
  plan: string;
  number: number;
  price: number;
  isloading: boolean;
  payment: () => void;
  isDisabled: boolean;
  variant?: 'light' | 'dark'; // Add variant to support both pages
}

export const PlanContainer: React.FC<PlanContainerProps> = ({
  plan,
  number,
  price,
  isloading,
  payment,
  isDisabled,
}) => {
  const totalPrice = number * price;

  return (
    /* Using bg-base-100 and text-base-content ensures it flips with the theme */
    <div className="card w-72 bg-base-100 text-base-content shadow-xl border border-base-300 hover:border-primary transition-all duration-300 hover:scale-105">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-black uppercase tracking-tighter text-primary italic">
          {plan}
        </h2>
        <div className="divider opacity-20"></div>

        <div className="flex flex-col gap-1">
          <span className="text-4xl font-black italic">₦{price.toLocaleString()}</span>
          <span className="opacity-50 text-[10px] uppercase font-bold tracking-widest">
            Per Employee / Month
          </span>
        </div>

        <div className="bg-base-200 w-full rounded-2xl py-3 my-4 border border-base-300">
          <p className="text-[10px] uppercase font-bold opacity-60">Capacity: {number} Staff</p>
          <p className="text-xl font-bold">₦{totalPrice.toLocaleString()}</p>
        </div>

        <button
          className="btn btn-primary btn-block shadow-lg shadow-primary/30 rounded-xl"
          onClick={payment}
          disabled={isDisabled || isloading}
        >
          {isloading ? <span className="loading loading-spinner"></span> : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};
