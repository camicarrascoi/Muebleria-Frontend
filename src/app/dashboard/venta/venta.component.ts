import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentaService } from '../services/venta.service';
import { Venta, VentaMueble } from '../../models/venta.model';
import { AuthService } from '../services/auth.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface VentaMueblePayload {
  muebles: { id: number };
  cantidad: number;
}
interface VentaPayload {
  id?: number | null;
  fecha: Date;
  ventaMuebles: VentaMueblePayload[];
}

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
  ventaMueblesSeleccionados = '';  // formato "1:2,3:1,5:4" o solo "1,2,3" si siempre cantidad=1
  mostrarFormulario = false;
  esAdmin = true;

  constructor(
    private ventaService: VentaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarVentas();
  }

  private cargarVentas() {
    this.ventaService.obtenerVentas().subscribe({
      next: data => this.ventas = data,
      error: err => console.error('Error al cargar ventas:', err)
    });
  }

  abrirFormularioNuevo() {
    this.ventaSeleccionada = { id: null, fecha: new Date(), total: 0, ventaMuebles: [] };
    this.ventaMueblesSeleccionados = '';
    this.mostrarFormulario = true;
  }

  editarVenta(venta: Venta) {
    this.ventaSeleccionada = { ...venta, ventaMuebles: [...venta.ventaMuebles] };
    // Reconstruir string "id:cantidad,..." para el input
    this.ventaMueblesSeleccionados = venta.ventaMuebles
      .map(vm => `${vm.muebleId}:${vm.cantidad}`)
      .join(',');
    this.mostrarFormulario = true;
  }

  eliminarVenta(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta venta?')) return;
    this.ventaService.eliminarVenta(id).subscribe({
      next: () => this.cargarVentas(),
      error: err => console.error('Error al eliminar:', err)
    });
  }

  cancelarFormulario() {
    this.ventaSeleccionada = null;
    this.mostrarFormulario = false;
  }

  guardarVenta() {
    if (!this.ventaSeleccionada) return;

    // Parseo de "1:2,3:1,5:4" → [{muebles:{id:1},cantidad:2},...]
    const payloadItems: VentaMueblePayload[] = this.ventaMueblesSeleccionados
      .split(',')
      .map(seg => seg.trim())
      .filter(seg => seg)
      .map(seg => {
        const [idStr, qtyStr] = seg.split(':').map(x => x.trim());
        const id = Number(idStr);
        const cantidad = qtyStr != null ? Number(qtyStr) : 1;
        if (isNaN(id) || isNaN(cantidad)) {
          throw new Error('Formato inválido en muebles vendidos.');
        }
        return { muebles: { id }, cantidad };
      });

    const ventaParaEnviar: VentaPayload = {
      id: this.ventaSeleccionada.id,
      fecha: this.ventaSeleccionada.fecha,
      ventaMuebles: payloadItems
    };

    const peticion = (!ventaParaEnviar.id)
      ? this.ventaService.crearVenta(ventaParaEnviar)
      : this.ventaService.editarVenta(ventaParaEnviar);

    peticion.subscribe({
      next: () => {
        this.cargarVentas();
        this.cancelarFormulario();
      },
      error: err => console.error('Error al guardar venta:', err)
    });
  }

  exportarVentasExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.ventas.map(v => ({
        Fecha: v.fecha,
        Total: v.total,
        MueblesVendidos: v.ventaMuebles
          .map(m => `${m.nombre} (x${m.cantidad})`)
          .join(', ')
      }))
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'ventas.xlsx');
  }
}
