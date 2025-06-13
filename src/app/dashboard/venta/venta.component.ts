import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentaService } from '../services/venta.service';
import { Venta, VentaMueble } from '../../models/venta.model';
import { AuthService } from '../services/auth.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgIf, NgForOf, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  ventas: Venta[] = [];
  ventaSeleccionada: Venta | null = null;
  ventaMueblesSeleccionados: string = '';
  mostrarFormulario = false;
  esAdmin = true;

  constructor(private ventaService: VentaService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventaService.obtenerVentas().subscribe({
      next: (data) => {
        this.ventas = data;
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
      }
    });
  }

  abrirFormularioNuevo() {
    this.ventaSeleccionada = {
      id: null,
      fecha: new Date(),
      total: 0,
      ventaMuebles: []
    };
    this.ventaMueblesSeleccionados = '';
    this.mostrarFormulario = true;
  }

  editarVenta(venta: Venta) {
    this.ventaSeleccionada = {
      id: venta.id,
      fecha: venta.fecha,
      total: venta.total,
      ventaMuebles: [...venta.ventaMuebles]
    };
    this.ventaMueblesSeleccionados = venta.ventaMuebles.map(vm => vm.muebleId).join(',');
    this.mostrarFormulario = true;
  }

  eliminarVenta(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta venta?')) {
      this.ventaService.eliminarVenta(id).subscribe({
        next: () => this.cargarVentas(),
        error: err => console.error('Error al eliminar:', err)
      });
    }
  }

  cancelarFormulario() {
    this.ventaSeleccionada = null;
    this.mostrarFormulario = false;
  }

  guardarVenta() {
  if (!this.ventaSeleccionada) return;

  const ids = this.ventaMueblesSeleccionados
    .split(',')
    .map(id => Number(id.trim()))
    .filter(id => !isNaN(id));

  const muebles: VentaMueble[] = ids.map(id => ({
    id: 0,          // id temporal para nuevos muebles en venta
    muebleId: id,
    nombre: '',     // vacío, o podrías buscar el nombre si tienes acceso al catálogo
    cantidad: 1
  }));

  this.ventaSeleccionada.ventaMuebles = muebles;

  const esNueva = !this.ventaSeleccionada.id;

  const peticion = esNueva
    ? this.ventaService.crearVenta(this.ventaSeleccionada)
    : this.ventaService.editarVenta(this.ventaSeleccionada);

  peticion.subscribe({
    next: () => {
      this.cargarVentas();
      this.cancelarFormulario();
    },
    error: err => console.error('Error al guardar venta:', err)
  });
}

  exportarVentasExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.ventas.map(v => ({
        Fecha: v.fecha,
        Total: v.total,
        MueblesVendidos: v.ventaMuebles.map(m => `${m.nombre} (x${m.cantidad})`).join(', ')
      }))
    );

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'ventas.xlsx');
  }
}
