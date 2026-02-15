import React from 'react'
import DashboardPage from '@/app/components/Home/DashBoard'
import DashboardPageMobile from '@/app/components/Home/mobile/MobileDashboardPage'
import { headers } from 'next/headers'
import { isMobile } from '@/app/components/ismobile'

const page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);

  return (
      mobileCheck ? <DashboardPageMobile /> : <DashboardPage />    
  )
}

export default page