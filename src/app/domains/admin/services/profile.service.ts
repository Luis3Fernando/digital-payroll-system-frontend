import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { ProfileRepository } from '../repositories/profile.repository';
import { ToastService } from '@shared/services/toast.service';
import { UserListParams, UserProfile } from '../models/user-profile.model';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiMetadata } from '@core/models/api-response.model';
import { UploadUsersResponseData } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileRepository = inject(ProfileRepository);
  private toastService = inject(ToastService);

  public listUsers(
    params: UserListParams
  ): Observable<{ users: UserProfile[]; meta: ApiMetadata | null }> {
    return this.profileRepository.listUsers(params).pipe(
      map((response) => {
        return {
          users: response.data,
          meta: response.meta,
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

  public uploadUsers(file: File): Observable<UploadUsersResponseData> {
    if (!file) {
      this.toastService.show(
        'error',
        'Error de Archivo',
        'Debe seleccionar un archivo para la carga.'
      );
      return throwError(() => new Error('No file selected'));
    }

    const fileName = file.name.toLowerCase();
    const validExtensions = ['.xlsx', '.xls', '.csv'];

    const isValidFile = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidFile) {
      this.toastService.show(
        'warning',
        'Archivo Inválido',
        'Solo se permiten archivos Excel (.xlsx, .xls) o CSV (.csv).'
      );
      return throwError(() => new Error('Invalid file type'));
    }

    return this.profileRepository.uploadUsersFile(file).pipe(
      map((response) => {
        if (response.messages && response.messages.length > 0) {
          this.toastService.show('success', 'Carga Exitosa', response.messages[0]);
        }
        if (response.data?.messages && response.data.messages.length > 0) {
          response.data.messages.forEach((msg) => {
            this.toastService.show('info', 'Detalle de Proceso', msg);
          });
        }
        return response.data;
      }),
      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error de Carga');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo completar la carga masiva. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public uploadWorkDetails(file: File): Observable<UploadUsersResponseData> {
    if (!file) {
      this.toastService.show(
        'error',
        'Error de Archivo',
        'Debe seleccionar un archivo para la carga de detalles laborales.'
      );
      return throwError(() => new Error('No file selected'));
    }

    const fileName = file.name.toLowerCase();
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const isValidFile = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidFile) {
      this.toastService.show(
        'warning',
        'Archivo Inválido',
        'Solo se permiten archivos Excel (.xlsx, .xls) o CSV (.csv) para la carga de detalles laborales.'
      );
      return throwError(() => new Error('Invalid file type'));
    }
    return this.profileRepository.uploadWorkDetailsFile(file).pipe(
      map((response) => {
        if (response.messages && response.messages.length > 0) {
          this.toastService.show(
            'success',
            'Carga de Detalles Laborales Exitosa',
            response.messages[0]
          );
        }
        if (response.data?.messages && response.data.messages.length > 0) {
          response.data.messages.forEach((msg) => {
            this.toastService.show('info', 'Detalle de Proceso Laboral', msg);
          });
        }
        return response.data;
      }),
      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          -this.toastService.processApiResponse(
            apiErrorResponse,
            'Error en Carga de Detalles Laborales'
          );
        } else {
          -this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo completar la carga de detalles laborales. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }
}
