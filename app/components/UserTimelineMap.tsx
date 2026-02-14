'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import leafletImage from 'leaflet-image';
import reverseGeocode from '../fetchers/reverseGeocode';
import { jsPDF } from 'jspdf';
import { Download, Map as MapIcon, FileText, MapPin, Navigation } from 'lucide-react';

// Fix for Leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapDownloader = ({ userId }: { userId: string }) => {
  const map = useMap();

  const handleDownload = () => {
    leafletImage(map, (err, canvas) => {
      if (err) return console.error(err);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Map_${userId}.png`;
      link.click();
    });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
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

const UserTimelineMap = ({ userId, timeline }: { userId: string; timeline: any[] }) => {
  const [addresses, setAddresses] = useState<string[]>([]);

  const latLngs = useMemo(
    () => timeline.map((p) => [p.lat, p.lon] as [number, number]),
    [timeline]
  );
  const center = latLngs[0] || [0, 0];

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
      doc.text(`Location: ${addresses[i] || 'Searching...'}`, 20, y + 5);
      y += 12;
    });
    doc.save(`Timeline_${userId}.pdf`);
  };

  useEffect(() => {
    const fetchAllAddresses = async () => {
      const results = await Promise.all(
        timeline.map(async (p) => {
          try {
            return (await reverseGeocode(p.lat, p.lon)) || 'Unknown Location';
          } catch {
            return 'Geocode Failed';
          }
        })
      );
      setAddresses(results);
    };
    if (timeline.length) fetchAllAddresses();
  }, [timeline]);

  if (!timeline.length) return null;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-base-200 px-6 py-4 flex justify-between items-center border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10">
              <span className="text-lg font-bold">{userId[0].toUpperCase()}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight">{userId}</h3>
            <span className="text-[10px] opacity-60 font-bold uppercase italic">
              Tracking Active
            </span>
          </div>
        </div>
        <button onClick={handleDownloadPDF} className="btn btn-outline btn-secondary btn-xs gap-2">
          <FileText size={12} />
          Export PDF
        </button>
      </div>

      {/* Map Section */}
      <div className="relative h-[350px] w-full bg-slate-200">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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

        <div className="max-h-[200px] overflow-y-auto rounded-xl border border-base-200 bg-slate-50">
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
                  <span className="text-xs font-medium text-slate-800 flex items-center gap-1">
                    <MapPin size={12} className="text-error" />
                    {addresses[index] || <span className="loading loading-dots loading-xs"></span>}
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

export default UserTimelineMap;
