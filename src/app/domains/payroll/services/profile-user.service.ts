import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ProfileUserRepository } from '../repositories/profile-user.repository';
import { ToastService } from '@shared/services/toast.service';
import { ChangePasswordRequest, UpdateEmailData, UpdateEmailRequest, UserProfileDetails } from '../models/profile-user.model';
import { ApiResponse } from '@core/models/api-response.model';
import { SessionService } from '@domains/auth/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileUserService {
  private profileRepository = inject(ProfileUserRepository);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);

  public getMe(): Observable<UserProfileDetails> {
    return this.profileRepository.getMe().pipe(
      map((response) => {
        return response.data;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al cargar perfil');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo obtener su información de perfil. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public updateEmail(request: UpdateEmailRequest): Observable<UpdateEmailData> {
    return this.profileRepository.updateEmail(request).pipe(
      tap((apiResponse) => {
        this.toastService.processApiResponse(apiResponse, 'Actualización exitosa');
        const newEmail = apiResponse.data.email;
        const currentUser = this.sessionService.getCurrentUser();

        if (currentUser) {
          const updatedUser = { ...currentUser, email: newEmail };
          this.sessionService.updateUser(updatedUser);
        }
      }),
      map((response) => response.data),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al actualizar correo');
        } else {
          this.toastService.show(
            'error',
            'Fallo en la Actualización',
            'Ocurrió un error inesperado. Intente nuevamente.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public changePassword(request: ChangePasswordRequest): Observable<null> {
    return this.profileRepository.changePassword(request).pipe(
      tap((apiResponse) => {
        this.toastService.processApiResponse(apiResponse, 'Contraseña actualizada');
      }),
      
      map(() => null), 
      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;
        const defaultTitle = 'Error al cambiar contraseña';

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, defaultTitle);
        } else {
          this.toastService.show(
            'error',
            defaultTitle,
            'No se pudo conectar con el servidor o la respuesta no fue válida.'
          );
        }
        return throwError(() => error);
      })
    );
  }
}
