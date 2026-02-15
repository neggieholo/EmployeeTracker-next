/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AdminUser } from '../Types';
import localforage from 'localforage';
import { LoginResponse, RegistrationPayload } from '../Types/AdminTypes';
import {
  EmployeeApiResponse,
  Employee,
  ClockEventsApiResponse,
  EmployeeClockEvent,
  CleanClockEvent,
} from '../Types/EmployeeTypes';
import { toast } from 'react-toastify';

const BASE_URL = 'http://89.116.34.203:3066/api';

interface ClockData {
  clockedInEvents: EmployeeClockEvent[];
  clockedOutEvents: EmployeeClockEvent[];
}

export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await response.json();
  return data;
};

/**
 * Fetches the current rates/plans from the backend
 */
export const fetchRates = async (): Promise<Record<string, number>> => {
  const response = await fetch(`${BASE_URL}/owner/rates`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Could not fetch rates');
  }

  // Convert string prices to numbers
  return {
    silver: parseInt(data.plans.silver),
    gold: parseInt(data.plans.gold),
    platinum: parseInt(data.plans.platinum),
    diamond: parseInt(data.plans.diamond),
  };
};

export const selectPlanAndContinue = async (planData: {
  plan: string;
  amount: number;
  empNumber: number;
}) => {
  try {
    // Store the selection so the Signup page can pick it up later
    await localforage.setItem('selectedPlan', planData);
    return true;
  } catch (err) {
    console.error('Storage Error:', err);
    throw new Error('Failed to save plan selection.');
  }
};

// ... existing imports ...

export const checkUser = async (email: string, phoneNumber: string, companyName: string) => {
  const response = await fetch(`${BASE_URL}/check-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, phoneNumber, companyName }),
  });
  return await response.json(); // Returns { exists: boolean, message: string }
};

export const initiatePayment = async (payload: RegistrationPayload): Promise<string> => {
  const response = await fetch(`${BASE_URL}/payment/initiate-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // Handle the error structure from your backend
  if (!response.ok) {
    throw new Error(data.error || 'Payment initiation failed');
  }

  // Your backend returns { success: true, paymentLink: "..." }
  if (data.success && data.paymentLink) {
    return data.paymentLink;
  } else {
    throw new Error(data.error || 'Failed to generate payment link');
  }
};

export const fetchTodayClock = async (): Promise<ClockData> => {
  try {
    const response = await fetch(`${BASE_URL}/records/get-clock-events`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();

    if (!data.success || !Array.isArray(data.clockEvents)) {
      return { clockedInEvents: [], clockedOutEvents: [] };
    }

    const events: EmployeeClockEvent[] = data.clockEvents;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Simpler way to get YYYY-MM-DD

    const filteredEvents = events.filter((event) => {
      if (!event.clockInTime) return false;
      return event.clockInTime.split('T')[0] === todayStr;
    });

    // TypeScript Fix: use .getTime() for subtraction
    filteredEvents.sort(
      (a, b) => new Date(a.clockInTime).getTime() - new Date(b.clockInTime).getTime()
    );

    return {
      clockedInEvents: filteredEvents.filter((e) => e.status === 'clocked in'),
      clockedOutEvents: filteredEvents.filter((e) => e.status === 'clocked out'),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return { clockedInEvents: [], clockedOutEvents: [] };
  }
};

export async function fetchRecentEvents(): Promise<EmployeeClockEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/records/get-recent-events`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    // 2. Cast the JSON response to our interface
    const data: ClockEventsApiResponse = await response.json();


    if (!data.success || !Array.isArray(data.clockEvents)) {
      console.error('❌ Invalid response format:', data);
      return [];
    }

    // 3. Define today's time boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 4. Filter and Type-check events
    const events = data.clockEvents
      .filter((event: EmployeeClockEvent) => {
        if (!event.clockInTime) return false;

        const clockIn = new Date(event.clockInTime);
        return clockIn >= today && clockIn < tomorrow;
      })
      // 5. Sort newest first
      .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());

    return events;
  } catch (error) {
    console.error('❌ Error fetching clock events:', error);
    return [];
  }
}

export const checkSession = async (): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/session-check`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Crucial to send the session cookie
    });

    const data = await response.json();
    return data; // Returns { success: boolean, user?: LoginUser }
  } catch (error) {
    console.error('❌ Session Check Error:', error);
    return { success: false, message: 'Network error', user: null as any };
  }
};

export const fetchSubordinates = async (
  role: 'admin' | 'manager' = 'admin',
  id: string = ''
): Promise<Employee[]> => {
  try {
    const response = await fetch(`${BASE_URL}/subordinates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, managerId: id }),
      credentials: 'include',
    });

    const data: EmployeeApiResponse = await response.json();

    if (!data.success) {
      console.error('❌ API Error:', data.error);
      return [];
    }

    return data.employees;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return [];
  }
};

interface DeleteWorkerProps {
  userId: string;
  role: string;
  refresher: () => void;
}

export const DeleteWorker = async ({ userId, role, refresher }: DeleteWorkerProps) => {
  const deleteData = {
    userID: userId,
    role: role,
  };

  try {
    const response = await fetch(`${BASE_URL}/subordinates/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deleteData),
      credentials: 'include',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error deleting user account:', error);
    toast.error('Error deleting user. Please try again.');
  }
};

export const changeAdminPassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('❌ Change Password Error:', error);
    throw error;
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/profile`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const setMapCoordinates = async (coords: { latitude: string; longitude: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/records/set-mapCoords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coords),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('Request failed', error);
    throw error;
  }
};

export async function getMapCoords() {
  try {
    const response = await fetch(`${BASE_URL}/records/retrieve-mapCoords`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.coordinates;
    } else {
      const errorData = await response.json();
      console.error('Error retrieving coordinates:', errorData.error);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

export async function DeleteAccount(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/subordinates/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.error || 'Delete failed' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export const initiateUpgradePayment = async (payload: {
  email: string;
  plan: string;
  amount: number;
  empNumber: number;
}) => {
  const response = await fetch(`${BASE_URL}/payment/upgrade-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  return await response.json();
};

