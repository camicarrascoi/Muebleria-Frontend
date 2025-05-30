import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { StockComponent } from '../shared/stock/stock.component';
import { MueblesCrudComponent } from '../shared/muebles-crud/muebles-crud.component';
import { ProveedoresComponent } from '../shared/proveedores/proveedores.component';
import { VentasReportComponent } from '../shared/ventas-report/ventas-report.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    StockComponent,
    MueblesCrudComponent,
    ProveedoresComponent,
    VentasReportComponent
  ],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  rol: string | null = null;
  vistaSeleccionada: string = 'stock';

  constructor(private router: Router) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
    if (this.rol !== 'usuario') {
      alert('No tienes permiso para acceder a esta página.');
      this.router.navigate(['/login']);
    }
  }
  menuAbierto = false;
  cerrarSesion(): void {
    // Aquí puedes limpiar el localStorage o cualquier token si lo usas
    localStorage.clear();
    this.router.navigate(['/login']); // Ajusta el path según tu ruta real
  }
}
