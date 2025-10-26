import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-user-management-page',
  imports: [NgIcon, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-management-page.html',
})
export class UserManagementPage {
  users = [
    {
      nombre: 'María',
      apellidos: 'López García',
      tipoDocumento: 'DNI',
      dni: '74219853',
      cargo: 'Administradora',
      fechaIngreso: '2023-08-12',
      estado: 'Activo',
    },
    {
      nombre: 'Luis',
      apellidos: 'Torres Paredes',
      tipoDocumento: 'CE',
      dni: 'X983423',
      cargo: 'Supervisor',
      fechaIngreso: '2024-01-10',
      estado: 'Inactivo',
    },
    {
      nombre: 'Ana',
      apellidos: 'Ramos Díaz',
      tipoDocumento: 'DNI',
      dni: '76041235',
      cargo: 'Analista',
      fechaIngreso: '2024-05-03',
      estado: 'Activo',
    },
  ];
}
