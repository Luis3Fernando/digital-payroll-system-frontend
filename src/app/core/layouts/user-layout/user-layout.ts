import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';
import { AuthService } from '@domains/auth/services/auth.service';
import { finalize } from 'rxjs';
import { SessionService } from '@domains/auth/services/session.service';
import { User } from '@domains/auth/models/user.model';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, NgIcon, RouterModule, CommonModule, LoadingButton],
  templateUrl: './user-layout.html',
  styles: ``,
})
export class UserLayout implements OnInit {
  private authService = inject(AuthService);
  private SessionService = inject(SessionService); 

  profile!: User | null;

  sidebarOpen: boolean = true;
  confirmLogoutOpen: boolean = false;
  loadingLogout: boolean = false;
  public isSidebarOpen: boolean = false;

  ngOnInit(): void {
    this.profile = this.SessionService.getCurrentUser();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openConfirmLogout() {
    this.confirmLogoutOpen = true;
  }

  closeConfirmLogout() {
    this.confirmLogoutOpen = false;
  }

  logout() {
    this.loadingLogout = true;

    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.loadingLogout = false;
          this.closeConfirmLogout();
        })
      )
      .subscribe();
  }
}
