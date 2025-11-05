import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '@auth/services/auth.service';
import { LoginRequest } from '@domains/auth/models/auth-request.model';
import { LoadingButton } from '@shared/components/loading-button/loading-button';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon, LoadingButton],
  templateUrl: './login-page.html',
})
export class LoginPage {
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
        'Por favor, ingrese su DNI y Contraseña para iniciar sesión.'
      );
      return;
    }

    this.isLoading = true;

    const request: LoginRequest = {
      dni: this.dni,
      password: this.password,
    };

    this.authService.login(request).subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
