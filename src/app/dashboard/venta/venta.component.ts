import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../services/venta.service';
import { MueblesService } from '../services/muebles.service';
import { Venta, VentaMueble, VentaPayload, VentaMueblePayload } from '../../models/venta.model';
import { Mueble } from '../../models/mueble.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  mueblesDisponibles: Mueble[] = [];
  ventaSeleccionada: Venta | null = null;

  // Para el formulario
  muebleSeleccionadoId: number | null = null;
  cantidadSeleccionada = 1;

  mostrarFormulario = false;
  esAdmin = false;

  constructor(
    private ventaService: VentaService,
    private mueblesService: MueblesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarVentas();
    this.cargarMuebles();
  }

  private cargarVentas() {
    this.ventaService.obtenerVentas().subscribe({
      next: data => this.ventas = data,
      error: err => console.error('Error al cargar ventas:', err)
    });
  }

  private cargarMuebles() {
    this.mueblesService.obtenerMuebles().subscribe({
      next: list => this.mueblesDisponibles = list,
      error: err => console.error('Error al cargar muebles:', err)
    });
  }

  abrirFormularioNuevo() {
    this.ventaSeleccionada = {
      id: null,
      fecha: new Date(),
      total: 0,
      ventaMuebles: []
    };
    this.muebleSeleccionadoId = null;
    this.cantidadSeleccionada = 1;
    this.mostrarFormulario = true;
  }

  editarVenta(v: Venta) {
    this.ventaSeleccionada = { ...v, fecha: new Date(v.fecha), ventaMuebles: [...v.ventaMuebles] };

    if (v.ventaMuebles.length > 0) {
      const nombre = v.ventaMuebles[0].nombreMueble;
      const muebleEncontrado = this.mueblesDisponibles.find(m => m.nombre === nombre);
      this.muebleSeleccionadoId = this.ventaSeleccionada.ventaMuebles[0].id ?? null;
      this.cantidadSeleccionada = v.ventaMuebles[0].cantidad;
    } else {
      this.muebleSeleccionadoId = null;
      this.cantidadSeleccionada = 1;
    }

    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.ventaSeleccionada = null;
    this.mostrarFormulario = false;
  }

  onFechaChange(value: string) {
    if (!this.ventaSeleccionada) return;
    this.ventaSeleccionada.fecha = value ? new Date(value) : new Date();
  }

  guardarVenta() {
    if (!this.ventaSeleccionada) return;
    if (this.muebleSeleccionadoId == null) {
      alert('Debes seleccionar un mueble');
      return;
    }
    if (this.cantidadSeleccionada < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    try {
      const payloadItems: VentaMueblePayload[] = [{
        mueble: { id: this.muebleSeleccionadoId },
        cantidad: this.cantidadSeleccionada
      }];

      if (!this.ventaSeleccionada.fecha) {
        throw new Error('La fecha es obligatoria');
      }

      const fechaISO = (this.ventaSeleccionada.fecha instanceof Date
        ? this.ventaSeleccionada.fecha
       : new Date(this.ventaSeleccionada.fecha)
        ).toISOString();

      const payload: VentaPayload = {
        id: this.ventaSeleccionada.id ?? undefined,
        fecha: fechaISO,
        ventaMuebles: payloadItems
      };

      const peticion = payload.id
        ? this.ventaService.editarVenta(payload)
        : this.ventaService.crearVenta(payload);

      peticion.subscribe({
        next: () => {
          this.cargarVentas();
          this.cancelarFormulario();
        },
        error: err => alert('Error al guardar venta: ' + (err.error?.message || err.message))
      });

    } catch (e: any) {
      alert(e.message);
    }
  }

  eliminarVenta(id: number) {
    if (!confirm('¿Seguro quieres eliminar esta venta?')) return;
    this.ventaService.eliminarVenta(id).subscribe({
      next: () => this.cargarVentas(),
      error: err => alert('Error al eliminar venta: ' + (err.error?.message || err.message))
    });
  }

  exportarVentasExcel() {
    alert('Función exportar a Excel (implementar)');
  }

  get fechaPorDefecto(): string {
    return new Date().toISOString().substring(0, 10);
  }

  get stockSeleccionado(): number {
    if (this.muebleSeleccionadoId == null) {
      return 1;
    }
    const m = this.mueblesDisponibles.find(x => x.id === this.muebleSeleccionadoId);
    return m ? m.stock : 1;
  }
}
