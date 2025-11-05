import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { ApiResponse } from '@core/models/api-response.model';
import { UserListParams, UserProfile } from '../models/user-profile.model';
import { UploadUsersResponseData } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileRepository {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly PROFILES_URL = `${this.API_BASE_URL}/profiles`;

  public listUsers(params: UserListParams): Observable<ApiResponse<UserProfile[]>> {
    const url = `${this.PROFILES_URL}/list-users`;

    let httpParams = new HttpParams();
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<ApiResponse<UserProfile[]>>(url, { params: httpParams });
  }

  public uploadUsersFile(file: File): Observable<ApiResponse<UploadUsersResponseData>> {
    const url = `${this.PROFILES_URL}/upload-users/`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ApiResponse<UploadUsersResponseData>>(url, formData);
  }

  public uploadWorkDetailsFile(file: File): Observable<ApiResponse<UploadUsersResponseData>> {
    const url = `${this.PROFILES_URL}/upload-work-details/`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ApiResponse<UploadUsersResponseData>>(url, formData);
  }
}
