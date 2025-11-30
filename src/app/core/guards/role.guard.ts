import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '@domains/auth/models/user.model';
import { SessionService } from '@domains/auth/services/session.service';
import { ToastService } from '@shared/services/toast.service';

type AllowedRoles = User['role'][];

export const roleGuard = (allowedRoles: AllowedRoles): CanActivateFn => {
  return (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);
    const toastService = inject(ToastService);
    const currentUser = sessionService.getCurrentUser();
    if (!currentUser) {
      toastService.show(
        'error',
        'Acceso Denegado',
        'Debes iniciar sesión para acceder a esta página.'
      );
      return router.createUrlTree(['/auth/login']);
    }

    const userRole = currentUser.role;

    if (allowedRoles.includes(userRole)) {
      // El usuario tiene un rol permitido
      return true;
    } else {
      // El usuario NO tiene un rol permitido
      toastService.show(
        'warning',
        'Acceso Restringido',
        'Tu rol no te permite acceder a esta área.'
      );
      // Redirigir a una ruta por defecto o a una página de Acceso Denegado
      // En este caso, lo redirijo a la raíz, que luego redirigirá al login si no tiene acceso a nada.
      return router.createUrlTree(['/']);
      // O a una ruta de acceso denegado específica:
      // return router.createUrlTree(['/access-denied']);
    }
  };
};