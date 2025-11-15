export interface DashboardData {
    users: UsersStats;
    payslips: PayslipStats;
    engagement: EngagementStats;
}

export interface UsersStats {
    total: number;
    today_registered: number;
    never_seen_payslips: number;
    inactive_users: number;
}

export interface PayslipStats {
    generated: {
        total: number;
        last_generated: string;
    };
    unseen: {
        total: number;
    };
    seen: {
        total: number;
        last_seen: string;
        avg_open_time: string;
    };
    view_rate: string;
}

export interface EngagementStats {
    logs_today: number;
    top_users: Array<{
        full_name: string;
        total: number;
    }>;
    hourly_activity: Array<{
        hour: number;
        total: number;
    }>;
}
export interface RecentAdminAction {
  action: string;
  user: string;
  date: string;
}

export interface SecurityAuditData {
  admin_actions_last_30d: number;
  recent_admin_actions: RecentAdminAction[];
  failed_login_attempts: number;
}

export interface HourlyActivityItem {
    hour: number;
    total: number;
}