'use client'; // Required for useState and useRouter in the app router

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use this instead of react-router-dom
import { toast } from 'react-toastify';
import localforage from 'localforage';
import { loginAdmin } from '@/app/Services/apis';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(true);

    try {
      const data = await loginAdmin(email, password);

      if (data.success) {
        // Store user data in localStorage (excluding _id and transactionId)
        const { _id, transactionId, userType, ...userDataToStore } = data.user;
        // TypeScript ignore for unused variables
        void _id;
        void transactionId;
        void userType;

        localforage.setItem("userData", userDataToStore);

        toast.success(`Welcome back, ${data.user.firstName}!`);
        router.push('/home/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err: unknown) {
      console.error('Login Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network or server error.';
      toast.error(errorMessage);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="card shrink-0 w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20">
      <div className="card-body p-10 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Admin Login</h1>
          <p className="text-white/60 text-sm mt-2">Access the Command Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white/80 font-semibold">Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none"
              placeholder="admin@snametech.com"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-white/80 font-semibold">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-end mt-1">
            <Link href="/forgotpassword" className="group transition-all duration-300">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 group-hover:text-primary cursor-pointer italic">
                Forgot Password?
              </span>
            </Link>
          </div>

          <button
            type="submit"
            disabled={isloading}
            className="btn btn-primary btn-block shadow-lg shadow-primary/20 mt-4"
          >
            {isloading ? <span className="loading loading-spinner bg-primary"></span> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-white/50">New organization? </span>
          <Link href="/planspage" className="text-primary font-bold hover:underline italic">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
