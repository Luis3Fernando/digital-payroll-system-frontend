import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { delay, of } from 'rxjs';

interface Boleta {
  id: number;
  periodo: string;
  regimen: string;
  entidad: string;
  montoBruto: number;
  estado: string;
  pdfUrl?: string;
  isLoading?: boolean;
}

@Component({
  selector: 'app-payslip-list-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  templateUrl: './payslip-list-page.html',
  styles: ``,
})
export class PayslipListPage {
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

  boletas: Boleta[] = [];
  allBoletas: Boleta[] = [
    {
      id: 1,
      periodo: 'Octubre 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4350.75,
      estado: 'Pendiente',
    },
    {
      id: 2,
      periodo: 'Septiembre 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4320.5,
      estado: 'Descargada',
    },
    {
      id: 3,
      periodo: 'Agosto 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4310.0,
      estado: 'Pendiente',
    },
    {
      id: 4,
      periodo: 'Julio 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4280.3,
      estado: 'Descargada',
    },
    {
      id: 5,
      periodo: 'Junio 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4265.8,
      estado: 'Pendiente',
    },
    {
      id: 6,
      periodo: 'Mayo 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4250.6,
      estado: 'Descargada',
    },
    {
      id: 7,
      periodo: 'Abril 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4240.0,
      estado: 'Descargada',
    },
    {
      id: 8,
      periodo: 'Marzo 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4220.4,
      estado: 'Descargada',
    },
    {
      id: 9,
      periodo: 'Febrero 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4200.9,
      estado: 'Pendiente',
    },
    {
      id: 10,
      periodo: 'Enero 2025',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4180.25,
      estado: 'Descargada',
    },
    {
      id: 11,
      periodo: 'Diciembre 2024',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4170.8,
      estado: 'Descargada',
    },
    {
      id: 12,
      periodo: 'Noviembre 2024',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4165.3,
      estado: 'Pendiente',
    },
    {
      id: 13,
      periodo: 'Octubre 2024',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4150.75,
      estado: 'Descargada',
    },
    {
      id: 14,
      periodo: 'Setiembre 2024',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4140.5,
      estado: 'Descargada',
    },
    {
      id: 15,
      periodo: 'Agosto 2024',
      regimen: 'Ley N° 29944',
      entidad: 'UGEL PARURO',
      montoBruto: 4130.9,
      estado: 'Pendiente',
    },
  ];

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) this.years.push(y);
    this.boletas = [...this.allBoletas];
  }

  buscarBoletas() {
    this.boletas = this.allBoletas.filter((b) => {
      const [mesNombre, anio] = b.periodo.split(' ');
      const mesNum = this.obtenerMesNumero(mesNombre);
      const coincideAnio = !this.selectedYear || anio === this.selectedYear;
      const coincideMes = !this.selectedMonth || mesNum === this.selectedMonth;
      return coincideAnio && coincideMes;
    });
  }

  resetFiltros() {
    this.selectedYear = '';
    this.selectedMonth = '';
    this.boletas = [...this.allBoletas];
  }

  accionBoleta(boleta: Boleta) {
    if (boleta.estado === 'Pendiente') {
      boleta.isLoading = true;

      of({
        pdfUrl: `https://servidor-simulacion.com/boletas/${boleta.periodo
          .toLowerCase()
          .replace(' ', '_')}.pdf`,
      })
        .pipe(delay(2000))
        .subscribe({
          next: (res) => {
            boleta.estado = 'Descargada';
            boleta.pdfUrl = res.pdfUrl;
            boleta.isLoading = false;
          },
          error: () => {
            boleta.isLoading = false;
          },
        });
    } else if (boleta.estado === 'Descargada') {
      window.open(boleta.pdfUrl, '_blank');
    }
  }

  descargarBoleta(boleta: Boleta) {
    console.log(`Descargando boleta ID: ${boleta.id}`);
  }

  private obtenerMesNumero(nombre: string): string {
    const mes = this.months.find((m) => m.label.toLowerCase() === nombre.toLowerCase());
    return mes ? mes.value : '';
  }
}
