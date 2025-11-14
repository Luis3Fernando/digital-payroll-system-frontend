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
  isLoading?: boolean;
  isDeleting?: boolean;
  pdf_url?: string;
}

export interface PayslipListParams {
  page?: number;
  page_size?: number;
  search?: string;
  issue_date?: string;
}

export interface MyPayslipListParams {
  month?: number;
  year?: number;
  page?: number;
  page_size?: number;
}

export interface DeletePayslipRequest {
  id: string;
}