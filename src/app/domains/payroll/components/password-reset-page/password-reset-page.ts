import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProfileUserService } from '@domains/payroll/services/profile-user.service';
import { LoadingButton } from '@shared/components/loading-button/loading-button';
import { finalize } from 'rxjs';

export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (group: AbstractControl): { [key: string]: any } | null => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);
    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  };
}

@Component({
  selector: 'app-password-reset',
  imports: [LoadingButton, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './password-reset-page.html',
  styles: ``,
})
export class PasswordResetPage implements OnInit {
  private fb = inject(FormBuilder);
  private profileUserService = inject(ProfileUserService);

  isLoadingChange: boolean = false;
  changePasswordForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        current_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', Validators.required],
      },
      {
        validator: MustMatch('new_password', 'confirm_password'),
      }
    );
  }

  submitChangePassword(): void {
    this.changePasswordForm.markAllAsTouched();

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.isLoadingChange = true;

    const { current_password, new_password } = this.changePasswordForm.value;
    const request = { current_password, new_password };

    this.profileUserService
      .changePassword(request)
      .pipe(finalize(() => (this.isLoadingChange = false)))
      .subscribe({
        next: () => {
          this.changePasswordForm.reset();
        },
      });
  }
}
