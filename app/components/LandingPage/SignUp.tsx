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


const SignUp: React.FC = () => {
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
    // Just one clean check for password matching
    if (passwordValue !== confirmPassword) {
      toast.error('Passwords do not match!');
      setIsloading(false);
      return;
    }

    // Length check
    if (!passwordValue || passwordValue.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setIsloading(false);
      return;
    }

    // Phone check
    if (phone && (!isValidPhoneNumber(phone) || phone.length > 14)) {
      toast.error('Invalid phone number format!');
      setIsloading(false);
      return;
    }

    try {
      // 2. Check if user already exists
      const userCheck = await checkUser(email, phoneNumber, companyName);
      console.log('Full Response Object:', userCheck);
      if (userCheck.exists) {
        toast.error(userCheck.message);
        setIsloading(false);
        return;
      }

      // 3. Get plan from localforage
      const selectedPlan = await localforage.getItem<any>('selectedPlan');
      if (!selectedPlan) {
        toast.error('No plan selected. Please go back.');
        router.push('/plans');
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

  // Validate phone on change
  const handlePhoneChange = (value: E164Number | undefined) => {
    setPhone(value);
    if (value && (!isValidPhoneNumber(value) || value.length > 14)) {
      setPhonerror('Invalid phone number format');
    } else {
      setPhonerror('');
    }
  };

  // Validate password on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);
  };

  return (
    <div className="card w-full max-w-xl shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20 text-white">
      <div className="card-body p-8 md:p-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black italic text-primary">Create Account</h2>
          <p className="text-sm opacity-60">Set up your command center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label-text text-white/80 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                className="input input-bordered bg-white/5 border-white/10 text-white focus:border-primary"
                placeholder="John"
                required
              />
            </div>
            <div className="form-control">
              <label className="label-text text-white/80 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="input input-bordered bg-white/5 border-white/10 text-white focus:border-primary"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label-text text-white/80 mb-2">Company Name</label>
            <input
              name="companyName"
              type="text"
              className="input input-bordered bg-white/5 border-white/10 text-white focus:border-primary mx-2"
              placeholder="Sname Logistics Ltd"
              required
            />
          </div>

          <div className="form-control">
            <label className="label-text text-white/80 mb-2">Official Email</label>
            <input
              type="email"
              name="email"
              className="input input-bordered bg-white/5 border-white/10 text-white focus:border-primary mx-2"
              placeholder="admin@company.com"
              required
            />
          </div>

          <div className="form-control">
            <label className="label-text text-white/80 mb-2">Phone Number</label>
            <PhoneInput
              international
              defaultCountry="NG"
              value={phone}
              onChange={handlePhoneChange}
              className="input input-bordered bg-white/5 border-white/10 text-white flex custom-phone-auth"
              required
            />
            {phoneError && <p className="text-error text-xs mt-1">{phoneError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label-text text-white/80 mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="input input-bordered bg-white/5 border-white/10 text-white focus:border-primary"
                onChange={handlePasswordChange}
                placeholder="Min 8 characters"
                required
              />
            </div>
            <div className="form-control">
              <label className="label-text text-white/80 mb-2">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                className="input input-bordered bg-white/5 border-white/10 text-white focus:border-primary"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" required />
            <span className="text-xs opacity-70">I accept the terms and privacy policy</span>
          </label>

          <button
            type="submit"
            className="btn btn-primary btn-block shadow-lg shadow-primary/20 mt-6"
            disabled={isloading}
          >
            {isloading ? <span className="loading loading-spinner bg-primary"></span> : 'Continue to Payment'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?
          <Link href="/login" className="text-primary font-bold hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
