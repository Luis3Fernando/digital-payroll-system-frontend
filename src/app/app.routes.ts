import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { APP_ROLES } from '@shared/utils/roles';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'payroll',
    canActivate: [],
    data: { roles: [APP_ROLES.user, APP_ROLES.admin] },
    loadChildren: () => import('./domains/payroll/payroll.routes').then((m) => m.payrollRoutes),
  },
  {
    path: 'admin',
    canActivate: [],
    data: { roles: [APP_ROLES.user, APP_ROLES.admin] },
    loadChildren: () => import('./domains/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
