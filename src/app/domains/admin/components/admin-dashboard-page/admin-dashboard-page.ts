import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardStats } from '@domains/admin/models/dashboard-stats.model';
import { AdminDashboardService } from '@domains/admin/services/admin-dashboard.service';
import { NgIcon } from '@ng-icons/core';
import { PayrollService } from '@domains/admin/services/payroll.service';
import { ToastService } from '@shared/services/toast.service';
import { LoadingButton } from '@shared/components/loading-button/loading-button';
@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [NgIcon, CommonModule, LoadingButton],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage implements OnInit {
  private dashboardService = inject(AdminDashboardService);
  private payrollService = inject(PayrollService);
  private toastService = inject(ToastService);

  public isUploadingBoletas = false;
  isLoading: boolean = true;
  hasError: boolean = false;

  public uploadBoletasModalOpen = false;
  public selectedBoletasFile: File | null = null;

  dashboardStats: AdminDashboardStats | null = null;

  ngOnInit(): void {
    this.loadStats();
  }

  public loadStats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.dashboardStats = null;

    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (err) => {
        this.hasError = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onBoletasFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedBoletasFile = input.files[0];
    }
  }

  removeSelectedBoletasFile(): void {
    this.selectedBoletasFile = null;
    const input = document.getElementById('boletasFile') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  uploadBoletasFile(): void {
    if (!this.selectedBoletasFile) {
      this.toastService.show(
        'warning',
        'Archivo requerido',
        'Debes adjuntar un archivo Excel o CSV antes de continuar.'
      );
      return;
    }

    this.isUploadingBoletas = true;

    this.payrollService.uploadPayslips(this.selectedBoletasFile).subscribe({
      next: () => {
        this.closeUploadBoletasModal();
        this.selectedBoletasFile = null;
      },
      error: () => (this.isUploadingBoletas = false),
      complete: () => (this.isUploadingBoletas = false),
    });
  }
  
  openUploadBoletasModal(): void {
    this.uploadBoletasModalOpen = true;
  }

  closeUploadBoletasModal(): void {
    this.uploadBoletasModalOpen = false;
    this.selectedBoletasFile = null;
  }
}
