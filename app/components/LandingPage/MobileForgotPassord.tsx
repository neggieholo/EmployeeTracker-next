/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { forgotPasswordAdmin } from '@/app/Services/apis';
import { ChevronLeft, Mail, ArrowRight, ShieldQuestion } from 'lucide-react';

export default function MobileForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

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
        toast.success('Reset link sent!');
        setIsSent(true);
      } else {
        toast.error(`❌ ${data.message || 'Failed to send reset email'}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Server error. Please try again.');
    } finally {
      setIsloading(false);
    }
  };

  const labelStyle = 'text-[10px] font-black uppercase tracking-[2px]';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden mt-20">
      {/* Decorative background element */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>

      {/* Mobile Top Navigation */}
      {/* <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <button
          onClick={() => router.push('/login')}
          className="p-2 text-white/40 flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
        </button>
        <ShieldQuestion size={20} className="text-primary/40" />
        <div className="w-12"></div>
      </div> */}

      <div className="flex-1 flex flex-col justify-center px-6 py-10">
        {!isSent ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-left mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                <Mail className="text-primary" size={32} />
              </div>
              <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                Reset <br />
                <span className="text-primary text-shadow-glow">Access Key</span>
              </h1>
              <p className="text-white/40 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] max-w-[250px] leading-relaxed">
                Enter your authorized email to receive recovery instructions
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="form-control">
                <label className="label py-1">
                  <span className={`label-text text-white/50 ${labelStyle}`}>System Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none placeholder:text-white/5 h-16 rounded-2xl pl-6 transition-all"
                  placeholder="admin@snametech.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isloading}
                className="btn btn-primary w-full h-16 rounded-2xl shadow-xl shadow-primary/20 border-none flex items-center justify-between px-8"
              >
                {isloading ? (
                  <span className="loading loading-spinner mx-auto"></span>
                ) : (
                  <>
                    <span className={labelStyle}>Request Reset</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE VIEW */
          <div className="text-center animate-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/20">
              <Mail className="text-success" size={40} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic italic">
              Transmission Sent
            </h2>
            <p className="text-white/50 text-xs mt-4 leading-relaxed px-4">
              A recovery link has been dispatched to <br />
              <span className="text-primary font-bold">{email}</span>
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="mt-10 text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/30 pb-1"
            >
              Try another email
            </button>
          </div>
        )}

        {/* Support Link */}
        <div className="mt-16 text-center">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Need immediate assistance? <br />
            <Link href="/contact" className="text-primary/60 hover:text-primary transition-colors">
              Contact System Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
