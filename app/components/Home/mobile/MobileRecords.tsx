'use client';

import React, { useEffect, useState } from 'react';
import { RecordsDisplay } from '../RecordsDisplay';
import { initialRecords } from '@/app/Services/apis';
import { CleanClockEvent } from '@/app/Types/EmployeeTypes';
import { FileText } from 'lucide-react';

const MobileRecords = () => {
  const [eventList, setEventList] = useState<CleanClockEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const events = await initialRecords();
        setEventList(events || []);
      } catch (error) {
        console.error('Audit log sync failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="bg-base-100 p-2 flex flex-col">
      <div className="">
        <header className="mb-3">
          <div className="flex gap-2 items-center">
            <FileText size={32} className="shrink-0 text-primary" />
            <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
              System <span className="text-primary">Audit Logs</span>
            </h1>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Employee Records
          </p>
        </header>
      </div>
      <div className="flex-1 min-h-0 gap-4 p-3 flex flex-col border border-slate-100 shadow-sm rounded-2xl">
        <RecordsDisplay eventList={eventList} isLoading={isLoading} message="Recent Records" />
      </div>
    </main>
  );
};

export default MobileRecords;
