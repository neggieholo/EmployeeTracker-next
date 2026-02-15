import React from 'react'
import MapTimelines from '@/app/components/Home/MapTimelines'
import { isMobile } from '@/app/components/ismobile';
import { headers } from 'next/headers'
import MobileMapTimelines from '@/app/components/Home/mobile/Mobilemaptimelines';

const page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileMapTimelines /> : <MapTimelines />
  )
}

export default page