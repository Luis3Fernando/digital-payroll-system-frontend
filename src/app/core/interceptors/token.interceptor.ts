import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, catchError, switchMap, finalize, of, take, filter } from 'rxjs';

import { AuthService } from '@domains/auth/services/auth.service';
import { Router } from '@angular/router';

let isRefreshing = false;

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  let clonedRequest = accessToken ? addToken(req, accessToken) : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = authService.getRefreshToken();

          if (!refreshToken) {
            authService.clearStorage();
            router.navigate(['/auth/login']);
            return throwError(() => error);
          }

          return authService.refreshTokens(refreshToken).pipe(
            switchMap(() => {
              isRefreshing = false;

              const newAccessToken = authService.getAccessToken();
              if (newAccessToken) {
                return next(addToken(req, newAccessToken));
              } else {
                authService.clearStorage();
                router.navigate(['/auth/login']);
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              authService.clearStorage();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          return authService.accessTokenRefreshed$.pipe(
            filter((refreshed) => refreshed !== false),
            take(1),
            switchMap(() => {
              const newAccessToken = authService.getAccessToken();
              return newAccessToken
                ? next(addToken(req, newAccessToken))
                : throwError(() => new Error('Refresh fallido, token no disponible'));
            }),
            catchError((err) => {
              return throwError(() => err);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
