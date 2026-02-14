'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchSubordinates } from '@/app/Services/apis';
import { Employee, EmployeesDisplay } from './EmployeesDisplay';

function EmployeesContent() {
  const searchParams = useSearchParams();
  const [eventData, setEventData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Extracting params added by handleNavigation in EmployeesDisplay
  const id = searchParams.get('id') || '';
  const type = searchParams.get('type') || 'admin'; // 'manager' or 'admin'
  const fullName = searchParams.get('name') || '';

  useEffect(() => {
    const loadPersonnel = async () => {
      setIsLoading(true);
      try {
        // If the type is 'manager', it fetches subordinates for that specific ID
        // Otherwise, it likely fetches the general directory for the admin
        const employees = await fetchSubordinates(type === 'manager' ? 'manager' : 'admin', id);
        setEventData(employees || []);
      } catch (error) {
        console.error('❌ Directory Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonnel();
  }, [id, type, refresh]);

  return (
    <div className="h-[calc(100vh-100px)] w-full bg-[#f8fafc] p-4 lg:p-8">
      <EmployeesDisplay
        eventList={eventData}
        isLoading={isLoading}
        name={fullName}
        refresher={() => setRefresh((prev) => !prev)}
      />
    </div>
  );
}

// Next.js requirement: Wrap searchParam hooks in Suspense
export default function EmployeesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-[#f8fafc]">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-infinity loading-lg text-primary"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Initializing Feed
            </span>
          </div>
        </div>
      }
    >
      <EmployeesContent />
    </Suspense>
  );
}
