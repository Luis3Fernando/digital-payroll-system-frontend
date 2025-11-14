import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import {
  ChangePasswordRequest,
  UpdateEmailData,
  UpdateEmailRequest,
  UserProfileDetails,
} from '../models/profile-user.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileUserRepository {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly PROFILES_URL = `${this.API_BASE_URL}/profiles`;

  public getMe(): Observable<ApiResponse<UserProfileDetails>> {
    const url = `${this.PROFILES_URL}/me/`;
    return this.http.get<ApiResponse<UserProfileDetails>>(url);
  }

  public updateEmail(request: UpdateEmailRequest): Observable<ApiResponse<UpdateEmailData>> {
    const url = `${this.PROFILES_URL}/update-email/`;
    return this.http.patch<ApiResponse<UpdateEmailData>>(url, request);
  }

  public changePassword(request: ChangePasswordRequest): Observable<ApiResponse<null>> {
    const url = `${this.PROFILES_URL}/change-password/`;
    return this.http.post<ApiResponse<null>>(url, request);
  }
}
