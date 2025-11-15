import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { DashboardData, SecurityAuditData } from '../models/dashboard-stats.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardRepository {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;

  private readonly STATS_URL = `${this.API_BASE_URL}/audit-logs/dashboard-stats/`;
  private readonly SECURITY_AUDIT_URL = `${this.API_BASE_URL}/audit-logs/security-audit`;

  public getDashboardStats(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(this.STATS_URL);
  }

  public getSecurityAuditData(): Observable<ApiResponse<SecurityAuditData>> {
    return this.http.get<ApiResponse<SecurityAuditData>>(this.SECURITY_AUDIT_URL);
  }
}
