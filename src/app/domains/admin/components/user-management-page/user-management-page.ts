import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiPagination } from '@core/models/api-response.model';
import { UserListParams, UserProfile } from '@domains/admin/models/user-profile.model';
import { ProfileService } from '@domains/admin/services/profile.service';
import { NgIcon } from '@ng-icons/core';
import { SessionService } from '@domains/auth/services/session.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-user-management-page',
  imports: [NgIcon, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-management-page.html',
})
export class UserManagementPage {
  private profileService = inject(ProfileService);
  private sessionService = inject(SessionService);
  private searchSubject = new Subject<string>();

  public users: UserProfile[] = [];
  public isLoading: boolean = false;

  public currentSearchTerm: string = '';
  public currentPage: number = 1;
  public pageSize: number = 20;
  public paginationMeta: ApiPagination | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.sessionService.getAccessToken()) {
      this.loadUsers();
    }

    this.searchSubject.pipe(debounceTime(400)).subscribe((term) => {
      this.currentSearchTerm = term;
      this.loadUsers();
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.currentSearchTerm.trim());
  }

  public loadUsers(): void {
    if (!this.sessionService.getAccessToken()) {
      return;
    }

    this.isLoading = true;

    const params: UserListParams = {
      search: this.currentSearchTerm.trim() || null,
      page: this.currentPage,
      page_size: this.pageSize,
    };

    this.profileService.listUsers(params).subscribe({
      next: (response) => {
        this.users = response.users;
        console.log(this.users);
        this.paginationMeta = response.meta?.pagination || null;
      },
      error: () => {
        this.users = [];
        this.paginationMeta = null;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadUsers();
  }
}
