import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '@domains/auth/models/auth-request.model';
import { AuthService } from '@domains/auth/services/auth.service';
import { NgIcon } from '@ng-icons/core';
import { LoadingButton } from '@shared/components/loading-button/loading-button';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-login-admin-page',
  imports: [ReactiveFormsModule, FormsModule, NgIcon, LoadingButton],
  templateUrl: './login-admin-page.html',
  styles: ``,
})
export class LoginAdminPage {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  dni: string = '';
  password: string = '';

  isLoading: boolean = false;

  onSubmit() {
    if (!this.dni || !this.password) {
      this.toastService.show(
        'warning',
        'Datos Incompletos',
        'El DNI y la Contraseña son requeridos para el acceso administrativo.'
      );
      return;
    }

    this.isLoading = true;

    const request: LoginRequest = {
      dni: this.dni,
      password: this.password,
    };

    this.authService.loginAdminStrict(request).subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
