export interface EmployeeClockEvent {
  _id: string;
  adminId: string;
  managerId: string;
  workerId: string;
  name: string;
  department: string;
  status: 'clocked in' | 'clocked out';

  // Clock-in data
  clockInTime: string; // ISO string from backend
  clockInLocation: string;
  clockInComment?: string;

  // Clock-out data
  clockOutTime: string | null;
  clockOutLocation?: string;
  clockOutComment?: string;

  date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Clean version for the UI (Optional but recommended)
export type CleanClockEvent = Omit<EmployeeClockEvent, '__v' | 'adminId' | 'managerId'>;

export default interface NetworkError {
  message?: string;
  success?: boolean;
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
  };
}

// This matches the format expected by your Profile/Detail view
export type EmployeeProfile = {
  Name: string;
  Email: string;
  Phone: string;
  Department: string;
  Gender: string;
  Role: string;
};

export interface Employee {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  gender: string;
  role: 'manager' | 'worker'; // Based on your API logic
  managerId?: string;
}

export interface EmployeeApiResponse {
  success: boolean;
  employees: Employee[];
  error?: string;
}


// 1. Define the shape of the raw API response
export interface ClockEventsApiResponse {
  success: boolean;
  clockEvents: EmployeeClockEvent[];
  message?: string;
}