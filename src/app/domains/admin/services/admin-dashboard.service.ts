import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { AdminDashboardRepository } from '../repositories/admin-dashboard.repository';
import { AdminDashboardStats } from '../models/dashboard-stats.model';
import { ToastService } from '@shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private dashboardRepository = inject(AdminDashboardRepository);
  private toastService = inject(ToastService);

  public getDashboardStats(): Observable<AdminDashboardStats> {
    return this.dashboardRepository.getDashboardStats().pipe(
      map((response) => {
        return response.data;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error de Carga de Datos');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudieron obtener las estadísticas del dashboard.'
          );
        }
        return throwError(() => error);
      })
    );
  }
}
