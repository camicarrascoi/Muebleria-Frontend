import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialesService } from '../dashboard/services/materiales.service';
import { MueblesService } from './services/muebles.service';
import { ProveedoresService } from '../dashboard/services/proveedores.service';
import { VentaService } from '../dashboard/services/venta.service';
import { AuthService } from '../dashboard/services/auth.service';
import { PedidosService } from './services/pedido.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Venta } from '../models/venta.model';  
import { ReporteService } from '../dashboard/services/reportes.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mostrarResumen: boolean = true;
  cantidadMuebles: number = 0;
  cantidadMateriales: number = 0;
  cantidadProveedores: number = 0;
  cantidadPedidos: number = 0;  // <-- Nueva variable para contar pedidos
  cantidadVentas: number = 0;
  esAdmin: boolean = false;
  esUsuario: boolean = false;

  ventas: Venta[] = [];  // <-- Declaras variable para guardar las ventas

  constructor(
    private materialesService: MaterialesService,
    private mueblesService: MueblesService,
    private proveedoresService: ProveedoresService,
    private pedidoService: PedidosService,
    private ventaService: VentaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public auth: AuthService,
    private reporteService: ReporteService  
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges(); // Fuerza que Angular se entere del cambio antes de seguir

    this.cargarResumen();
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'ADMIN';
    this.esUsuario = rol === 'USUARIO';
  }

  cargarResumen() {
    this.mueblesService.obtenerMuebles().subscribe({
      next: muebles => this.cantidadMuebles = muebles.length,
      error: err => console.error('Error al obtener muebles', err)
    });

    this.materialesService.obtenerMateriales().subscribe({
      next: materiales => this.cantidadMateriales = materiales.length,
      error: err => console.error('Error al obtener materiales', err)
    });

    this.proveedoresService.obtenerProveedores().subscribe({
      next: proveedores => this.cantidadProveedores = proveedores.length,
      error: err => console.error('Error al obtener proveedores', err)
    });
    
    this.pedidoService.obtenerPedidos().subscribe({
      next: pedidos => this.cantidadPedidos = pedidos.length,
      error: err => console.error('Error al obtener pedidos', err)
    });

    this.ventaService.obtenerVentas().subscribe({
      next: ventas => {
        this.cantidadVentas = ventas.length;
        this.ventas = ventas;  // <-- Guarda las ventas para exportar
      },
      error: err => console.error('Error al obtener ventas', err)
    });
  }

  exportarVentasExcel() {   // nombre plural recomendado
    // Preparar datos para Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ventas.map(v => ({
      ID: v.id,
      Fecha: v.fecha,
      Total: v.total,
      MueblesVendidos: v.ventaMuebles.map(m => `${m.nombreMueble} (x${m.cantidad})`).join(', ')
    })));

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    // Generar archivo Excel y descargar
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'ventas.xlsx');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
