/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPasswordAdmin } from '@/app/Services/apis';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isloading, setIsloading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsloading(true);
    try {
      const data = await forgotPasswordAdmin(email);

      if (data.success) {
        toast.success('Reset link sent! Please check your inbox.');
        setEmail('');
      } else {
        toast.error(`❌ ${data.message || 'Failed to send reset email'}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Server error. Please try again.');
    } finally {
      setIsloading(false);
    }
  };

  // Using your premium font style
  const labelStyle = 'text-[10px] font-black uppercase tracking-[2px]';

  return (
    <div className="card shrink-0 w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 animate-in fade-in zoom-in duration-500">
      <div className="card-body p-10 md:p-12">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Mail className="text-primary" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
            Reset <span className="text-primary">Key</span>
          </h1>
          <p className="text-white/60 text-xs mt-2 font-medium uppercase tracking-wider">
            Enter your email to receive recovery instructions
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className={`label-text text-white/80 ${labelStyle}`}>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none placeholder:text-white/20 h-14 rounded-xl"
              placeholder="admin@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isloading}
            className="btn btn-primary btn-block shadow-lg shadow-primary/20 h-14 rounded-xl"
          >
            {isloading ? (
              <span className="loading loading-spinner bg-primary"></span>
            ) : (
              <span className={labelStyle}>Send Reset Link</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
