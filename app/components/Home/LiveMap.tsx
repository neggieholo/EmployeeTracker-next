/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/app/UserContext';
import { getMapCoords } from '@/app/Services/apis';
import { MapPin, Clock, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// 1. Dynamic imports for Leaflet components (Strictly no require)
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

const SetMapView = dynamic(
  async () => {
    const { useMap } = await import('react-leaflet');
    return function Component({ coords, zoom }: { coords: [number, number]; zoom: number }) {
      const map = useMap();

      useEffect(() => {
        if (coords[0] !== 0) {
          // requestAnimationFrame waits for the DOM/Layout to be ready
          // this prevents the '_leaflet_pos' undefined error during re-renders
          requestAnimationFrame(() => {
            // Added a small check to ensure map is still initialized
            if (map) {
              map.setView(coords, zoom, { animate: true });
              // Force a resize check in case the parent div changed size
              map.invalidateSize();
            }
          });
        }
      }, [coords, zoom, map]);

      return null;
    };
  },
  { ssr: false }
);

export default function LiveMap() {
  const { workerLocations, isConnected } = useUser();
  const [centerCoords, setCenterCoords] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(2);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Leaflet Icon Fix (CDN based)
    import('leaflet').then((L) => {
      const DefaultIcon = L.Icon.Default.prototype as any;
      delete DefaultIcon._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });

    const fetchInitialCoords = async () => {
      const result = await getMapCoords();
      if (result && result.latitude && result.longitude) {
        setCenterCoords([parseFloat(result.latitude), parseFloat(result.longitude)]);
        setZoom(13);
      }
    };
    fetchInitialCoords();
  }, []);

  const locationEntries = Object.entries(workerLocations);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 h-[calc(100vh-100px)]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black italic text-slate-800 uppercase tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <MapPin className="text-primary" size={24} />
            </div>
            Live <span className="text-primary">Locations</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`}
            />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
              {isConnected ? 'Pulse Online' : 'Signal Lost'} • {locationEntries.length} Active
              Signals
            </span>
          </div>
        </div>
        {/* <button
          onClick={() => window.location.reload()}
          className="btn btn-ghost hover:bg-slate-50 rounded-2xl gap-2 text-slate-500 font-bold border border-slate-100"
        >
          <RefreshCw size={16} />{' '}
          <span className="text-xs uppercase tracking-widest">Reset View</span>
        </button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map Display */}
        <div className="lg:col-span-3 h-[65vh] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
          {isClient && (
            <MapContainer
              center={centerCoords}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              attributionControl={false}
            >
              {/* This is the logic that pans the map */}
              <SetMapView coords={centerCoords} zoom={zoom} />

              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

              {locationEntries.map(([workerName, data]: [string, any]) => (
                <Marker key={workerName} position={[data.latitude, data.longitude]}>
                  <Popup>
                    <div className="p-1 min-w-37.5">
                      <p className="font-black text-primary uppercase text-[11px] mb-1">
                        {workerName}
                      </p>
                      <p className="text-[10px] text-slate-600 leading-tight mb-2 italic">
                        {data.address}
                      </p>
                      <div className="flex items-center gap-1.5 text-slate-400 pt-2 border-t border-slate-100">
                        <Clock size={12} />
                        <span className="text-[9px] font-bold">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Live Feed Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] px-2">
            Telemetry Feed
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[55vh] pr-2 custom-scrollbar">
            {locationEntries.length === 0 ? (
              <div className="bg-slate-50/50 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <Info className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Scanning...
                </p>
              </div>
            ) : (
              locationEntries.map(([name, data]: [string, any]) => (
                <button
                  key={name}
                  onClick={() => {
                    setCenterCoords([data.latitude, data.longitude]);
                    setZoom(16); // Focus in when clicked
                  }}
                  className="w-full text-left bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-800 uppercase group-hover:text-primary transition-colors">
                      {name}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 leading-relaxed italic pr-4">
                    {data.address || 'Resolving...'}
                  </p>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      {new Date(data.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
