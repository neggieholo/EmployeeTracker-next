/* eslint-disable @typescript-eslint/no-explicit-any */
import { CleanClockEvent, Employee } from "./EmployeeTypes";


export interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  companyName: string;
  registeredAt: string;
  role: string;
  plan: string;
  amount: number;
  number: number;
  employeeCount: number;
  status: string;
  subscriptionExpiresAt?: string;
  subscriptionUpdatedAt?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface LoginUser extends AdminUser {
  _id: string;
  transactionId?: string;
  userType?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: LoginUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  plan: string;
  amount: number;
  empNumber: number;
  password: string;
  companyName: string;
  gender?: string; // Optional if not in form yet
}


// types/socket.ts
export interface AppNotification {
  _id: string;
  adminId: string | null;
  managerId: string;
  message: string;
  sender: string;
  date: string; // ISO Date string from server
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SocketUser {
  _id: string;
  adminId: string;
  department: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  pushToken: string;
  registeredAt: string;
  role: string;
  __v: number;
}

// Remove internal DB fields and tokens for UI usage
export type CleanNotification = Omit<AppNotification, '__v' | 'adminId' | 'updatedAt'>;

export type CleanSocketUser = Omit<SocketUser, '__v' | 'pushToken' | 'adminId'>;

export type LocationState = {
  latitude: number;
  longitude: number;
  address?: string | null;
  timestamp: number;
};

export interface AdminContextType {
  onlineMembers: CleanSocketUser[];
  notifications: CleanNotification[];
  employees: Employee[];
  unclockedList: Employee[];
  offlineList: Employee[];
  workerLocations: Record<string, any>;
  clockEvents: { in: CleanClockEvent[]; out: CleanClockEvent[] };
  badgeCount: number;
  isConnected: boolean;
  deleteNotification: (id: string) => void;
  deleteAll: () => void;
  disconnectSocket: () => void;
}

export interface SearchClockResponse {
  success: boolean;
  message?: string;
  clockEvents: CleanClockEvent[];
}