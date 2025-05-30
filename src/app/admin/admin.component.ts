import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { StockComponent } from '../shared/stock/stock.component';
import { MueblesCrudComponent } from '../shared/muebles-crud/muebles-crud.component';
import { MaterialesCrudComponent } from '../shared/materiales-crud/materiales-crud.component';
import { ProveedoresComponent } from '../shared/proveedores/proveedores.component';
import { VentasReportComponent } from '../shared/ventas-report/ventas-report.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    StockComponent,
    MueblesCrudComponent,
    MaterialesCrudComponent,
    ProveedoresComponent,
    VentasReportComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  vistaSeleccionada: string = 'stock';
  rol: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
    if (this.rol !== 'admin') {
      alert('No tienes permiso para acceder a esta página.');
      this.router.navigate(['/login']);
    }
  }
}
