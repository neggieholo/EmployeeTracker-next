'use client';

import React from 'react';
import { useUser } from '@/app/UserContext'; // Adjust path as needed
import { X, BellOff, Trash2, Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, deleteNotification, deleteAll } = useUser();

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-base-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="text-primary" size={24} />
            Notifications
          </h1>
          {/* <p className="text-base-content/60 text-sm">
            Manage your real-time alerts and worker updates.
          </p> */}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={deleteAll}
            className="btn btn-error btn-outline btn-sm gap-2 normal-case"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item._id}
              className="group flex items-center justify-between bg-base-100 p-4 md:p-5 rounded-xl border border-base-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base-content">{item.sender}</span>
                  <span className="badge badge-ghost badge-sm text-[10px] opacity-70">
                    {new Date(item.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-base-content/70 mt-1 text-sm leading-relaxed">{item.message}</p>
                <p className="text-[10px] text-base-content/40 mt-2 uppercase tracking-wider font-medium">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>

              {/* Action: Delete Single */}
              <button
                onClick={() => deleteNotification(item._id)}
                className="btn btn-ghost btn-circle btn-sm text-error opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete notification"
              >
                <X size={20} />
              </button>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-3xl border-2 border-dashed border-base-300">
            <div className="bg-base-200 p-6 rounded-full mb-4">
              <BellOff size={48} className="text-base-content/20" />
            </div>
            <h3 className="text-xl font-semibold text-base-content/50">Inbox is empty</h3>
            <p className="text-base-content/40 text-sm mt-1">
              We&apos;ll notify you when something happens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
