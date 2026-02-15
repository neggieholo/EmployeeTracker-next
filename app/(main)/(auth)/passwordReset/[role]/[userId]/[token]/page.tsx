import React from 'react'
import { isMobile } from '@/app/components/ismobile';
import MobileResetPasswordPage from '@/app/components/LandingPage/MobileResetPage';
import ResetPasswordPage from '@/app/components/LandingPage/ResetPassword';
import { headers } from 'next/headers';

const page = async() => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileResetPasswordPage /> : <ResetPasswordPage />
  )
}

export default page