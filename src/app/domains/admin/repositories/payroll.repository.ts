import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadUsersResponseData } from '../../admin/models/profile.model';
import { environment } from '@env/environment';
import { ApiResponse } from '@core/models/api-response.model';
import { DeletePayslipRequest, MyPayslipListParams, Payslip, PayslipListParams } from '../models/payrolls.model';
import { PayslipGenerationData, PayslipViewData } from '../models/generate-pdf.model';

@Injectable({
  providedIn: 'root',
})
export class PayrollRepository {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly PAYSLIPS_URL = `${this.API_BASE_URL}/payslips`;

  public uploadPayslipsFile(file: File): Observable<ApiResponse<UploadUsersResponseData>> {
    const url = `${this.PAYSLIPS_URL}/upload-payslips/`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ApiResponse<UploadUsersResponseData>>(url, formData);
  }

  public listPayslips(params: PayslipListParams): Observable<ApiResponse<Payslip[]>> {
    const url = `${this.PAYSLIPS_URL}/list-payslips/`;

    let httpParams = new HttpParams();

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }
    if (params.issue_date) {
      httpParams = httpParams.set('issue_date', params.issue_date);
    }

    return this.http.get<ApiResponse<Payslip[]>>(url, { params: httpParams });
  }

  public clearPayslips(): Observable<ApiResponse<any>> {
    const url = `${this.PAYSLIPS_URL}/clear-payslips/`;
    return this.http.delete<ApiResponse<any>>(url);
  }

  public getMyPayslips(params: MyPayslipListParams): Observable<ApiResponse<Payslip[]>> {
    const url = `${this.PAYSLIPS_URL}/my-payslips/`;

    let httpParams = new HttpParams();

    if (params.month) {
      httpParams = httpParams.set('month', params.month.toString());
    }
    if (params.year) {
      httpParams = httpParams.set('year', params.year.toString());
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<ApiResponse<Payslip[]>>(url, { params: httpParams });
  }

  public generatePayslip(id: string): Observable<ApiResponse<PayslipGenerationData>> {
    const url = `${this.PAYSLIPS_URL}/generate-payslip`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('id', id);
    return this.http.get<ApiResponse<PayslipGenerationData>>(url, { params: httpParams });
  }

  public viewPayslip(id: string): Observable<ApiResponse<PayslipViewData>> {
    const url = `${this.PAYSLIPS_URL}/view-payslip`;

    let httpParams = new HttpParams();
    httpParams = httpParams.set('id', id);

    return this.http.get<ApiResponse<PayslipViewData>>(url, { params: httpParams });
  }

  public deletePayslip(request: DeletePayslipRequest): Observable<ApiResponse<null>> {
    const url = `${this.PAYSLIPS_URL}/delete-payslip/`;
    return this.http.delete<ApiResponse<null>>(url, { body: request });
  }
}
