import React from 'react'
import SignUp from '@/app/components/LandingPage/SignUp'
import MobileSignUp from '@/app/components/LandingPage/MobileSignUp'
import { isMobile } from '@/app/components/ismobile';
import { headers } from 'next/headers';

const page = async() => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileSignUp /> : <SignUp />
  )
}

export default page