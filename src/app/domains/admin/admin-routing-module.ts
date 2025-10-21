import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPage } from './components/admin-dashboard-page/admin-dashboard-page';
import { UserManagementPage } from './components/user-management-page/user-management-page';
import { BoletaManagementPage } from './components/boleta-management-page/boleta-management-page';
import { SystemSettingsPage } from './components/system-settings-page/system-settings-page';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardPage },
  { path: 'usuarios', component: UserManagementPage },
  { path: 'boletas', component: BoletaManagementPage },
  { path: 'configuracion', component: SystemSettingsPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
