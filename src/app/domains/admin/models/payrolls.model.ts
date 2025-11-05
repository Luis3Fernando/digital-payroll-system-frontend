export interface Payslip {
  id: string;
  profile_id: string;
  profile_dni: string;
  issue_date: string; 
  view_status: 'seen' | 'unseen' | 'generated';
  concept: string;
  amount: number;
  data_source: string;
  payroll_type: string; 
  data_type: string; 
  position_order: number;
}

export interface PayslipListParams {
  page?: number;
  page_size?: number;
  search?: string;
  issue_date?: string; 
}