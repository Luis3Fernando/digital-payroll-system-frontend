import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map, throwError } from 'rxjs';

import { AuthRepository } from '@auth/repositories/auth.repository';
import { LoginRequest, LogoutRequest } from '@auth/models/auth-request.model';
import { LoginResponse } from '@auth/models/auth-response.model';
import { User } from '@auth/models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { APP_ROLES } from '@shared/utils/roles';
import { ToastService } from '@shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authRepository = inject(AuthRepository);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private toastService = inject(ToastService);

  private isBrowser = isPlatformBrowser(this.platformId);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accessTokenRefreshedSubject = new BehaviorSubject<boolean>(false);
  public accessTokenRefreshed$ = this.accessTokenRefreshedSubject.asObservable();

  public currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private setTokens(response: LoginResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
  }

  private hasValidToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private getCurrentUserFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  public notifyTokenRefreshed(success: boolean): void {
    this.accessTokenRefreshedSubject.next(success);
  }

  public login(request: LoginRequest): Observable<boolean> {
    return this.authRepository.login(request).pipe(
      tap((apiResponse) => {
        const responseData = apiResponse.data;
        if (responseData) {
          this.setTokens(apiResponse.data);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(apiResponse.data.user);
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
            this.setTokens(apiResponse.data);
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(apiResponse.data.user);
            this.router.navigateByUrl('/admin/dashboard');
            return true;
          } else {
            throw new Error('Solo el personal administrativo puede acceder a este formulario.');
          }
        }
        return false;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  public logout(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearStorage();
      this.router.navigateByUrl('/auth/login');
      this.toastService.show('success', 'Sesión Cerrada', 'Has cerrado tu sesión localmente.');
      return of(true);
    }

    const logoutRequest: LogoutRequest = { refresh: refreshToken };
    return this.authRepository.logout(logoutRequest).pipe(
      tap((apiResponse) => {
        this.toastService.processApiResponse(apiResponse, 'Cierre de Sesión');

        this.clearStorage();
        this.router.navigateByUrl('/auth/login');
      }),
      map(() => true),
      catchError((error) => {
        this.toastService.show(
          'warning',
          'Conexión Fallida',
          'Error al notificar al servidor. Sesión cerrada localmente.'
        );
        this.clearStorage();
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
          localStorage.setItem(this.ACCESS_TOKEN_KEY, newResponseData.access);
          this.notifyTokenRefreshed(true);
        }
      }),
      map((apiResponse) => apiResponse.data!.access),
      catchError((err) => {
        this.notifyTokenRefreshed(false);
        return throwError(() => err);
      })
    );
  }

  public clearStorage(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  public getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}
