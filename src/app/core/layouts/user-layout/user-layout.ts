import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, NgIcon, RouterModule, CommonModule, LoadingButton],
  templateUrl: './user-layout.html',
  styles: ``,
})
export class UserLayout {
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
    // Lógica de cierre de sesión aquí
  }
}
