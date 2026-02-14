'use client';

import { useUser } from '@/app/UserContext'; // Adjust path as needed
import { X, BellOff, Trash2, Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, deleteNotification, deleteAll } = useUser();

  return (
    <div className="w-full mx-auto bg-white p-2 relative h-[calc(100vh-100px)] flex flex-col">
      {/* Header Card */}
      <div className="sticky mt-4 w-full top-0 left-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-primary/50 p-6 rounded-2xl shadow-sm z-50">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-white gap-2">
            <Bell className="text-white" size={24} />
            Notifications
          </h1>
          {/* <p className="text-base-content/60 text-sm">
            Manage your real-time alerts and worker updates.
          </p> */}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={deleteAll}
            className="btn btn-error btn-outline bg-red-300 btn-sm gap-2 normal-case text-white"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      <div className="w-full p-4 overflow-y-auto flex-1">
        <div className="space-y-4 max-w-7xl mx-auto">
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
                  <p className="text-base-content/70 mt-1 text-sm leading-relaxed">
                    {item.message}
                  </p>
                  <p className="text-[10px] text-base-content/40 mt-2 uppercase tracking-wider font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Action: Delete Single */}
                <button
                  onClick={() => deleteNotification(item._id)}
                  className="btn btn-ghost btn-circle btn-sm text-error group-hover:text-red-700 transition-opacity"
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
    </div>
  );
}
