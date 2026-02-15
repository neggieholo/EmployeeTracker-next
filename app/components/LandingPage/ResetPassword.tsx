/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { resetPasswordAdmin } from '@/app/Services/apis';
import { Lock, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isloading, setIsloading] = useState(false);

  const router = useRouter();
  const params = useParams(); // Next.js App Router params

  // Extract params (ensure these match your folder structure, e.g., [role]/[userId]/[token])
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
        toast.success('Password updated successfully!');
        // Redirect to login after a short delay
        setTimeout(() => router.push('/'), 2000);
      } else {
        toast.error(data.message || 'Reset failed.');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsloading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const labelStyle = 'text-[10px] font-black uppercase tracking-[2px]';

  return (
    <div className="card shrink-0 w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="card-body p-10 md:p-12">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4 border border-success/20 text-success">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
            New <span className="text-primary">Credentials</span>
          </h1>
          <p className="text-white/60 text-[10px] font-bold mt-2 uppercase tracking-widest">
            Security Protocol: Update Password
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className={`label-text text-white/80 ${labelStyle}`}>New Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none placeholder:text-white/10 rounded-xl h-14 pl-12"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-4 text-white/20" size={20} />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className={`label-text text-white/80 ${labelStyle}`}>Confirm New Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none placeholder:text-white/10 rounded-xl h-14 pl-12"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-4 text-white/20" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isloading}
            className="btn btn-primary btn-block shadow-lg shadow-primary/20 h-14 rounded-xl mt-4"
          >
            {isloading ? (
              <span className="loading loading-spinner bg-primary"></span>
            ) : (
              <span className={labelStyle}>Update Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

