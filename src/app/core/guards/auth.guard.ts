import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@domains/auth/services/session.service';
import { ToastService } from '@shared/services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (sessionService.getAccessToken()) {
    // El usuario está autenticado (tiene token)
    return true;
  } else {
    // El usuario NO está autenticado
    toastService.show(
      'error',
      'Acceso Denegado',
      'Necesitas iniciar sesión para acceder a esta área.'
    );
    // Redirigir al login
    return router.createUrlTree(['/auth/login']);
  }
};