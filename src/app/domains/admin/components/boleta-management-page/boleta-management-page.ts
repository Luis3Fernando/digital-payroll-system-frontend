import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-boleta-management-page',
  imports: [NgIcon, CommonModule],
  templateUrl: './boleta-management-page.html',
  styles: ``,
})
export class BoletaManagementPage {
  boletas = [
    {
      usuario: 'Luis Ramos',
      entidad: 'UGEL Paruro',
      concepto: 'Pago de haberes - Septiembre',
      estado: 'Aprobada',
    },
    {
      usuario: 'María Torres',
      entidad: 'UGEL Cusco',
      concepto: 'Pago de haberes - Octubre',
      estado: 'Generada',
    },
    {
      usuario: 'Juan Pérez',
      entidad: 'UGEL Quillabamba',
      concepto: 'Asignación familiar',
      estado: 'Pendiente',
    },
    {
      usuario: 'Ana López',
      entidad: 'UGEL Paruro',
      concepto: 'Pago de haberes - Agosto',
      estado: 'Aprobada',
    },
  ];
}
