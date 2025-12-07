import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '@domains/auth/services/session.service';
import { UserProfileDetails } from '@domains/payroll/models/profile-user.model';
import { ProfileUserService } from '@domains/payroll/services/profile-user.service';
import { NgIcon } from '@ng-icons/core';
import { LoadingButton } from '@shared/components/loading-button/loading-button';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, DatePipe, NgIcon, LoadingButton, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styles: ``,
})
export class ProfilePage implements OnInit {
  private profileService = inject(ProfileUserService);
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService); 

  modalUpdateEmailVisible: boolean = false;
  loadingUpdateEmail: boolean = false;
  userProfile: UserProfileDetails | null = null;
  isLoadingProfile: boolean = false;
  updateEmailForm!: FormGroup;

  constructor() {} 

  ngOnInit(): void {
    this.initForm(); 
    this.loadProfile();
  }
  
  initForm(): void {
    const currentEmail = this.sessionService.getCurrentUser()?.email || '';

    this.updateEmailForm = this.fb.group({
      email: [
        currentEmail,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) 
        ]
      ],
    });
  }

  openUpdateEmailModal(): void {
    const currentEmail = this.sessionService.getCurrentUser()?.email || '';
    this.updateEmailForm.reset({ email: currentEmail });
    this.modalUpdateEmailVisible = true;
  }

  closeUpdateEmailModal(): void {
    this.modalUpdateEmailVisible = false;
  }

  submitUpdateEmail(): void {
    this.updateEmailForm.markAllAsTouched();
    if (this.updateEmailForm.invalid) {
      return;
    }
    
    this.loadingUpdateEmail = true;
    const request = { email: this.updateEmailForm.value.email };
    this.profileService.updateEmail(request).subscribe({
      next: (response) => {
        if (this.userProfile) {
            this.userProfile.email = response.email; 
        }

        this.closeUpdateEmailModal();
      },
      error: (err) => {
        this.loadingUpdateEmail = false;
      },
      complete: () => {
        this.loadingUpdateEmail = false;
      }
    });
  }

  loadProfile(): void {
    this.isLoadingProfile = true;

    this.profileService.getMe().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: () => {
        this.userProfile = null;
        this.isLoadingProfile = false;
      },
      complete: () => {
        this.isLoadingProfile = false;
      },
    });
  }
}