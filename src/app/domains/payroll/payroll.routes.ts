import { Routes } from '@angular/router';
import { DashboardPage } from './components/dashboard-page/dashboard-page';
import { PayslipListPage } from './components/payslip-list-page/payslip-list-page';
import { ProfilePage } from './components/profile-page/profile-page';
import { UserLayout } from '../../core/layouts/user-layout/user-layout';
import { PasswordResetPage } from './components/password-reset-page/password-reset-page';

export const payrollRoutes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'boletas', component: PayslipListPage },
      { path: 'perfil', component: ProfilePage },
      { path: 'cambio-contrasenia', component: PasswordResetPage },
    ],
  },
];
