import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiPagination } from '@core/models/api-response.model';
import { UserListParams, UserProfile } from '@domains/admin/models/user-profile.model';
import { ProfileService } from '@domains/admin/services/profile.service';
import { NgIcon } from '@ng-icons/core';
import { SessionService } from '@domains/auth/services/session.service';
import { Subject, debounceTime } from 'rxjs';
import { LoadingButton } from '@shared/components/loading-button/loading-button';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-user-management-page',
  imports: [NgIcon, FormsModule, ReactiveFormsModule, CommonModule, LoadingButton],
  templateUrl: './user-management-page.html',
})
export class UserManagementPage {
  private profileService = inject(ProfileService);
  private sessionService = inject(SessionService);
  private searchSubject = new Subject<string>();
  private toastService = inject(ToastService);

  public users: UserProfile[] = [];
  public isLoading: boolean = false;

  public selectedUsersFile: File | null = null;
  public uploadUsersModalOpen = false;
  public isUploadingUsers = false;

  public selectedWorkDetailsFile: File | null = null;
  public uploadUsersWorksModalOpen = false;
  public isUploadingWorkDetails = false;

  public currentSearchTerm: string = '';
  public currentPage: number = 1;
  public pageSize: number = 10;
  public paginationMeta: ApiPagination | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.sessionService.getAccessToken()) {
      this.loadUsers();
    }

    this.searchSubject.pipe(debounceTime(400)).subscribe((term) => {
      this.currentSearchTerm = term;
      this.currentPage = 1;
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

  onUsersFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedUsersFile = input.files[0];
    }
  }

  uploadUsersFile(): void {
    if (!this.selectedUsersFile) {
      this.toastService.show(
        'warning',
        'Archivo Requerido',
        'Debes adjuntar un archivo Excel o CSV antes de continuar.'
      );
      return;
    }
    this.isUploadingUsers = true;

    this.profileService.uploadUsers(this.selectedUsersFile).subscribe({
      next: () => {
        this.loadUsers();
        this.closeUploadUsersModal();
        this.selectedUsersFile = null;
        this.loadUsers();
      },
      error: () => (this.isUploadingUsers = false),
      complete: () => (this.isUploadingUsers = false),
    });
  }

  onWorkDetailsFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedWorkDetailsFile = input.files[0];
    }
  }

  uploadWorkDetailsFile(): void {
    if (!this.selectedWorkDetailsFile) {
      this.toastService.show(
        'warning',
        'Archivo Requerido',
        'Debes adjuntar un archivo Excel o CSV antes de continuar.'
      );
      return;
    }
    this.isUploadingWorkDetails = true;

    this.profileService.uploadWorkDetails(this.selectedWorkDetailsFile).subscribe({
      next: () => {
        this.loadUsers();
        this.closeUploadUsersWorksModal();
        this.selectedWorkDetailsFile = null;
      },
      error: () => (this.isUploadingWorkDetails = false),
      complete: () => (this.isUploadingWorkDetails = false),
    });
  }

  removeSelectedUsersFile(): void {
    this.selectedUsersFile = null;
  }

  removeSelectedWorkDetailsFile(): void {
    this.selectedWorkDetailsFile = null;
    const input = document.getElementById('workDetailsFile') as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadUsers();
  }

  openUploadUsersModal(): void {
    this.uploadUsersModalOpen = true;
  }

  closeUploadUsersModal(): void {
    this.uploadUsersModalOpen = false;
  }

  openUploadUsersWorksModal(): void {
    this.uploadUsersWorksModalOpen = true;
  }

  closeUploadUsersWorksModal(): void {
    this.uploadUsersWorksModalOpen = false;
  }

  changePage(page: number): void {
    if (!this.paginationMeta || page < 1 || page > this.paginationMeta.total_pages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  get pageRange(): (number | string)[] {
    if (!this.paginationMeta) return [];

    const totalPages = this.paginationMeta.total_pages;
    const currentPage = this.paginationMeta.current_page;
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage < 4) {
      startPage = 2;
      endPage = maxPagesToShow - 1;
    } else if (currentPage > totalPages - 3) {
      startPage = totalPages - maxPagesToShow + 2;
      endPage = totalPages - 1;
    }

    const pages: (number | string)[] = [1];

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
}
