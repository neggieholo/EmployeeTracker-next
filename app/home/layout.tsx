import React from 'react';
import Sidebar from '../components/Home/SideBar';
import HomeNavbar from '../components/Home/HomeNavbar';
import { UserProvider } from '../UserContext';
import { headers } from 'next/headers';
import MobBottomNav from '../components/Home/mobile/BottomNav';
import HomeNavbarMobile from '../components/Home/mobile/MobileNavbar';
import { isMobile } from '../components/ismobile';


const HomeLayout = async ({ children }: { children: React.ReactNode }) => {  
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    <UserProvider>
      {!mobileCheck ?
      (<div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full">
          <div className="h-24">
            <HomeNavbar />
          </div>
          <main className="p-1 flex-1">{children}</main>
        </div>
      </div>) : (
        <div className="min-h-screen flex flex-col relative bg-white">
            <HomeNavbarMobile />

            <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
                {children}
            </main>

            <MobBottomNav />
        </div>
      )}
    </UserProvider>
  );
};

export default HomeLayout;
