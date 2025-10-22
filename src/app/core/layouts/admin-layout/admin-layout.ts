import { Component } from '@angular/core';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NgIcon, RouterModule, CommonModule, LoadingButton],
  templateUrl: './admin-layout.html',
  styles: ``,
})
export class AdminLayout {
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
