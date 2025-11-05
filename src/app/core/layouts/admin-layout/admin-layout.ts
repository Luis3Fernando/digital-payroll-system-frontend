import { Component, inject } from '@angular/core';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '@domains/auth/services/auth.service';
import { ToastService } from '@shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NgIcon, RouterModule, CommonModule, LoadingButton],
  templateUrl: './admin-layout.html',
  styles: ``,
})
export class AdminLayout {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  sidebarOpen: boolean = true;
  confirmLogoutOpen: boolean = false;
  loadingLogout: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
