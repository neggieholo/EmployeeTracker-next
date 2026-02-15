'use client';

import React, { useEffect, useState, useMemo } from 'react';
import UserTimelineMap from './UserTimelineMap';
import TimelineMapControls from './TimelineControls';
import { fetchTodaysTimelines, fetchFilteredMaps, GroupedTimelines } from '@/app/Services/apis';
import { toast } from 'react-toastify';
import { Map as MapIcon, Search} from 'lucide-react';

const MapTimelines = () => {
  const [userTimelines, setUserTimelines] = useState<GroupedTimelines>({});
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      const data = await fetchTodaysTimelines();
      if (data) setUserTimelines(data);
      setIsLoading(false);
    };
    loadInitial();
  }, []);

  // Filter logic (Memoized for performance)
  const filteredTimelines : GroupedTimelines = useMemo(() => {
    if (!searchValue) return userTimelines;

    const search = searchValue.toLowerCase();
    return Object.fromEntries(
      Object.entries(userTimelines).filter(
        ([uid, points]) =>
          uid.toLowerCase().includes(search) ||
          points.some((p) => p.label.toLowerCase().includes(search))
      )
    );
  }, [searchValue, userTimelines]);

  const handleDateFilter = async (start: string, end: string) => {
    if (!start) {
      toast.error('Please enter a start date');
      return;
    }
    setIsLoading(true);
    setStartDate(start);
    setEndDate(end);

    const filtered = await fetchFilteredMaps(start, end);
    if (filtered) {
      setUserTimelines(filtered);
    } else {
      setUserTimelines({});
      toast.info('No records found for these dates');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-white h-[calc(100vh-100px)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <MapIcon className="text-primary" size={32} />
            Route <span className="text-primary">Timelines</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="badge badge-outline badge-sm font-bold opacity-70">
              {startDate ? `${startDate} to ${endDate || startDate}` : 'Today'}
            </div>
          </div>
        </div>

        <TimelineMapControls
          searchValue={searchValue}
          onSearch={setSearchValue}
          onFilterByDate={handleDateFilter}
        />
      </div>

      {/* Stats Summary */}
      <div className="stats shadow bg-base-200 w-full md:w-fit">
        <div className="stat">
          <div className="stat-title font-bold text-xs uppercase italic">Present Routes</div>
          <div className="stat-value text-primary text-2xl">
            {Object.keys(filteredTimelines).length}
          </div>
          <div className="stat-desc font-medium">Employees&apos; routes history in field</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="rounded-3xl border border-base-300 bg-base-100 min-h-100 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>
        ) : Object.keys(filteredTimelines).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <Search size={64} />
            <p className="text-xl font-black uppercase italic mt-4">No Geodata Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-4">
            {Object.keys(filteredTimelines).map((uid) => (
              <div key={uid} className="card bg-base-200 shadow-sm border border-base-300">
                <div className="card-body p-4">
                  {/* <h2 className="card-title text-sm font-black uppercase flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-secondary" />
                    {uid}
                  </h2> */}
                  <div className="h-100 rounded-2xl overflow-y-auto border-2 border-base-300">
                    <UserTimelineMap userId={uid} timeline={filteredTimelines[uid]} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapTimelines;
