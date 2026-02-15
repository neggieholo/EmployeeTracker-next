'use client';

import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { UserPlus, User, Mail, Briefcase, Lock, ShieldCheck, Users } from 'lucide-react';
import { fetchManagers, registerEmployee, Manager } from '@/app/Services/apis';

const AddEmployeeForm = () => {
  const [phone, setPhone] = useState<string | undefined>('');
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [managersLoading, setManagersLoading] = useState(false);
  const [department, setDepartment] = useState('');

  
  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedManagerId = e.target.value;
    if (selectedManagerId) {
      const selectedManager = managers.find((m) => m._id === selectedManagerId);
      if (selectedManager) {
        setDepartment(selectedManager.department); // Auto-fill department
      }
    }
  };

  useEffect(() => {
    function loadManagers() {
      if (isWorker) {
        setManagersLoading(true);
        fetchManagers().then((res) => {
          if (res?.success && res.managers) {
            setManagers(res.managers);
          }
          setManagersLoading(false);
        });
      }
    }

    loadManagers();
    
  }, [isWorker]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (data.password !== data.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (phone && !isValidPhoneNumber(phone)) {
      return toast.error('Invalid phone number!');
    }
    if ((data.password as string).length < 8) {
      return toast.error('Password too short!');
    }

    setLoading(true);
    const result = await registerEmployee({ ...data, phoneNumber: phone });
    setLoading(false);

    if (result.success) {
      toast.success('Employee Onboarded Successfully!');
      (e.target as HTMLFormElement).reset();
      setPhone('');
      setIsWorker(false);
    } else {
      toast.error(result.error || 'Onboarding failed');
    }
  };

  const inputClass =
    'input input-bordered w-full pl-10 bg-base-200 focus:input-primary transition-all text-sm';
  const labelClass =
    'label-text font-bold text-slate-500 uppercase text-[10px] tracking-widest mb-1 block';

  return (
    <div className="p-4 h-[calc(100vh-100px)]">
      {/* Banner Header */}
      <div className="text-primary-content flex items-center gap-1">
        <div className="bg-white/20 text-primary font-bold rounded-2xl">
          <UserPlus size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
            On<span className="text-primary">Boarding</span>
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="card shadow-xl border border-base-300 overflow-hidden">
          <p className="text-md opacity-80 font-medium px-4 py-2 text-black">
            Register new staff members into the tracking system
          </p>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Identity Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>First Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Role & Gender Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Role</label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    name="role"
                    className="select select-bordered w-full pl-10 bg-base-200 text-sm"
                    onChange={(e) => setIsWorker(e.target.value === 'worker')}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="worker">Field Worker</option>
                    <option value="manager">System Manager</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  name="gender"
                  className="select select-bordered w-full bg-base-200 text-sm"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </section>

            {/* Contact Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={phone}
                  onChange={setPhone}
                  className="flex h-12 w-full rounded-lg border border-base-300 bg-base-200 px-3 py-2 text-sm focus-within:ring-2 ring-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Department & Supervisor */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Department</label>
                <div className="relative">
                  <Briefcase
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="Sales / Engineering"
                    className={inputClass}
                    value={department}
                    required
                  />
                </div>
              </div>

              <div
                className={`transition-all duration-300 ${isWorker ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
              >
                <label className={labelClass}>Supervising Manager</label>
                <div className="relative">
                  <Users
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    name="managerId"
                    className="select select-bordered w-full pl-10 bg-base-200 text-sm"
                    required={isWorker}
                    onChange={handleManagerChange}
                  >
                    <option value="">
                      {managersLoading ? 'Fetching Managers...' : 'Select Supervisor'}
                    </option>
                    {managers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-base-200">
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    className={inputClass}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    className={inputClass}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="btn btn-primary w-full h-14 text-lg font-black uppercase tracking-widest shadow-lg disabled:bg-primary/70 disabled:text-white/80"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Processing...</span>
                </div>
              ) : (
                'Register Employee'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
