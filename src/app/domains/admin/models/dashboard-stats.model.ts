export interface UserStats {
  total: number;
  today_registered: number;
}

export interface PayslipsGeneratedStats {
  total: number;
  last_generated: string;
}

export interface PayslipsUnseenStats {
  total: number;
}

export interface PayslipsSeenStats {
  total: number;
  last_seen: string;
}

export interface AdminDashboardStats {
  users: UserStats;
  payslips_generated: PayslipsGeneratedStats;
  payslips_unseen: PayslipsUnseenStats;
  payslips_seen: PayslipsSeenStats;
}
