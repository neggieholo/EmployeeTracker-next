/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Link from 'next/link';
import type { E164Number } from 'libphonenumber-js';
import localforage from 'localforage';
import { initiatePayment, checkUser } from '@/app/Services/apis';
import { ChevronLeft, User, Building, Mail, Lock, CreditCard } from 'lucide-react';

const MobileSignUp: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [phoneError, setPhonerror] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isloading, setIsloading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsloading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const phoneNumber = phone?.replace(/\s+/g, '') || '';
    const email = formData.get('email') as string;
    const companyName = formData.get('companyName') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // 1. UI Validations
    if (passwordValue !== confirmPassword) {
      toast.error('Passwords do not match!');
      setIsloading(false);
      return;
    }

    if (!passwordValue || passwordValue.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setIsloading(false);
      return;
    }

    if (phone && (!isValidPhoneNumber(phone) || phone.length > 14)) {
      toast.error('Invalid phone number format!');
      setIsloading(false);
      return;
    }

    try {
      // 2. Check if user already exists
      const userCheck = await checkUser(email, phoneNumber, companyName);
      if (userCheck.exists) {
        toast.error(userCheck.message);
        setIsloading(false);
        return;
      }

      // 3. Get plan from localforage
      const selectedPlan = await localforage.getItem<any>('selectedPlan');
      if (!selectedPlan) {
        toast.error('No plan selected. Please go back.');
        router.push('/planspage'); // Adjusted to your previous naming convention
        return;
      }

      // 4. Combine data
      const registrationPayload = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: email,
        companyName: companyName,
        password: passwordValue,
        phoneNumber: phoneNumber,
        gender: 'Not Specified',
        ...selectedPlan,
      };

      // 5. Initiate Payment
      const paymentLink = await initiatePayment(registrationPayload);
      toast.success('Registration successful! Redirecting...');

      await localforage.clear();
      window.location.href = paymentLink;
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsloading(false);
    }
  }

  const handlePhoneChange = (value: E164Number | undefined) => {
    setPhone(value);
    if (value && (!isValidPhoneNumber(value) || value.length > 14)) {
      setPhonerror('Invalid phone number format');
    } else {
      setPhonerror('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col mt-20">
      {/* <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <button onClick={() => router.back()} className="p-2 text-white/50">
          <ChevronLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          Onboarding
        </span>
        <div className="w-10"></div>
      </div> */}

      <div className="px-6 py-8">
        {/* Title Section */}
        <div className="mb-10 text-left">
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">
            Create <br />
            <span className="text-primary text-shadow-glow">Account</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-3">
            SnameTech Enterprise Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PERSONAL INFO GROUP */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2 opacity-50">
              <User size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Personal Details
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                name="firstName"
                className="input w-full bg-white/5 border-white/10 text-white focus:border-primary h-14 rounded-2xl"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="lastName"
                className="input w-full bg-white/5 border-white/10 text-white focus:border-primary h-14 rounded-2xl"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          {/* COMPANY & CONTACT GROUP */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2 opacity-50">
              <Building size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Organization</span>
            </div>

            <input
              name="companyName"
              type="text"
              className="input w-full bg-white/5 border-white/10 text-white focus:border-primary h-14 rounded-2xl"
              placeholder="Company Name"
              required
            />

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
                size={18}
              />
              <input
                type="email"
                name="email"
                className="input w-full pl-12 bg-white/5 border-white/10 text-white focus:border-primary h-14 rounded-2xl"
                placeholder="Official Email"
                required
              />
            </div>

            <div className="form-control">
              <PhoneInput
                international
                defaultCountry="NG"
                value={phone}
                onChange={handlePhoneChange}
                className="input w-full bg-white/5 border-white/10 text-white flex custom-phone-auth-mobile h-14 rounded-2xl"
                required
              />
              {phoneError && (
                <p className="text-error text-[10px] font-bold mt-1 uppercase tracking-tighter">
                  {phoneError}
                </p>
              )}
            </div>
          </div>

          {/* SECURITY GROUP */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 mb-2 opacity-50">
              <Lock size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Security</span>
            </div>

            <input
              type="password"
              name="password"
              className="input w-full bg-white/5 border-white/10 text-white focus:border-primary h-14 rounded-2xl"
              onChange={handlePasswordChange}
              placeholder="Password (Min. 8 chars)"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              className="input w-full bg-white/5 border-white/10 text-white focus:border-primary h-14 rounded-2xl"
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* LEGAL & SUBMIT */}
          <div className="pt-4 space-y-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm mt-0.5"
                required
              />
              <span className="text-[10px] font-bold opacity-60 leading-snug uppercase tracking-tight">
                I accept the <span className="text-primary underline">Terms of Service</span> and
                acknowledge the Privacy Policy.
              </span>
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full h-16 rounded-2xl shadow-xl shadow-primary/20 uppercase font-black tracking-widest text-white border-none flex items-center justify-center gap-3"
              disabled={isloading}
            >
              {isloading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Continue to Payment
                  <CreditCard size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-10 text-[11px] font-bold opacity-50 uppercase tracking-[0.2em]">
          Already registered?
          <Link
            href="/login"
            className="text-primary italic ml-2 border-b border-primary/30 pb-0.5"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MobileSignUp;
