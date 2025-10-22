import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './components/dashboard-page/dashboard-page';
import { PayslipListPage } from './components/payslip-list-page/payslip-list-page';
import { PayslipDetailPage } from './components/payslip-detail-page/payslip-detail-page';
import { ProfilePage } from './components/profile-page/profile-page';
import { UserLayout } from '../../core/layouts/user-layout/user-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: UserLayout,
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'boletas', component: PayslipListPage },
      { path: 'boleta/:id', component: PayslipDetailPage },
      { path: 'perfil', component: ProfilePage },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
