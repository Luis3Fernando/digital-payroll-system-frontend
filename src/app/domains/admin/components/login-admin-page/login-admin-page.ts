import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-login-admin-page',
  imports: [ReactiveFormsModule, FormsModule, NgIcon],
  templateUrl: './login-admin-page.html',
  styles: ``,
})
export class LoginAdminPage {
  private router = inject(Router);

  user: string = '';
  password: string = '';

  onSubmit() {
    if (!this.user || !this.password) {
      alert('Por favor, ingrese User y contraseña.');
      return;
    }

    this.router.navigate(['/admin']);
  }
}
