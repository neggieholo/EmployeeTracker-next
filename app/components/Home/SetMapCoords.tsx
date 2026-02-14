'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MapPin, Navigation, Save, Info } from 'lucide-react';
import {getMapCoords} from '@/app/Services/apis';
import { setMapCoordinates } from '@/app/Services/apis';

const SetMapCoords = () => {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ latitude: '', longitude: '' });

  // Initial Data Fetch
  useEffect(() => {
    async function fetchInitialCoords() {
      const result = await getMapCoords();
      if (result) {
        setCoords({
          latitude: result.latitude?.toString() || '',
          longitude: result.longitude?.toString() || '',
        });
      }
    }
    fetchInitialCoords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (isNaN(parseFloat(coords.latitude)) || isNaN(parseFloat(coords.longitude))) {
      toast.error('Please enter valid numerical coordinates');
      return;
    }

    setLoading(true);
    try {
      const result = await setMapCoordinates(coords);
      if (result.message) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Failed to update coordinates');
      }
    } catch (err: any) {
      toast.error(err.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-2 h-10 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-2xl font-black italic text-slate-800 tracking-tight uppercase">
            Map <span className="text-primary">Configuration</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
            Set the central point for your geofencing
          </p>
        </div>
      </div>

      <div className="card bg-white shadow-xl shadow-slate-200/60 border border-slate-100">
        <form onSubmit={handleSubmit} className="card-body gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Latitude Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-slate-600 flex items-center gap-2">
                  <Navigation size={14} className="text-primary rotate-45" /> Latitude
                </span>
              </label>
              <input
                type="number"
                step="any"
                className="input input-bordered w-full bg-slate-50 focus:input-primary font-mono"
                value={coords.latitude}
                onChange={(e) => setCoords({ ...coords, latitude: e.target.value })}
                placeholder="e.g. 6.5244"
                required
              />
            </div>

            {/* Longitude Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-slate-600 flex items-center gap-2">
                  <Navigation size={14} className="text-primary rotate-135" /> Longitude
                </span>
              </label>
              <input
                type="number"
                step="any"
                className="input input-bordered w-full bg-slate-50 focus:input-primary font-mono"
                value={coords.longitude}
                onChange={(e) => setCoords({ ...coords, longitude: e.target.value })}
                placeholder="e.g. 3.3792"
                required
              />
            </div>
          </div>

          <div className="divider opacity-50"></div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <MapPin size={14} /> Global Coordinates System
            </div>

            <button
              type="submit"
              className="btn btn-primary shadow-lg shadow-primary/20 gap-2 min-w-[140px]"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <Save size={18} /> Update Coords
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Alert */}
      <div className="mt-6 alert bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm rounded-2xl">
        <Info size={20} className="shrink-0" />
        <div className="text-xs font-medium leading-relaxed">
          These coordinates define the &quot;Center Point&quot; for your company map. All employee distances
          and geofence alerts will be calculated relative to this location.
        </div>
      </div>
    </div>
  );
};

export default SetMapCoords;
