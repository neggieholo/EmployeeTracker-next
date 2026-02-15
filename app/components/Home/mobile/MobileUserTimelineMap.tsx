/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { jsPDF } from 'jspdf';
import { Download, FileText, MapPin, Navigation } from 'lucide-react';
import { GroupedTimelines } from '@/app/Services/apis';

// Fix for Leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Component to force map to recalculate size and show tiles properly
 */
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

const MapDownloader = ({ userId }: { userId: string }) => {
  const map = useMap();

  const handleDownload = async () => {
    try {
      // Dynamic import to bypass declaration errors and handle missing types
      const { default: lImage } = await import('leaflet-image' as any);

      lImage(map, (err: any, canvas: HTMLCanvasElement) => {
        if (err) return console.error(err);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Map_${userId}.png`;
        link.click();
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-1000">
      <button
        onClick={handleDownload}
        className="btn btn-primary btn-sm shadow-xl flex items-center gap-2 normal-case"
      >
        <Download size={14} />
        Download Image
      </button>
    </div>
  );
};

interface UserTimelineMapProps {
  userId: string;
  timeline: GroupedTimelines[string];
}

const MobileUserTimelineMap = ({ userId, timeline }: UserTimelineMapProps) => {
  const latLngs = useMemo(
    () => timeline.map((p) => [p.lat, p.lon] as [number, number]),
    [timeline]
  );

  const center = useMemo(() => latLngs[0] || [0, 0], [latLngs]);

  useEffect(() => {
    console.log('Timelines:', timeline);
  }, [timeline]);

  const handleDownloadPDF = () => {
    if (!timeline.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Timeline Report: ${userId}`, 15, 20);

    let y = 30;
    timeline.forEach((point, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text(`${i + 1}. ${new Date(point.label).toLocaleString()}`, 15, y);
      doc.setFontSize(8);
      doc.text(`Location: ${point.address || 'No address provided'}`, 20, y + 5);
      y += 12;
    });
    doc.save(`Timeline_${userId}.pdf`);
  };

  if (!timeline.length) return null;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm overflow-y-auto mb-8">
      {/* Header */}
      <div className="bg-base-200 px-6 py-4 flex justify-between items-center border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10 flex justify-center items-center">
              <span className="text-lg font-bold">{userId[0].toUpperCase()}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight">{userId}</h3>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="btn btn-xs gap-2 border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white hover:border-red-600 border-2"
        >
          <FileText size={12} />
          Export PDF
        </button>
      </div>

      {/* Map Section - Use bracket notation for exact pixel height */}
      <div className="relative h-112.5 w-full bg-slate-100">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          attributionControl={false}
        >
          {/* THE FIX: Use the CartoDB tiles from your LiveMap component */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <ResizeMap />
          {timeline.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lon]} />
          ))}

          {latLngs.length > 1 && (
            <Polyline positions={latLngs} color="#570df8" weight={4} dashArray="5, 10" />
          )}

          <MapDownloader userId={userId} />
        </MapContainer>
      </div>

      {/* Movement List Section */}
      <div className="p-4 bg-base-100">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Navigation size={14} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            Route History
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-base-200 bg-slate-50">
          <ul className="divide-y divide-base-200">
            {timeline.map((point, index) => (
              <li
                key={index}
                className="p-3 hover:bg-white transition-colors flex gap-4 items-start"
              >
                <div className="badge badge-sm badge-outline font-mono opacity-50">{index + 1}</div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-600">
                    {new Date(point.label).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-xs font-medium text-slate-800 flex items-center gap-1 leading-tight">
                    <MapPin size={12} className="text-error shrink-0" />
                    {point.address}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileUserTimelineMap;
