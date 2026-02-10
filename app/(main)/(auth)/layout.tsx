import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="hero min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/hero_background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay to match the Hero section */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-black/80 to-black z-0"></div>

      {/* This renders your Login or Signup page content */}
      <div className="hero-content z-10 w-full">{children}</div>
    </div>
  );
}
