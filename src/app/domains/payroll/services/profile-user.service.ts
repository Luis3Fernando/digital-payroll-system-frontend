import { catchError, map, Observable, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ProfileUserRepository } from '../repositories/profile-user.repository';
import { ToastService } from '@shared/services/toast.service';
import { UserProfileDetails } from '../models/profile-user.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileUserService {
  private profileRepository = inject(ProfileUserRepository);
  private toastService = inject(ToastService);
  public getMe(): Observable<UserProfileDetails> {
    return this.profileRepository.getMe().pipe(
      map((response) => {
        return response.data;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Cargar Perfil');
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
}
