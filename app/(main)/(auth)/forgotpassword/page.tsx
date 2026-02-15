import React from 'react'
import ForgotPasswordPage from '@/app/components/LandingPage/ForgotPassword'
import { headers } from 'next/headers'
import { isMobile } from '@/app/components/ismobile'
import MobileForgotPasswordPage from '@/app/components/LandingPage/MobileForgotPassord'


const page = async() => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileForgotPasswordPage /> : <ForgotPasswordPage />
  )
}

export default page