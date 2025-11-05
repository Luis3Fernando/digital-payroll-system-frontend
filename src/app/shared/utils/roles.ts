export type AppRole = 'admin' | 'user';

export const APP_ROLES: Record<AppRole, AppRole> = {
  admin: 'admin',
  user: 'user',
};

export interface RouteData {
  roles?: (AppRole | string)[];
}
