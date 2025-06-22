import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaService } from '../services/venta.service';
import { MueblesService } from '../services/muebles.service';
import { Venta, VentaPayload, VentaMueblePayload } from '../../models/venta.model';
import { Mueble } from '../../models/mueble.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  mueblesDisponibles: Mueble[] = [];
  ventaSeleccionada: Venta | null = null;
  fechaMinima = new Date().toISOString().split('T')[0];

  mostrarFormulario = false;
  esAdmin = false;

  formVenta = new FormGroup({
    fecha: new FormControl(this.fechaMinima, [Validators.required]),
    muebleSeleccionadoId: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    cantidadSeleccionada: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.min(1)]
    })
  });

  muebleSeleccionadoIdControl = this.formVenta.get('muebleSeleccionadoId') as FormControl<number | null>;
  cantidadSeleccionadaControl = this.formVenta.get('cantidadSeleccionada') as FormControl<number>;

  constructor(
    private ventaService: VentaService,
    private mueblesService: MueblesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  this.esAdmin = this.authService.isAdmin();
  this.cargarVentas();
  this.cargarMuebles();

  this.muebleSeleccionadoIdControl.valueChanges.subscribe(rawId => {
  const id = typeof rawId === 'string' ? +rawId : rawId as number;
  const encontrado = this.mueblesDisponibles.find(x => x.id === id);
  const stock = encontrado?.stock ?? 100;  // Default 100 para que no limite a 1

  this.cantidadSeleccionadaControl.setValidators([
    Validators.min(1),
    Validators.max(stock)
  ]);

  this.cantidadSeleccionadaControl.updateValueAndValidity();
});
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
    this.muebleSeleccionadoIdControl.setValue(null);
    this.cantidadSeleccionadaControl.setValue(1);

    // Reinicia los validadores para asegurar límite correcto al abrir
    this.cantidadSeleccionadaControl.setValidators([
      Validators.min(1),
      Validators.max(1) // se actualiza luego en valueChanges
    ]);
    this.cantidadSeleccionadaControl.updateValueAndValidity();

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

    if (this.muebleSeleccionadoIdControl.value == null) {
      alert('Debes seleccionar un mueble');
      return;
    }

    if (this.cantidadSeleccionadaControl.value < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    try {
      const itemPayload: VentaMueblePayload = {
        mueble: { id: this.muebleSeleccionadoIdControl.value ?? 0 },
        cantidad: this.cantidadSeleccionadaControl.value
      };

      const payloadItems: VentaMueblePayload[] = [itemPayload];

      if (!this.ventaSeleccionada.fecha) {
        throw new Error('La fecha es obligatoria');
      }

      const fechaISO = (this.ventaSeleccionada.fecha instanceof Date
        ? this.ventaSeleccionada.fecha
        : new Date(this.ventaSeleccionada.fecha)
      ).toISOString();

      const payload: VentaPayload = {
        fecha: fechaISO.split('T')[0],
        ventaMuebles: payloadItems
      };

      this.ventaService.crearVenta(payload).subscribe({
        next: () => {
          this.cargarVentas();
          this.cancelarFormulario();
        },
        error: err =>
          alert('Error al guardar venta: ' + (err.error?.message || err.message))
      });

    } catch (e: any) {
      alert(e.message);
    }
  }

  eliminarVenta(id: number) {
    if (!confirm('¿Estás segura/o de que quieres eliminar esta venta?')) return;
    if (!confirm('Esto es irreversible. ¿Estás completamente segura/o?')) return;

    this.ventaService.eliminarVenta(id).subscribe({
      next: () => this.cargarVentas(),
      error: err => alert('Error al eliminar venta: ' + (err.error?.message || err.message))
    });
  }

  exportarVentasExcel() {
    alert('Función exportar a Excel (implementar)');
  }

  getNombreMueblePorId(id: number): string {
    const mueble = this.mueblesDisponibles.find(m => m.id === id);
    return mueble ? mueble.nombre : 'Nombre no disponible';
  }

  get stockSeleccionado(): number {
  const id = this.muebleSeleccionadoIdControl.value;
  return this.mueblesDisponibles.find(x => x.id === id)?.stock ?? 100;
}
}
