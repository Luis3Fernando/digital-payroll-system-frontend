export interface WorkDetails {
  worked_days: number;
  non_worked_days: number;
  worked_hours: number;
  discount_academic_hours: number;
  discount_lateness: number;
  personal_leave_hours: number;
  sunday_discount: number;
  vacation_days: number;
  vacation_hours: number;
}

export interface UserProfileDetails {
  id: string;
  dni: string;
  role: 'user' | 'admin' | string;
  first_name: string;
  last_name: string;
  email: string | null;
  username: string;
  position: string;
  description: string | null;
  descriptionSP: string | null;
  start_date: string | null;
  end_date: string | null;
  resigned_date: string | null;
  resigned: boolean;
  regimen: string | null;
  category: string | null;
  condition: string | null;
  identification_code: string | null;
  establishment: string | null;
  is_active: boolean;
  work_details: WorkDetails | null;
}
