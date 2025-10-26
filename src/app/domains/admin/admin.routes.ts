import { Routes } from '@angular/router';
import { AdminDashboardPage } from './components/admin-dashboard-page/admin-dashboard-page';
import { UserManagementPage } from './components/user-management-page/user-management-page';
import { BoletaManagementPage } from './components/boleta-management-page/boleta-management-page';
import { LoginAdminPage } from './components/login-admin-page/login-admin-page';
import { AdminLayout } from '../../core/layouts/admin-layout/admin-layout';
import { AuditPage } from './components/audit-page/audit-page';

export const adminRoutes: Routes = [
  { path: 'login', component: LoginAdminPage },
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardPage },
      { path: 'usuarios', component: UserManagementPage },
      { path: 'boletas', component: BoletaManagementPage },
      { path: 'auditoria', component: AuditPage },
    ],
  },
];
