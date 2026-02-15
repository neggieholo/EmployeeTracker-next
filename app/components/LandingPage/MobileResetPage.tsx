/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { resetPasswordAdmin } from '@/app/Services/apis';
import { Lock, ShieldCheck, ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function MobileResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const router = useRouter();
  const params = useParams();

  const token = params.token as string;
  const role = params.role as string;
  const userId = params.userId as string;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsloading(true);

    try {
      const data = await resetPasswordAdmin({
        token,
        password,
        role,
        userId,
      });

      if (data.success) {
        toast.success('Security credentials updated!');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error(data.message || 'Reset failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'System error occurred');
    } finally {
      setIsloading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const labelStyle = 'text-[10px] font-black uppercase tracking-[2px]';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden mt-20">
      {/* Background Security Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>

      {/* Mobile Top Bar */}
      {/* <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 text-white/40">
          <ChevronLeft size={24} />
        </button>
        <span className={labelStyle}>Security Reset</span>
        <div className="w-10"></div>
      </div> */}

      <div className="flex-1 flex flex-col justify-center px-6 py-10">
        {/* Visual Identity */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20 text-primary rotate-3">
            <ShieldCheck size={40} className="-rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            New <span className="text-primary text-shadow-glow">Credentials</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold mt-3 uppercase tracking-[0.3em]">
            Authorized Security Protocol
          </p>
        </div>

        {/* Form Arrangement */}
        <form onSubmit={handlePasswordReset} className="space-y-4 max-w-sm mx-auto w-full">
          <div className="form-control">
            <label className="label py-1">
              <span className={`label-text text-white/50 ${labelStyle}`}>New Password</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none placeholder:text-white/5 rounded-2xl h-16 pl-12 transition-all"
                placeholder="Enter new password"
                required
              />
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
                size={20}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className={`label-text text-white/50 ${labelStyle}`}>Verify Password</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none placeholder:text-white/5 rounded-2xl h-16 pl-12 transition-all"
                placeholder="Confirm new password"
                required
              />
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isloading}
            className="btn btn-primary w-full h-16 rounded-2xl shadow-xl shadow-primary/20 mt-8 border-none flex items-center justify-center"
          >
            {isloading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <span className="text-xs font-black uppercase tracking-[3px]">Update Key</span>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <p className="mt-12 text-center text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
          Ensure your new password is at least 8 characters <br />
          with a mix of letters and numbers.
        </p>
      </div>
    </div>
  );
}
