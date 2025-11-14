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
  public pageSize = 10;
  public currentSearchTerm = '';

  public uploadBoletasModalOpen = false;
  public selectedBoletasFile: File | null = null;

  clearPayslipsModalOpen = false;
  isClearingPayslips = false;

  public deletePayslipModalOpen = false;
  public payslipToDelete: Payslip | null = null;

  public filterDni: string = '';
  public filterName: string = '';
  public filterConcept: string = '';
  public filterStatus: 'seen' | 'unseen' | 'generated' | '' = '';
  public filterMonth: number | '' = '';
  public filterYear: number | '' = '';

  public years: number[] = [];
  public months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Juio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  constructor() {
    const currentYear = new Date().getFullYear();
    const startYear = 2015;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadPayslips();
    this.searchSubject.pipe(debounceTime(400)).subscribe((term) => {
      this.currentPage = 1;
      this.loadPayslips();
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.currentSearchTerm.trim());
  }

  public loadPayslips(): void {
    this.isLoading = true;

    const params: PayslipListParams = {
      page: this.currentPage,
      page_size: this.pageSize,

      dni: this.filterDni || undefined,
      name: this.filterName || undefined,
      concept: this.filterConcept || undefined,
      status: this.filterStatus || undefined,
      month: this.filterMonth || undefined,
      year: this.filterYear || undefined,
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

  changePage(page: number): void {
    if (page < 1 || !this.paginationMeta || page > this.paginationMeta.total_pages) return;
    this.currentPage = page;
    this.loadPayslips();
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

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadPayslips();
  }

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
        this.loadPayslips();
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

  openDeletePayslipModal(boleta: Payslip): void {
    this.payslipToDelete = boleta;
    this.deletePayslipModalOpen = true;
  }

  confirmDeletePayslip(): void {
    if (!this.payslipToDelete) return;
    this.isClearingPayslips = true;

    const payslipId = this.payslipToDelete.id;

    this.payrollService.deletePayslip(payslipId).subscribe({
      next: () => {
        this.loadPayslips();
        this.deletePayslipModalOpen = false;
      },
      error: () => {},
      complete: () => {
        this.isClearingPayslips = false;
        this.payslipToDelete = null;
      },
    });
  }

  closeDeletePayslipModal(): void {
    this.deletePayslipModalOpen = false;
    this.payslipToDelete = null;
  }

  public applyFilters(): void {
    this.currentPage = 1;
    this.loadPayslips();
  }

  public resetFilters(): void {
    this.filterDni = '';
    this.filterName = '';
    this.filterConcept = '';
    this.filterStatus = '';
    this.filterMonth = '';
    this.filterYear = '';
    this.currentPage = 1;
    this.loadPayslips();
  }

  private openPdf(url: string, boletaId: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `Boleta_${boletaId}.pdf`;
    link.click();
  }

  accionBoleta(boleta: Payslip) {
    if (boleta.isLoading) return;
    boleta.isLoading = true;

    if (boleta.view_status === 'seen' && boleta.pdf_url) {
      this.openPdf(boleta.pdf_url, boleta.id);
      boleta.isLoading = false;
      console.log('Entro a la accionBoleta', boleta);

      return;
    }

    if (boleta.view_status === 'unseen') {
      this.payrollService.generatePayslip(boleta.id).subscribe({
        next: (res) => {
          boleta.view_status = res.view_status;
          boleta['pdf_url'] = res.pdf_url;
        },
        error: () => {},
        complete: () => {
          boleta.isLoading = false;
        },
      });
    } else if (boleta.view_status === 'generated') {
      this.payrollService.viewPayslip(boleta.id).subscribe({
        next: (res) => {
          boleta.view_status = res.status;
          boleta['pdf_url'] = res.pdf_url;
          if (boleta.pdf_url) {
            this.openPdf(boleta.pdf_url, boleta.id);
          }
        },
        error: () => {},
        complete: () => {
          boleta.isLoading = false;
        },
      });
    }
  }
}
