import React from 'react'
import Records from '@/app/components/Home/Records'
import { isMobile } from '@/app/components/ismobile';
import { headers } from 'next/headers';
import MobileRecords from '@/app/components/Home/mobile/MobileRecords';

const page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return mobileCheck ? <MobileRecords /> : <Records />;
};

export default page