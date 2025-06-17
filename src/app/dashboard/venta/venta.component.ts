import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaService } from '../services/venta.service';
import { MueblesService } from '../services/muebles.service';
import { Venta, VentaMueble, VentaPayload, VentaMueblePayload } from '../../models/venta.model';
import { Mueble } from '../../models/mueble.model';
import { AuthService } from '../services/auth.service';
import { startWith } from 'rxjs/operators';
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
      validators: [Validators.min(1), Validators.max(1)]
    })
  });
  muebleSeleccionadoIdControl = this.formVenta.get('muebleSeleccionadoId') as FormControl<number | null>;
  cantidadSeleccionadaControl = this.formVenta.get('cantidadSeleccionada') as FormControl<number>;

  constructor(
    private ventaService: VentaService,
    private mueblesService: MueblesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarVentas();
    this.cargarMuebles();
    this.formVenta.get('muebleSeleccionadoId')!.valueChanges.subscribe(rawId => {
      const id = typeof rawId === 'string' ? +rawId : rawId as number;
      const encontrado = this.mueblesDisponibles.find(x => x.id === id);
      console.log('ID seleccionado:', id, 'Encontrado:', encontrado);

      const stock = encontrado?.stock ?? 1;
      this.cantidadSeleccionadaControl.setValidators([
        Validators.min(1),
        Validators.max(stock)
      ]);

      if (this.cantidadSeleccionadaControl.value! > stock) {
        this.cantidadSeleccionadaControl.setValue(stock);
      }

      this.cantidadSeleccionadaControl.updateValueAndValidity({ onlySelf: true });
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
    this.mostrarFormulario = true;
  }

  editarVenta(v: Venta) {
    this.ventaSeleccionada = { ...v, fecha: new Date(v.fecha), ventaMuebles: [...v.ventaMuebles] };

    if (v.ventaMuebles.length > 0) {
      const nombre = v.ventaMuebles[0].nombreMueble;
      const muebleEncontrado = this.mueblesDisponibles.find(m => m.nombre === nombre);
      this.muebleSeleccionadoIdControl.setValue(muebleEncontrado?.id ?? null);
      this.cantidadSeleccionadaControl.setValue(muebleEncontrado?.stock ?? 1);
    } else {
      this.muebleSeleccionadoIdControl.setValue(null);
      this.cantidadSeleccionadaControl.setValue(1);
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
    if (this.muebleSeleccionadoIdControl.value == null) {
      alert('Debes seleccionar un mueble');
      return;
    }
    if (this.cantidadSeleccionadaControl.value < 1) {
      alert('La cantidad debe ser al menos 1');
      return;
    }

    try {
      const payloadItems: VentaMueblePayload[] = [{
        mueble: { id: this.muebleSeleccionadoIdControl.value ?? 0 },
        cantidad: this.cantidadSeleccionadaControl.value,
        id: this.ventaSeleccionada.ventaMuebles[0].id
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
        fecha: fechaISO.split('T')[0],
        total: this.ventaSeleccionada.total ?? undefined,
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
    const id = this.muebleSeleccionadoIdControl.value;
    return this.mueblesDisponibles.find(x => x.id === id)?.stock ?? 1;
  }

}
