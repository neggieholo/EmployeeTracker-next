/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AdminUser } from '../Types';
import localforage from 'localforage';
import { LoginResponse, RegistrationPayload } from '../Types/AdminTypes';
import { CleanClockEvent, EmployeeApiResponse, Employee } from '../Types/EmployeeTypes';

const BASE_URL = 'http://192.168.8.194:3060/api';

export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await response.json();
  console.log('User:', data.user);
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

export const fetchTodayClock = async () => {
  try {
    const response = await fetch(`${BASE_URL}/records/get-clock-events`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    console.log("📜 Clock Events Response:", data);

    if (!data.success || !Array.isArray(data.clockEvents)) {
      console.error("❌ Invalid response format:", data);
      return { clockedInEvents: [], clockedOutEvents: [] };
    }

    const events = data.clockEvents;

    // 🔹 Determine today's date (YYYY-MM-DD)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // 🔹 Filter events for today
    const filteredEvents = events.filter((event) => {
      if (!event.clockInTime) return false; // Skip if missing

      const eventDate = new Date(event.clockInTime);
      const eventDateStr = `${eventDate.getFullYear()}-${String(
        eventDate.getMonth() + 1
      ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;

      return eventDateStr === todayStr;
    });

    // 🔹 Sort oldest → newest by clockInTime
    filteredEvents.sort(
      (a, b) => new Date(a.clockInTime) - new Date(b.clockInTime)
    );

    // 🔹 Split by status
    const clockedInEvents = filteredEvents.filter((e) => e.status === "clocked in");
    const clockedOutEvents = filteredEvents.filter((e) => e.status === "clocked out");

    console.log("🟢 Clocked In:", clockedInEvents);
    console.log("🔴 Clocked Out:", clockedOutEvents);

    return { clockedInEvents, clockedOutEvents };
  } catch (error) {
    console.error("❌ Error fetching clock events:", error);
    return { clockedInEvents: [], clockedOutEvents: [] };
  }
};

export async function fetchRecentEvents() {
    try {
        const response = await fetch(`${BASE_URL}/records/get-recent-events`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });

        const data = await response.json();
        console.log("📜 Clock Events Response:", data);

        if (!data.success || !Array.isArray(data.clockEvents)) {
            console.error("❌ Invalid response format:", data);
            return [];
        }

        // 🔹 Define today's start and tomorrow's start
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // 🔹 Filter events that are today
        let events = data.clockEvents.filter(event => {
            if (!event.clockInTime) return false;

            const clockIn = new Date(event.clockInTime);
            return clockIn >= today && clockIn < tomorrow;
        });

        // 🔹 Sort newest → oldest based on clockInTime
        events.sort((a, b) => new Date(b.clockInTime) - new Date(a.clockInTime));

        console.log('Events', events);
        return events;
    } catch (error) {
        console.error("❌ Error fetching clock events:", error);
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
  role: 'admin' | 'manager' = 'admin'
): Promise<Employee[]> => {
  try {
    const response = await fetch(`${BASE_URL}/subordinates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
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