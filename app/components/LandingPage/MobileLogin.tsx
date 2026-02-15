'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import localforage from 'localforage';
import { loginAdmin } from '@/app/Services/apis';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

export default function MobileLoginPage() {
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
        const { _id, transactionId, userType, ...userDataToStore } = data.user;
        void _id;
        void transactionId;
        void userType;

        localforage.setItem('userData', userDataToStore);
        toast.success(`Welcome back, ${data.user.firstName}!`);
        router.push('/home/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err: unknown) {
      console.error('Login Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network error.';
      toast.error(errorMessage);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-4 relative overflow-hidden">
      {/* Decorative background glow for mobile */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="card shadow-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Admin <span className="text-primary text-shadow-glow">Login</span>
              </h1>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                Command Center
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-white/50 font-bold uppercase text-[10px] tracking-widest">
                    Email
                  </span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full pl-12 bg-white/5 border-white/10 text-white focus:border-primary text-sm h-14 rounded-xl transition-all"
                    placeholder="admin@snametech.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-white/50 font-bold uppercase text-[10px] tracking-widest">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pl-12 bg-white/5 border-white/10 text-white focus:border-primary text-sm h-14 rounded-xl transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/forgotpassword">
                  <span className="text-[10px] font-black uppercase text-primary/80 italic hover:text-primary transition-colors">
                    Reset Password?
                  </span>
                </Link>
              </div>

              <button
                type="submit"
                disabled={isloading}
                className="btn btn-primary w-full h-14 rounded-xl shadow-lg shadow-primary/20 mt-4 uppercase font-black tracking-widest text-white border-none"
              >
                {isloading ? <span className="loading loading-spinner"></span> : 'Authenticate'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-white/40 font-medium">
                New organization?{' '}
                <Link
                  href="/planspage"
                  className="text-primary font-black hover:underline uppercase italic ml-1"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        {/* <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
          <ShieldAlert size={14} className="text-white" />
          <span className="text-[9px] text-white font-bold uppercase tracking-widest">
            Secure 256-bit Encrypted Session
          </span>
        </div> */}
      </div>
    </div>
  );
}
