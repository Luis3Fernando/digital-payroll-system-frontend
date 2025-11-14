import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyPayslipListParams, Payslip } from '@domains/admin/models/payrolls.model';
import { PayrollService } from '@domains/admin/services/payroll.service';
import { NgIcon } from '@ng-icons/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-payslip-list-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  templateUrl: './payslip-list-page.html',
  styles: ``,
})
export class PayslipListPage implements OnInit {
  selectedYear = '';
  selectedMonth = '';
  isLoadingBoleta = false;

  years: number[] = [];
  months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  boletas: Payslip[] = [];

  constructor(private payrollService: PayrollService, private toastService: ToastService) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) this.years.push(y);
  }

  ngOnInit() {
    this.buscarBoletas();
  }

  buscarBoletas() {
    this.isLoadingBoleta = true;

    const params: MyPayslipListParams = {
      year: this.selectedYear ? Number(this.selectedYear) : undefined,
      month: this.selectedMonth ? Number(this.selectedMonth) : undefined,
      page: 1,
      page_size: 20,
    };

    this.payrollService.getMyPayslips(params).subscribe({
      next: (response) => {
        this.boletas = response.payslips;
        this.isLoadingBoleta = false;
      },
      error: () => {
        this.isLoadingBoleta = false;
      },
    });
  }

  resetFiltros() {
    this.selectedYear = '';
    this.selectedMonth = '';
    this.buscarBoletas();
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
      return;
    }

    if (boleta.view_status === 'unseen') {
      this.payrollService.generatePayslip(boleta.id).subscribe({
        next: (res) => {
          boleta.view_status = res.view_status;
          boleta['pdf_url'] = res.pdf_url;
        },
        error: () => {
        },
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
        error: () => {
        },
        complete: () => {
          boleta.isLoading = false;
        },
      });
    }
  }
}
