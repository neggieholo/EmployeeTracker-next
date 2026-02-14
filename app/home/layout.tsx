'use client';

import React from 'react';
import Sidebar from '../components/Home/SideBar';
import HomeNavbar from '../components/Home/HomeNavbar';
import { UserProvider } from '../UserContext';


const HomeLayout = ({ children }: { children: React.ReactNode }) => {  
  return (
    <UserProvider>
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full">
          <div className="h-24">
            <HomeNavbar />
          </div>
          <main className="p-1 flex-1">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
};

export default HomeLayout;
