import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '@core/models/api-response.model';
import { AdminDashboardStats } from '../models/dashboard-stats.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardRepository {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;

  private readonly STATS_URL = `${this.API_BASE_URL}/audit-logs/dashboard-stats/`;

  public getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this.http.get<ApiResponse<AdminDashboardStats>>(this.STATS_URL);
  }
}
