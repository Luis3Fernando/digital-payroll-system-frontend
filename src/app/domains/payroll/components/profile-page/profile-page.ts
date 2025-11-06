import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserProfileDetails } from '@domains/payroll/models/profile-user.model';
import { ProfileUserService } from '@domains/payroll/services/profile-user.service';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, DatePipe],
  templateUrl: './profile-page.html',
  styles: ``,
})
export class ProfilePage implements OnInit {
  private profileService = inject(ProfileUserService);

  userProfile: UserProfileDetails | null = null;
  isLoadingProfile = false;

  constructor() {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;

    this.profileService.getMe().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: () => {
        this.userProfile = null;
      },
      complete: () => {
        this.isLoadingProfile = false;
      },
    });
  }
}
