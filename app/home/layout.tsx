'use client';

import React from 'react';
import Sidebar from '../components/Home/SideBar';
import HomeNavbar from '../components/Home/HomeNavbar';
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <HomeNavbar />
          <main className="p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
  );
};

export default HomeLayout;
