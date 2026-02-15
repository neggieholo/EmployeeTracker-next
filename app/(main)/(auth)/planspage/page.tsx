import React from 'react'
import Planspage from '@/app/components/LandingPage/PlansPage'
import { headers } from 'next/headers'
import { isMobile } from '@/app/components/ismobile'
import MobilePlansPage from '@/app/components/LandingPage/MobilePlansPage'

const page = async() => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobilePlansPage /> : <Planspage />
  )
}

export default page