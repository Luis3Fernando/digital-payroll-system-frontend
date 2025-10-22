import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private router = inject(Router);

  dni: string = '';
  password: string = '';

  onSubmit() {
    if (!this.dni || !this.password) {
      alert('Por favor, ingrese DNI y contraseña.');
      return;
    }

    this.router.navigate(['/payroll']);
  }
}
