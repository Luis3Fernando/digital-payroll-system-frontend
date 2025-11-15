import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/auth-response.model';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private accessTokenRefreshedSubject = new BehaviorSubject<boolean>(false);
  public accessTokenRefreshed$ = this.accessTokenRefreshedSubject.asObservable();

  private readonly SESSION_KEY = 'session_data';

  constructor() {
    this.loadInitialSession();
  }

  private loadInitialSession(): void {
    if (this.isBrowser) {
      const session = this.getSessionFromStorage();
      if (session) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(session.user);
      }
    }
  }

  public createSession(response: LoginResponse): void {
    const sessionData: Session = {
      access: response.access,
      refresh: response.refresh,
      user: response.user,
    };

    this.setSessionToStorage(sessionData);

    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(sessionData.user);
  }

  public clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.SESSION_KEY);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  public updateAccessToken(newAccess: string): void {
    const session = this.getSessionFromStorage();
    if (session) {
      session.access = newAccess;
      this.setSessionToStorage(session);
    }
  }

  public updateRefreshToken(newAccess: string): void {
    const session = this.getSessionFromStorage();
    if (session) {
      session.refresh = newAccess;
      this.setSessionToStorage(session);
    }
  }

  public getAccessToken(): string | null {
    return this.getSessionFromStorage()?.access || null;
  }

  public getRefreshToken(): string | null {
    return this.getSessionFromStorage()?.refresh || null;
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setSessionToStorage(session: Session): void {
    if (this.isBrowser) {
      const sessionJson = JSON.stringify(session);
      const encodedSession = btoa(sessionJson);
      localStorage.setItem(this.SESSION_KEY, encodedSession);
    }
  }

  private getSessionFromStorage(): Session | null {
    if (!this.isBrowser) return null;
    const encodedSession = localStorage.getItem(this.SESSION_KEY);

    if (!encodedSession) return null;

    try {
      const sessionJson = atob(encodedSession);
      return JSON.parse(sessionJson) as Session;
    } catch (e) {
      console.error('Error al decodificar o parsear sesión:', e);
      this.clearSession();
      return null;
    }
  }

  private hasValidToken(): boolean {
    return !!this.getAccessToken();
  }

  private getCurrentUserFromStorage(): User | null {
    return this.getSessionFromStorage()?.user || null;
  }

  public notifyTokenRefreshed(success: boolean): void {
    this.accessTokenRefreshedSubject.next(success);
  }

  public updateUser(updatedUser: User): void {
    const session = this.getSessionFromStorage();

    if (session) {
      session.user = updatedUser;
      this.setSessionToStorage(session);
      this.currentUserSubject.next(updatedUser);
    }
  }
}
