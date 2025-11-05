import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { ProfileRepository } from '../repositories/profile.repository';
import { ToastService } from '@shared/services/toast.service';
import { UserListParams, UserProfile } from '../models/user-profile.model'; 
import { ApiResponse } from '@core/models/api-response.model';
import { ApiMetadata } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileRepository = inject(ProfileRepository);
  private toastService = inject(ToastService);

  public listUsers(
    params: UserListParams
  ): Observable<{ users: UserProfile[], meta: ApiMetadata | null }> {
    
    return this.profileRepository.listUsers(params).pipe(
      map((response) => {
        return { 
            users: response.data, 
            meta: response.meta 
        };
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Cargar Usuarios');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo obtener la lista de usuarios. Verifique su conexión.'
          );
        }
        
        return throwError(() => error);
      })
    );
  }
  
}