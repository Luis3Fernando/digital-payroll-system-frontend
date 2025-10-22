import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  templateUrl: './login-page.html',
})
export class LoginPage {
  dni: string = '';
  password: string = '';

  onSubmit() {
    if (!this.dni || !this.password) {
      alert('Por favor, ingrese DNI y contraseña.');
      return;
    }
    console.log('DNI:', this.dni);
    console.log('Contraseña:', this.password);
    alert(`Intentando iniciar sesión con DNI: ${this.dni}`);
  }
}
