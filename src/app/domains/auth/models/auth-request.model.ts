export interface LoginRequest {
  dni: string;
  password: string;
}

export interface LogoutRequest {
  refresh: string;
}
