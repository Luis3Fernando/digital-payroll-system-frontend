import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '@domains/auth/services/session.service';

export const authGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.getAccessToken()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.getAccessToken()) {
    const user = sessionService.getCurrentUser();
    
    if (user?.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/payroll/dashboard']);
    }
    return false;
  }

  return true;
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const sessionService = inject(SessionService);
    const router = inject(Router);
    const user = sessionService.getCurrentUser();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    if (user?.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else if (user?.role === 'user') {
      router.navigate(['/payroll/dashboard']);
    } else {
      router.navigate(['/auth/login']);
    }
    
    return false;
  };
};