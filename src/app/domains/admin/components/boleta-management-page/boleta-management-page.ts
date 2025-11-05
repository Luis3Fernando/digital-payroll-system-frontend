import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiPagination } from '@core/models/api-response.model';
import { Payslip, PayslipListParams } from '@domains/admin/models/payrolls.model';
import { PayrollService } from '@domains/admin/services/payroll.service';
import { NgIcon } from '@ng-icons/core';
import { LoadingButton } from '@shared/components/loading-button/loading-button';
import { ToastService } from '@shared/services/toast.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-boleta-management-page',
  imports: [NgIcon, CommonModule, LoadingButton, ReactiveFormsModule, FormsModule],
  templateUrl: './boleta-management-page.html',
  styles: ``,
})
export class BoletaManagementPage {
  private payrollService = inject(PayrollService);
  private toastService = inject(ToastService);
  private searchSubject = new Subject<string>();

  public isLoading = false;
  public isUploadingBoletas = false;

  public payslips: Payslip[] = [];
  public paginationMeta: ApiPagination | null = null;

  public currentPage = 1;
  public pageSize = 20;
  public currentSearchTerm = '';

  public uploadBoletasModalOpen = false;
  public selectedBoletasFile: File | null = null;

  clearPayslipsModalOpen = false;
  isClearingPayslips = false;

  constructor() {}

  ngOnInit(): void {
    this.loadPayslips();

    // Búsqueda con debounce
    this.searchSubject.pipe(debounceTime(400)).subscribe((term) => {
      this.currentSearchTerm = term;
      this.currentPage = 1;
      this.loadPayslips();
    });
  }

  /** 🔍 Evento de cambio en el campo de búsqueda */
  onSearchChange(): void {
    this.searchSubject.next(this.currentSearchTerm.trim());
  }

  /** 📄 Cargar boletas desde el backend */
  loadPayslips(): void {
    this.isLoading = true;

    const params: PayslipListParams = {
      page: this.currentPage,
      page_size: this.pageSize,
    };

    this.payrollService.listPayslips(params).subscribe({
      next: (response) => {
        this.payslips = response.payslips;
        this.paginationMeta = response.pagination;
      },
      error: () => {
        this.payslips = [];
        this.paginationMeta = null;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /** 📄 Cambiar página */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadPayslips();
  }

  /** 📤 Abrir/Cerrar modal de carga de boletas */
  openUploadBoletasModal(): void {
    this.uploadBoletasModalOpen = true;
  }

  closeUploadBoletasModal(): void {
    this.uploadBoletasModalOpen = false;
    this.selectedBoletasFile = null;
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
        this.loadPayslips(); // recargar lista al subir
      },
      error: () => (this.isUploadingBoletas = false),
      complete: () => (this.isUploadingBoletas = false),
    });
  }

  openClearPayslipsModal(): void {
    this.clearPayslipsModalOpen = true;
  }

  closeClearPayslipsModal(): void {
    this.clearPayslipsModalOpen = false;
  }

  confirmClearPayslips(): void {
    this.isClearingPayslips = true;

    this.payrollService.clearPayslips().subscribe({
      next: () => {
        this.closeClearPayslipsModal();
        this.loadPayslips();
      },
      error: () => (this.isClearingPayslips = false),
      complete: () => (this.isClearingPayslips = false),
    });
  }
}
