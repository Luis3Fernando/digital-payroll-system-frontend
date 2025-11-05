import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '@domains/auth/services/auth.service';
import { RouteData, AppRole } from '@shared/utils/roles';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const routeData: RouteData = route.data as RouteData;
  const requiredRoles = routeData.roles;

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        authService.clearStorage();
        router.navigate(['/auth/login']);
        return false;
      }

      const currentUser = authService.currentUserSubject.value;
      const userRole = currentUser?.role as AppRole | string | undefined;

      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const isAuthorized = requiredRoles.includes(userRole as string);

      if (isAuthorized) {
        return true;
      } else {
        console.warn(`Acceso denegado. Rol '${userRole}' no autorizado.`);
        router.navigate(['/']);
        return false;
      }
    })
  );
};
