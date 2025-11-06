export interface PayslipGenerationData {
  id: string;
  pdf_url: string;
  view_status: 'seen' | 'unseen' | 'generated';
}

export interface PayslipViewData {
  payslip_id: string;
  pdf_url: string;
  status: 'seen' | 'unseen' | 'generated';
  issue_date: string;
  concept: string;
  amount: number;
}
