import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PayrollRepository } from '../repositories/payroll.repository';
import { ToastService } from '@shared/services/toast.service';
import { UploadUsersResponseData } from '../models/profile.model';
import { ApiPagination, ApiResponse } from '@core/models/api-response.model';
import { DeletePayslipRequest, MyPayslipListParams, Payslip, PayslipListParams } from '../models/payrolls.model';
import { PayslipGenerationData, PayslipViewData } from '../models/generate-pdf.model';

export interface PayslipListResponse {
  payslips: Payslip[];
  pagination: ApiPagination | null;
}

export interface MyPayslipListResponse {
  payslips: Payslip[];
  pagination: ApiPagination | null;
}

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private payrollRepository = inject(PayrollRepository);
  private toastService = inject(ToastService);

  public uploadPayslips(file: File): Observable<UploadUsersResponseData> {
    if (!file) {
      this.toastService.show(
        'error',
        'Error de Archivo',
        'Debe seleccionar un archivo para la carga de boletas de pago.'
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
        'Solo se permiten archivos Excel (.xlsx, .xls) para la carga de boletas.'
      );
      return throwError(() => new Error('Invalid file type'));
    }

    return this.payrollRepository.uploadPayslipsFile(file).pipe(
      map((response) => {
        if (response.messages && response.messages.length > 0) {
          this.toastService.show('success', 'Carga de Boletas Exitosa', response.messages[0]);
        }

        if (response.data?.messages && response.data.messages.length > 0) {
          response.data.messages.forEach((msg) => {
            this.toastService.show('info', 'Detalle de Proceso de Boletas', msg);
          });
        }

        return response.data;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(
            apiErrorResponse,
            'Error en Carga de Boletas de Pago'
          );
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo completar la carga de boletas. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public listPayslips(params: PayslipListParams): Observable<PayslipListResponse> {
    return this.payrollRepository.listPayslips(params).pipe(
      map((response) => {
        return {
          payslips: response.data,
          pagination: response.meta.pagination,
        };
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Cargar Boletas de Pago');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo obtener el listado de boletas. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public clearPayslips(): Observable<void> {
    return this.payrollRepository.clearPayslips().pipe(
      map((response) => {
        if (response.messages && response.messages.length > 0) {
          this.toastService.show('success', 'Limpieza Exitosa', response.messages[0]);
        } else {
          this.toastService.show(
            'success',
            'Limpieza Exitosa',
            'Todas las boletas han sido eliminadas correctamente.'
          );
        }
        return;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Eliminar Boletas');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo completar la limpieza masiva. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public getMyPayslips(params: MyPayslipListParams): Observable<MyPayslipListResponse> {
    return this.payrollRepository.getMyPayslips(params).pipe(
      map((response) => {
        return {
          payslips: response.data,
          pagination: response.meta.pagination,
        };
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Cargar Mis Boletas');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudieron obtener sus boletas. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  public generatePayslip(id: string): Observable<PayslipGenerationData> {
    return this.payrollRepository.generatePayslip(id).pipe(
      map((response) => {
        if (response.messages && response.messages.length > 0) {
          this.toastService.show('success', 'Generación Exitosa', response.messages[0]);
        } else {
          this.toastService.show(
            'success',
            'Generación Exitosa',
            'La boleta se generó correctamente.'
          );
        }
        return response.data;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Generar Boleta');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo generar la boleta. Verifique su conexión.'
          );
        }
        return throwError(() => error);
      })
    );
  }

  public viewPayslip(id: string): Observable<PayslipViewData> {
    return this.payrollRepository.viewPayslip(id).pipe(
      map((response) => {
        if (response.messages && response.messages.length > 0) {
          this.toastService.show('success', 'Visualización Exitosa', response.messages[0]);
        } else {
          this.toastService.show(
            'success',
            'Visualización Exitosa',
            'Registro de visualización actualizado.'
          );
        }
        return response.data;
      }),

      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, 'Error al Visualizar Boleta');
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo registrar la visualización. Verifique su conexión.'
          );
        }
        return throwError(() => error);
      })
    );
  }

  public deletePayslip(id: string): Observable<null> {
    if (!id) {
        this.toastService.show('error', 'Error de Parámetro', 'ID de boleta no proporcionado.');
        return throwError(() => new Error('Payslip ID is required'));
    }

    const request: DeletePayslipRequest = { id };

    return this.payrollRepository.deletePayslip(request).pipe(
      tap((apiResponse) => {
        this.toastService.processApiResponse(apiResponse, 'Eliminación Exitosa');
      }),
      map(() => null), 
      catchError((error) => {
        const apiErrorResponse = error.error as ApiResponse<any>;
        const defaultTitle = 'Error al Eliminar Boleta';

        if (apiErrorResponse && apiErrorResponse.status) {
          this.toastService.processApiResponse(apiErrorResponse, defaultTitle);
        } else {
          this.toastService.show(
            'error',
            'Fallo de Conexión',
            'No se pudo completar la eliminación. Verifique su conexión.'
          );
        }

        return throwError(() => error);
      })
    );
  }
}
