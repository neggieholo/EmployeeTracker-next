export interface ClockEvent {
  _id: string;
  name: string;
  clockInTime: string;
  clockInLocation: string;
  clockInComment: string;
  clockOutTime?: string;
  clockOutLocation?: string;
  clockOutComment?: string;
}

export interface DashboardStats {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  ring: string;
}
