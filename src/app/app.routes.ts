import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/auth-module').then((m) => m.AuthModule),
  },

  {
    path: 'payroll',
    loadChildren: () => import('./domains/payroll/payroll-module').then((m) => m.PayrollModule),
  },

  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/admin-module').then((m) => m.AdminModule),
  },

  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
