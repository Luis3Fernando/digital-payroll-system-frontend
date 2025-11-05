export interface User {
  id: number;
  username: string;
  dni: string;
  email: string;
  role: 'admin' | 'user' | string;
}
