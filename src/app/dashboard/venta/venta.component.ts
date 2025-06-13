import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentaService } from '../services/venta.service';
import { Venta, VentaMueble } from '../../models/venta.model';


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

  constructor(private ventaService: VentaService) {}

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
      fecha: '',
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
    this.ventaMueblesSeleccionados = venta.ventaMuebles.map(vm => vm.id).join(',');
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
      id,
      nombre: '', // Ojo: nombre no es necesario para guardar, solo el ID
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
}
