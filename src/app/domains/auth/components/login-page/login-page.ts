import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { LoginRequest } from '@domains/auth/models/auth-request.model';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  dni: string = '';
  password: string = '';

  isLoading: boolean = false;
  errorMessage: string | null = null;

  onSubmit() {
    this.errorMessage = null;

    if (!this.dni || !this.password) {
      this.errorMessage = 'El DNI y la contraseña son obligatorios.';
      return;
    }

    this.isLoading = true;

    const request: LoginRequest = {
      dni: this.dni,
      password: this.password,
    };

    this.authService.login(request).subscribe({
      next: (success) => {},
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas. Verifica tu DNI y contraseña.';
        console.error('Error de Login:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
