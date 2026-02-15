import React from 'react'
import AddEmployeeForm from '@/app/components/Home/AddEmployeeForm'
import { isMobile } from '@/app/components/ismobile';
import { headers } from 'next/headers';
import MobileAddEmployeeForm from '@/app/components/Home/mobile/MobileAddEmployeeForm';

const page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return (
    mobileCheck ? <MobileAddEmployeeForm /> : <AddEmployeeForm />
  )
}

export default page