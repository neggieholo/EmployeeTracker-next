'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RecordsDisplay } from './RecordsDisplay';
import { fetchWorkerData } from '@/app/Services/apis';
import { CleanClockEvent } from '@/app/Types/EmployeeTypes';

function SubRecordsContent() {
  const searchParams = useSearchParams();
  const [eventList, setEventList] = useState<CleanClockEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract params passed from EmployeesDisplay handleNavigation
  const id = searchParams.get('id') || '';
  const name = searchParams.get('name') || 'Employee';

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Using the ID extracted from the URL
        const events = await fetchWorkerData(id);
        setEventList(events || []);
      } catch (error) {
        console.error('Audit log sync failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <main className="bg-slate-50/50 p-4 h-[calc(100vh-100px)] flex flex-col">
      <header className="mb-3">
        <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">
          System <span className="text-primary">Audit Logs</span>
        </h1>
      </header>

      <div className="flex-1 min-h-0 gap-4 p-3 flex flex-col border border-slate-100 shadow-sm rounded-2xl bg-white">
        <RecordsDisplay
          eventList={eventList}
          isLoading={isLoading}
          message={`Individual Records - Most Recent`}
        />
      </div>
    </main>
  );
}

// Wrap in Suspense to prevent build errors in Next.js
export default function SubRecords() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loading loading-infinity loading-lg text-primary"></span>
        </div>
      }
    >
      <SubRecordsContent />
    </Suspense>
  );
}
