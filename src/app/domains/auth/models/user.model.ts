export interface User {
  id: number;
  username: string;
  dni: string;
  email: string;
  last_login: string | Date | null;
  position: string | null;
  role: 'admin' | 'user' | string;
}
