import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map, throwError } from 'rxjs';

import { AuthRepository } from '@auth/repositories/auth.repository';
import { LoginRequest, LogoutRequest } from '@auth/models/auth-request.model';
import { APP_ROLES } from '@shared/utils/roles';
import { ToastService } from '@shared/services/toast.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authRepository = inject(AuthRepository);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);

  public login(request: LoginRequest): Observable<boolean> {
    return this.authRepository.login(request).pipe(
      tap((apiResponse) => {
        const responseData = apiResponse.data;
        if (responseData) {
          console.log(responseData)
          this.sessionService.createSession(apiResponse.data);

          const redirectUrl =
            apiResponse.data.user.role === APP_ROLES.admin
              ? '/admin/dashboard'
              : '/payroll/dashboard';

          this.router.navigateByUrl(redirectUrl);
          this.toastService.processApiResponse(apiResponse, 'Inicio de Sesión');
        }
      }),
      map((apiResponse) => !!apiResponse.data),

      catchError((error) => {
        const apiErrorResponse = error.error;
        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error de Autenticación');
        } else {
          this.toastService.show(
            'error',
            'Error de Conexión',
            'No se pudo conectar con el servidor o el formato de error es inválido.'
          );
        }
        return of(false);
      })
    );
  }

  public loginAdminStrict(request: LoginRequest): Observable<boolean> {
    return this.authRepository.login(request).pipe(
      map((apiResponse) => {
        if (apiResponse.data) {
          const userRole = apiResponse.data.user.role;

          if (userRole === APP_ROLES.admin) {
            return apiResponse.data;
          } else {
            this.toastService.show(
              'error',
              'Acceso Restringido',
              'Esta área es solo para personal administrativo.'
            );
            throw new Error('AUTH_ROLE_VIOLATION');
          }
        }
        return null;
      }),

      tap((data) => {
        if (data) {
          this.sessionService.createSession(data);
          this.router.navigateByUrl('/admin/dashboard');
          this.toastService.show(
            'success',
            'Bienvenido Admin',
            `Acceso exitoso. Bienvenido, ${data.user.username}.`
          );
        }
      }),

      map((data) => !!data),

      catchError((error) => {
        if (error.message === 'AUTH_ROLE_VIOLATION') {
          this.sessionService.clearSession();
          return of(false);
        }

        const apiErrorResponse = error.error;
        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error de Autenticación');
        } else {
          this.toastService.show(
            'error',
            'Error Desconocido',
            'Ocurrió un error de conexión o de servidor.'
          );
        }

        this.sessionService.clearSession();
        return of(false);
      })
    );
  }

  public logout(): Observable<boolean> {
    const refreshToken = this.sessionService.getRefreshToken();

    if (!refreshToken) {
      this.sessionService.clearSession();
      this.router.navigateByUrl('/auth/login');
      return of(true);
    }

    const logoutRequest: LogoutRequest = { refresh: refreshToken };

    return this.authRepository.logout(logoutRequest).pipe(
      tap((apiResponse) => {
        this.sessionService.clearSession();
        this.router.navigateByUrl('/auth/login');
      }),
      map(() => true),
      catchError((error) => {
        this.sessionService.clearSession();
        this.router.navigateByUrl('/auth/login');
        return of(true);
      })
    );
  }

  public refreshTokens(refreshToken: string): Observable<string> {
    return this.authRepository.refresh(refreshToken).pipe(
      tap((apiResponse) => {
        const newResponseData = apiResponse.data;
        if (newResponseData) {
          this.sessionService.updateAccessToken(newResponseData.access);
          this.sessionService.updateRefreshToken(newResponseData.refresh);
          this.sessionService.notifyTokenRefreshed(true);
        }
      }),
      map((apiResponse) => apiResponse.data!.access),
      catchError((err) => {
        this.sessionService.notifyTokenRefreshed(false);
        return throwError(() => err);
      })
    );
  }
}