import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaService } from '../services/venta.service';
import { MueblesService } from '../services/muebles.service';
import { Venta, VentaPayload, VentaMueblePayload } from '../../models/venta.model';
import { Mueble } from '../../models/mueble.model';
import { AuthService } from '../services/auth.service';
import { DashboardComponent } from "../dashboard.component";

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
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
  esUsuario = false;

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
    this.cargarVentas();
    this.cargarMuebles();

    this.muebleSeleccionadoIdControl.valueChanges.subscribe(rawId => {
      const id = typeof rawId === 'string' ? +rawId : rawId as number;
      const encontrado = this.mueblesDisponibles.find(x => x.id === id);
      const stock = encontrado?.stock ?? 100;

      this.cantidadSeleccionadaControl.setValidators([
        Validators.min(1),
        Validators.max(stock)
      ]);
      this.cantidadSeleccionadaControl.updateValueAndValidity();
    });
    
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'ADMIN';
    this.esUsuario = rol === 'USUARIO';
  }

  private cargarVentas() {
    this.ventaService.obtenerVentas().subscribe({
      next: data => this.ventas = data,
      error: err => console.error('Error al cargar ventas:', err)
    });
  }

  private cargarMuebles() {
    this.mueblesService.obtenerMuebles().subscribe({
      next: list => this.mueblesDisponibles = list.filter(m => m.stock > 0),
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

  agregarMueble() {
  if (!this.ventaSeleccionada) return;

  const rawId = this.muebleSeleccionadoIdControl.value;
  const muebleId = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;

  if (!muebleId) {
    alert('Selecciona un mueble antes de agregarlo.');
    return;
  }

  const cantidad = this.cantidadSeleccionadaControl.value ?? 0;
  if (cantidad < 1) {
    alert('Cantidad debe ser al menos 1.');
    return;
  }

  const muebleEncontrado = this.mueblesDisponibles.find(m => m.id === muebleId);
  if (!muebleEncontrado) {
    alert('Mueble no encontrado.');
    return;
  }

  const stockDisponible = muebleEncontrado.stock;

  if (cantidad > stockDisponible) {
    alert(`No puedes agregar más de ${stockDisponible} unidades de este mueble.`);
    return;
  }

  const yaAgregado = this.ventaSeleccionada.ventaMuebles.some(vm => vm.mueble.id === muebleId);
  if (yaAgregado) {
    alert('Este mueble ya fue agregado. Si quieres cambiar la cantidad, elimínalo primero.');
    return;
  }

  this.ventaSeleccionada.ventaMuebles.push({
    mueble: { id: muebleId },
    nombreMueble: muebleEncontrado.nombre,
    cantidad: cantidad,
    precioUnitario: 0,
    subtotal: 0
  });

  this.muebleSeleccionadoIdControl.setValue(null);
  this.cantidadSeleccionadaControl.setValue(1);
}

  eliminarMueble(index: number) {
    if (!this.ventaSeleccionada) return;
    this.ventaSeleccionada.ventaMuebles.splice(index, 1);
  }

  guardarVenta() {
  if (!this.ventaSeleccionada) return;

  if (!this.ventaSeleccionada.ventaMuebles || this.ventaSeleccionada.ventaMuebles.length === 0) {
    alert('Agrega al menos un mueble a la venta.');
    return;
  }

  if (!this.ventaSeleccionada.fecha) {
    alert('La fecha es obligatoria');
    return;
  }

  // Calcular total sumando subtotales (o calcularlos ahora)
  let total = 0;

  const items: VentaMueblePayload[] = this.ventaSeleccionada.ventaMuebles.map(vm => {
    const precio = vm.precioUnitario ?? 0;
    const cantidad = vm.cantidad ?? 0;
    const subtotal = precio * cantidad;
    total += subtotal;
    return {
      mueble: { id: vm.mueble.id },
      cantidad: cantidad,
      precioUnitario: precio,
      subtotal: subtotal
    };
  });

  const fechaISO = (this.ventaSeleccionada.fecha instanceof Date
    ? this.ventaSeleccionada.fecha
    : new Date(this.ventaSeleccionada.fecha)
  ).toISOString().split('T')[0];

  const payload: VentaPayload = {
    fecha: fechaISO,
    total: total,
    ventaMuebles: items
  };

  this.ventaService.crearVenta(payload).subscribe({
    next: () => {
      this.cargarVentas();
      this.cancelarFormulario();
    },
    error: err =>
      alert('Error al guardar venta: ' + (err.error?.error || err.message))
  });
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
