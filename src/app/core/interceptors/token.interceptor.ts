import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, catchError, switchMap, of, take, filter } from 'rxjs';

import { AuthService } from '@domains/auth/services/auth.service';
import { SessionService } from '@domains/auth/services/session.service';
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
  const sessionService = inject(SessionService);
  const router = inject(Router);

  const accessToken = sessionService.getAccessToken();
  let clonedRequest = accessToken ? addToken(req, accessToken) : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = sessionService.getRefreshToken();

          if (!refreshToken) {
            sessionService.clearSession();
            router.navigate(['/auth/login']);
            return throwError(() => error);
          }

          return authService.refreshTokens(refreshToken).pipe(
            switchMap(() => {
              isRefreshing = false;

              const newAccessToken = sessionService.getAccessToken();
              if (newAccessToken) {
                return next(addToken(req, newAccessToken));
              } else {
                sessionService.clearSession();
                router.navigate(['/auth/login']);
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              sessionService.clearSession();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          return sessionService.accessTokenRefreshed$.pipe(
            filter((refreshed) => refreshed !== true),
            take(1),
            switchMap(() => {
              const newAccessToken = sessionService.getAccessToken();
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
