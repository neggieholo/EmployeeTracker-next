import React from 'react'
import LiveMap from '@/app/components/Home/LiveMap';
import { isMobile } from '@/app/components/ismobile';
import { headers } from 'next/headers'
import MobileLiveMap from '@/app/components/Home/mobile/MobileLiveMap';

const page = async() => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileLiveMap /> : <LiveMap />
  )
}

export default page