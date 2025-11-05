export interface UserProfile {
  id: string; 
  dni: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user'; 
  condition: string;
  position: string;
  created_at: string;
}

export interface UserListParams {
  search?: string | null;
  page?: number | null;
  page_size?: number | null;
}