import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyPayslipListParams, Payslip } from '@domains/admin/models/payrolls.model';
import { PayrollService } from '@domains/admin/services/payroll.service';
import { NgIcon } from '@ng-icons/core';
import { ToastService } from '@shared/services/toast.service';
import { delay, of } from 'rxjs';

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

  private obtenerMesNumero(nombre: string): string {
    const mes = this.months.find((m) => m.label.toLowerCase() === nombre.toLowerCase());
    return mes ? mes.value : '';
  }

  accionBoleta(boleta: Payslip) {
    if (boleta.isLoading) return; // prevenir clicks múltiples
    boleta.isLoading = true;

    // Simulamos un proceso asíncrono (generar/ver boleta)
    setTimeout(() => {
      if (boleta.view_status === 'unseen') {
        boleta.view_status = 'generated'; // Boleta generada
      } else if (boleta.view_status === 'generated') {
        boleta.view_status = 'seen'; // Boleta vista
      }
      boleta.isLoading = false; // Fin del proceso
    }, 1500); // simulamos 1.5 segundos de carga
  }
}
