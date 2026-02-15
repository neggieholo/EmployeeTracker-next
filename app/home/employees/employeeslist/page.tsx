import React from 'react'
import EmployeesPage from '@/app/components/Home/EmployeesPage'
import MobileEmployeesPage from '@/app/components/Home/mobile/MobileEmployeesPage'
import { isMobile } from '@/app/components/ismobile';
import { headers } from 'next/headers';

const page = async() => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileEmployeesPage /> : <EmployeesPage />
  )
}

export default page