import { User } from './user.model';

export interface Session {
  access: string;
  refresh: string;
  user: User;
}
