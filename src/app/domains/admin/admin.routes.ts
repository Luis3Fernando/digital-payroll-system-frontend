import { Routes } from '@angular/router';
import { AdminDashboardPage } from './components/admin-dashboard-page/admin-dashboard-page';
import { UserManagementPage } from './components/user-management-page/user-management-page';
import { BoletaManagementPage } from './components/boleta-management-page/boleta-management-page';
import { LoginAdminPage } from './components/login-admin-page/login-admin-page';
import { AdminLayout } from '../../core/layouts/admin-layout/admin-layout';
import { authGuard, publicGuard, roleGuard } from '@core/guards/auth.guard';

export const adminRoutes: Routes = [
  { path: 'login', component: LoginAdminPage, canActivate: [publicGuard] },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardPage },
      { path: 'usuarios', component: UserManagementPage },
      { path: 'boletas', component: BoletaManagementPage },
    ],
  },
];
