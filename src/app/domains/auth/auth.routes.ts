import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { publicGuard } from '@core/guards/auth.guard';

export const authRoutes: Routes = [{ path: 'login', component: LoginPage, canActivate: [publicGuard] }];
