'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Key, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { changeAdminPassword } from '@/app/Services/apis';

const ChangePasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ current: '', new: '', confirm: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const currentPassword = (form.elements.namedItem('oldpassword') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    // Reset Errors
    setErrors({ current: '', new: '', confirm: '' });

    // Validation logic
    let hasError = false;

    if (currentPassword.length < 8) {
      setErrors((prev) => ({ ...prev, current: 'Password must be at least 8 characters' }));
      hasError = true;
    }
    if (newPassword.length < 8) {
      setErrors((prev) => ({ ...prev, new: 'New password must be at least 8 characters' }));
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: 'Passwords do not match' }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const data = await changeAdminPassword({ currentPassword, newPassword });

      if (data.success) {
        toast.success('Password updated successfully!');
        form.reset();
      } else {
        toast.error(`❌ ${data.error || 'Unable to change password'}`);
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const labelStyle = 'text-[10px] font-black uppercase tracking-[2px] text-slate-500 mb-2';

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-2 h-10 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-2xl font-black italic text-slate-800 tracking-tight uppercase">
            Security <span className="text-primary">Update</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
            Update your administrator credentials
          </p>
        </div>
      </div>

      <div className="card bg-white shadow-xl shadow-slate-200/60 border border-slate-100">
        <form onSubmit={handleSubmit} className="card-body gap-5 p-10">
          {/* Current Password Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className={labelStyle}>Current Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="oldpassword"
                placeholder="••••••••"
                className={`input input-bordered w-full bg-slate-50 focus:input-primary pl-12 h-14 rounded-xl ${errors.current ? 'input-error' : ''}`}
                required
              />
              <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            </div>
            {errors.current && (
              <label className="label">
                <span className="label-text-alt text-error font-bold uppercase tracking-wide">
                  {errors.current}
                </span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* New Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className={labelStyle}>New Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Min. 8 chars"
                  className={`input input-bordered w-full bg-slate-50 focus:input-primary pl-12 h-14 rounded-xl ${errors.new ? 'input-error' : ''}`}
                  required
                />
                <ShieldCheck className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
              {errors.new && (
                <label className="label">
                  <span className="label-text-alt text-error font-bold uppercase tracking-wide">
                    {errors.new}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className={labelStyle}>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  className={`input input-bordered w-full bg-slate-50 focus:input-primary pl-12 h-14 rounded-xl ${errors.confirm ? 'input-error' : ''}`}
                  required
                />
                <CheckCircle2 className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
              {errors.confirm && (
                <label className="label">
                  <span className="label-text-alt text-error font-bold uppercase tracking-wide">
                    {errors.confirm}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="card-actions justify-end mt-6">
            <button
              type="submit"
              className="btn btn-primary btn-block h-14 rounded-xl shadow-lg shadow-primary/20 gap-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <Key size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Update Credentials
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-5 rounded-4xl bg-indigo-50 border border-indigo-100 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <ShieldCheck className="text-indigo-500" size={20} />
        </div>
        <p className="text-[11px] text-indigo-700 leading-relaxed font-bold uppercase tracking-tight">
          <strong>Security Protocol:</strong> Passwords are encrypted before storage. Using a unique
          password for SnameTech ensures your administrative dashboard remains impenetrable.
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
