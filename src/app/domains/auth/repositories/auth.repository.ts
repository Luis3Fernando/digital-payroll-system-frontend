import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, LogoutRequest } from '../models/auth-request.model';
import { ApiResponse } from '@core/models/api-response.model';
import { LoginResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly AUTH_URL = `${this.API_BASE_URL}/auth`;

  public login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const url = `${this.AUTH_URL}/login/`;
    return this.http.post<ApiResponse<LoginResponse>>(url, credentials);
  }

  public logout(logoutRequest: LogoutRequest): Observable<ApiResponse<null>> {
    const url = `${this.AUTH_URL}/logout/`;
    return this.http.post<ApiResponse<null>>(url, logoutRequest);
  }

  public refresh(refreshToken: string): Observable<ApiResponse<LoginResponse>> {
    const url = `${this.AUTH_URL}/refresh/`;
    const body = { refresh: refreshToken };
    return this.http.post<ApiResponse<LoginResponse>>(url, body);
  }
}
