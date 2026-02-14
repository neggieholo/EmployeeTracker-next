import React from 'react';
import Link from 'next/link'; // The correct Next.js import
import { User, CreditCard, MapPin, Key, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
  const settingOptions = [
    {
      id: 'profile',
      label: 'Profile',
      path: '/home/settings/profile',
      icon: <User size={20} />,
      description: 'Manage your personal and admin details',
    },
    {
      id: 'plan',
      label: 'View Plan',
      path: '/home/settings/plandetails',
      icon: <CreditCard size={20} />,
      description: 'Check subscription status and employee limits',
    },
    {
      id: 'map',
      label: 'Set Map Coordinates',
      path: '/home/settings/setmapcoords',
      icon: <MapPin size={20} />,
      description: 'Configure the central geofencing point',
    },
    {
      id: 'password',
      label: 'Change Password',
      path: '/home/settings/changepassword',
      icon: <Key size={20} />,
      description: 'Update your account security credentials',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-2 h-10 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black italic text-slate-800 tracking-tight uppercase">
            Account <span className="text-primary">Settings</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Configure your environment and security preferences.
          </p>
        </div>
      </div>

      {/* Settings Navigation Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {settingOptions.map((option) => (
            <Link
              key={option.id}
              href={option.path} // In Next.js, use 'href', not 'to'
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-2xl bg-slate-50 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {option.icon}
                </div>

                <div className="text-left">
                  <h3 className="font-bold text-slate-700 tracking-tight group-hover:text-primary transition-colors">
                    {option.label}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium italic text-balance">
                    {option.description}
                  </p>
                </div>
              </div>

              <div className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