export const logOut = async () => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    await localforage.clear();

    if (data.success) {
      toast.success(data.message || 'Logged out successfully.');
      return true;
    }
    toast.warn('Session cleared.');
    return true;
  } catch (err) {
    console.error('Logout failed:', err);
    await localforage.clear();
    return true; // Return true anyway to force redirect on frontend
  }
};

/**
 * Initiates a password reset for the admin
 */
export const forgotPasswordAdmin = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role: 'admin' }),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('API Error (forgotPassword):', error);
    throw new Error('Server unreachable. Please check your connection.');
  }
};

/**
 * Finalizes the password reset with the new credentials
 */
export const resetPasswordAdmin = async (payload: {
  token: string;
  password: string;
  role: string;
  userId: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('API Error (resetPassword):', error);
    throw new Error('Network error during password reset.');
  }
};

/**
 * Helper to strip internal DB fields and return a CleanClockEvent
 */
const cleanEvent = (event: EmployeeClockEvent): CleanClockEvent => {
  const { __v, adminId, managerId, ...clean } = event;
  return clean;
};

export async function initialRecords(): Promise<CleanClockEvent[]> {
  try {
    const response = await fetch(`${BASE_URL}/records/get-clock-events`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();

    if (!data.success || !Array.isArray(data.clockEvents)) return [];

    // Clean and Sort (Newest First)
    return (data.clockEvents as EmployeeClockEvent[])
      .map(cleanEvent)
      .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());
  } catch (error) {
    console.error('❌ Error fetching initial records:', error);
    return [];
  }
}

export const fetchSearchData = async (
  startDate: string,
  endDate: string,
  name: string
): Promise<CleanClockEvent[]> => {
  try {
    const requestBody: any = {};

    if (startDate || endDate) {
      requestBody.dateQuery = startDate === endDate ? { startDate } : { startDate, endDate };
    }

    if (name?.trim()) {
      requestBody.name = name.trim();
    }

    const response = await fetch(`${BASE_URL}/records/search-clock-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      credentials: 'include',
    });

    const data = await response.json();
    if (!data.success || !Array.isArray(data.clockEvents)) return [];

    return (data.clockEvents as EmployeeClockEvent[])
      .map(cleanEvent)
      .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());
  } catch (error) {
    console.error('❌ Error fetching search data:', error);
    return [];
  }
};

export const fetchWorkerData = async (id: string): Promise<CleanClockEvent[]> => {
  try {
    const response = await fetch(`${BASE_URL}/records/get-sub-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    if (!data.success || !Array.isArray(data.clockEvents)) return [];

    return (data.clockEvents as EmployeeClockEvent[])
      .map(cleanEvent)
      .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());
  } catch (error) {
    console.error('❌ Error fetching search data:', error);
    return [];
  }
};

// The base shape of a single coordinate point
export interface TimelineEntry {
  displayName: string;
  latitude: number;
  longitude: number;
  address?: string; // Added address
  timestamp: string;
}

// Update this to include the address field
export type GroupedTimelines = Record<
  string,
  {
    lat: number;
    lon: number;
    label: string;
    address: string;
  }[]
>;

const groupTimelineData = (results: TimelineEntry[]): GroupedTimelines => {
  const grouped: GroupedTimelines = {};

  // 1. Sort results by timestamp (Oldest to Newest)
  const sortedResults = [...results].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  sortedResults.forEach(({ displayName, latitude, longitude, timestamp, address }) => {
    // Create a unique key for User + Date (e.g., "Simon manager - 2026-02-14")
    const dateKey = new Date(timestamp).toLocaleDateString();
    const groupKey = `${displayName} (${dateKey})`;

    if (!grouped[groupKey]) grouped[groupKey] = [];

    grouped[groupKey].push({
      lat: latitude,
      lon: longitude,
      label: timestamp,
      address: address || 'No address recorded',
    });
  });

  return grouped;
};

export const fetchTodaysTimelines = async (): Promise<GroupedTimelines | null> => {
  try {
    const response = await fetch(`${BASE_URL}/records/todays-timelines`, {
      method: 'GET',
      credentials: 'include', // 👈 Required to send session cookies
    });
    const data = await response.json();
    return data.success ? groupTimelineData(data.timelineResults) : null;
  } catch (error) {
    console.error("❌ Error fetching today's timelines:", error);
    return null;
  }
};

export const fetchFilteredMaps = async (
  startDate: string,
  endDate?: string
): Promise<GroupedTimelines | null> => {
  try {
    const requestBody = {
      dateQuery: {
        startDate,
        endDate: endDate || startDate,
      },
    };

    const response = await fetch(`${BASE_URL}/records/search-map-dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      credentials: 'include', // 👈 Required to send session cookies
    });

    const data = await response.json();
    if (data.success && Array.isArray(data.mapSearchResults)) {
      return groupTimelineData(data.mapSearchResults);
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching filtered map events:', error);
    return null;
  }
};

// apis.ts updates

export interface Manager {
  _id: string;
  name: string;
  department: string;
}

export interface ManagerResponse {
  success: boolean;
  managers?: Manager[];
  message?: string;
  error?: string;
}

export const fetchManagers = async (): Promise<ManagerResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/manager/get-managers`, {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching managers:", error);
    return null;
  }
};

export const registerEmployee = async (data: any): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/manager/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: "Connection failed" };
  }
};