/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import {
  AdminUser,
  CleanSocketUser,
  CleanNotification,
  AdminContextType,
} from './Types/AdminTypes';
import { CleanClockEvent, Employee } from './Types/EmployeeTypes';
import { fetchTodayClock, fetchSubordinates } from './Services/apis';

// Combine the basic User Profile with the Real-time Socket functionality
interface UnifiedUserContextType extends AdminContextType {
  user: AdminUser | null;
  setUser: (user: AdminUser | null) => void;
}

const UserContext = createContext<UnifiedUserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  // --- Profile State ---
  const [user, setUser] = useState<AdminUser | null>(null);

  // --- Real-time / Socket States ---
  const [isConnected, setIsConnected] = useState(false);
  const [onlineMembers, setOnlineMembers] = useState<CleanSocketUser[]>([]);
  const [notifications, setNotifications] = useState<CleanNotification[]>([]);
  const [workerLocations, setWorkerLocations] = useState<Record<string, any>>({});
  const [clockEvents, setClockEvents] = useState<{ in: CleanClockEvent[]; out: CleanClockEvent[] }>(
    { in: [], out: [] }
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [unclockedList, setUnclockedList] = useState<Employee[]>([]);
  const [offlineList, setOfflineList] = useState<Employee[]>([]);

  const badgeCount = notifications.length;

  // useEffect(() => {
  //   const initAuth = async () => {
  //     const data = await checkSession();

  //     if (!data.success) {
  //       setUser(null);
  //       setSessionId(null);
  //       // Only redirect if we are trying to access protected pages
  //       if (window.location.pathname.startsWith('/home')) {
  //         router.push('/');
  //       }
  //     } else {
  //       // Success: Set user and wake up socket
  //       const { _id, userType, transactionId, ...profileData } = data.user;
  //       void _id;
  //       void userType;
  //       void transactionId;

  //       setUser(profileData);
  //       setUserName(profileData.firstName);
  //       setSessionId('active');
  //     }
  //     setIsLoading(false);
  //   };

  //   initAuth();
  // }, [router]);

  // --- Socket Logic ---
  
  useEffect(() => {
    
    const newSocket = io('http://192.168.8.194:3060', {
      path: '/api/socket.io',
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('onlineCheck', (users) => setOnlineMembers(users));
    // newSocket.on('user_location', (data) => {
    //   setWorkerLocations((prev) => ({
    //     ...prev,
    //     [data.user]: { ...data.location },
    //   }));
    // });

    newSocket.on('user_location', (data) => {
      console.log(`📍 Received location for ${data.user}`);

      setWorkerLocations((prev) => {
        let lat = parseFloat(data.location.latitude);
        let lon = parseFloat(data.location.longitude);

        // 1. Check for overlap, but EXCLUDE the worker who just sent the data
        const isOverlapping = Object.entries(prev).some(
          ([workerName, workerData]: [string, any]) => {
            // Only compare if it's a DIFFERENT person
            if (workerName !== data.user) {
              return (
                parseFloat(workerData.latitude) === lat && parseFloat(workerData.longitude) === lon
              );
            }
            return false;
          }
        );

        if (isOverlapping) {
          // Apply offset only if they are standing on SOMEONE ELSE'S spot
          lat = lat + (Math.random() - 0.5) * 0.0001;
          lon = lon + (Math.random() - 0.5) * 0.0001;
          console.log(`⚠️ Overlap found for ${data.user} with another worker. Offset applied.`);
        }

        return {
          ...prev,
          [data.user]: {
            latitude: lat,
            longitude: lon,
            address: data.location.address,
            timestamp: data.location.timestamp,
          },
        };
      });
    });


    newSocket.on('messages', (data) => {
      setNotifications((prev) => {
        const incoming = Array.isArray(data) ? data : [data];
        const combined = [...incoming, ...prev];
        return combined.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
      });
    });

    socketRef.current = newSocket;
    return () => {
      newSocket.close();
    };
  }, []);

  // --- Polling & Helpers ---
  const disconnectSocket = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  };

  const deleteNotification = (notificationId: string) => {
    socketRef.current?.emit('delete_notification', { notificationId });
  };

  const deleteAll = () => socketRef.current?.emit('delete_all_notifications');

  
  useEffect(() => {

    const performFetch = async () => {
      console.log('🔄 Background Polling: Fetching Clock Events...');
      const data = await fetchTodayClock();
      setClockEvents({
        in: data.clockedInEvents,
        out: data.clockedOutEvents,
      });
    };

    // Initial fetch
    performFetch();

    // Polling every 5 seconds
    const interval = setInterval(performFetch, 5000);

    return () => {
      console.log('🛑 Stopping Background Polling');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchSubordinates().then((data) => setEmployees(data));
  }, []);

  useEffect(() => {
    const SetOffUnclocked = () => {
      if (employees && employees.length > 0) {
        // onlineMembers use _id (socket), employees use id (API)
        const onlineIds = onlineMembers.map((u) => u._id);

        // Filter Offline
        const offline = employees.filter((emp) => !onlineIds.includes(emp.id));
        setOfflineList(offline);

        // Get Clock IDs
        const clockedInIds = (clockEvents?.in || []).map((c) => c.workerId);
        const clockedOutIds = (clockEvents?.out || []).map((c) => c.workerId);

        // Filter Unclocked
        const unclocked = employees.filter(
          (emp) =>
            emp.role === 'worker' &&
            !clockedInIds.includes(emp.id) &&
            !clockedOutIds.includes(emp.id)
        );

        setUnclockedList(unclocked);
      }
    }

    SetOffUnclocked();
  }, [employees, onlineMembers, clockEvents]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        onlineMembers,
        employees,
        unclockedList,
        offlineList,
        notifications,
        workerLocations,
        clockEvents,
        badgeCount,
        isConnected,
        deleteNotification,
        deleteAll,
        disconnectSocket,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
