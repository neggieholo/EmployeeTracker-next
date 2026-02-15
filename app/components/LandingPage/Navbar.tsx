'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <nav className="navbar bg-primary text-white backdrop-blur-md fixed top-0 w-full z-100 border-b border-base-200 px-4 md:px-12 h-20">
      {/* LEFT SIDE: Brand & Logo */}
      <div className="navbar-start">
        {/* Mobile Dropdown for small screens */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 border border-base-200"
          >
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Product</a>
            </li>
            <li>
              <a>Pricing</a>
            </li>
            <li>
              <a>About Us</a>
            </li>
          </ul>
        </div>

        {/* The ET Shield Icon and Brand Name */}
        <div className="flex items-center gap-3 ml-2 lg:ml-0">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="/empt_tracker_logo.png" alt="Employee Tracker Logo" />
            </div>
          </div>
          <span className="hidden sm:inline-block text-xl font-black tracking-tight uppercase">
            Employee <span className="text-primary">Tracker</span>
          </span>
        </div>
      </div>

      {/* CENTER SIDE: Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-semibold">
          <li>
            <Link href="/" className="transition-colors">Home</Link>
          </li>
          <li>
            <a className="transition-colors">Product</a>
          </li>
          <li>
            <a className="transition-colors">Pricing</a>
          </li>
          <li>
            <a className="transition-colors">About Us</a>
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE: Action Button */}
      <div className="navbar-end">
        <button
          className="btn bg-primary-content text-primary btn-sm md:btn-md shadow-lg shadow-primary/20"
          onClick={handleGetStarted}
        >
          Admin Portal
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
