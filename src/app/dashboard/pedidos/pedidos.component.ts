import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../dashboard/services/auth.service';
import { PedidosService } from '../../dashboard/services/pedido.service';
import { ProveedoresService } from '../../dashboard/services/proveedores.service';
import { Pedido } from '../../models/pedido.model';
import { Proveedor, ProveedorMaterial } from '../../models/proveedores.model';

interface PedidoForm {
  fechaPedido: Date;
  proveedorId: number;
  items: {
    id: number;                 // id de ProveedorMaterial
    cantidadSuministrada: number;
  }[];
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: (Pedido & {
    cantidadPedido: number;
    costoTotal: number;
    detalleCantidades: { nombreMaterial: string; cantidad: number }[];
  })[] = [];

  proveedores: Proveedor[] = [];
  pedidosForm: PedidoForm | null = null;
  mostrarFormulario = false;
  esAdmin = false;
  esUsuario = false;

  constructor(
    private pedidosService: PedidosService,
    private proveedoresService: ProveedoresService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProveedores();
    this.loadPedidos();
    
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'ADMIN';
    this.esUsuario = rol === 'USER';
  }
  

  private loadProveedores(): void {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: data => this.proveedores = data,
      error: err => console.error(err)
    });
  }

  private loadPedidos(): void {
    this.pedidosService.obtenerPedidos().subscribe({
      next: data => {
        this.pedidos = data.map(p => {
          const detalle = p.proveedor.proveedorMateriales;
          const cantidadPedido = detalle.reduce((sum, pm) => sum + pm.cantidadSuministrada, 0);
          const costoTotal = detalle.reduce((sum, pm) => sum + pm.cantidadSuministrada * pm.costoUnitario, 0);
          const detalleCantidades = detalle.map(pm => ({
            nombreMaterial: pm.material.nombre,
            cantidad: pm.cantidadSuministrada
          }));
          return { ...p, cantidadPedido, costoTotal, detalleCantidades };
        });
      },
      error: err => console.error(err)
    });
  }

  abrirFormularioNuevo(): void {
    this.pedidosForm = {
      fechaPedido: new Date(),
      proveedorId: 0,
      items: []
    };
    this.mostrarFormulario = true;
  }

  onProveedorChange(provId: number): void {
    if (!this.pedidosForm) { return; }
    const prov = this.proveedores.find(p => p.id === provId);
    if (!prov) { return; }
    // Inicializar items con los materiales de ese proveedor (cantidad 0 por defecto)
    this.pedidosForm.items = prov.proveedorMateriales.map(pm => ({
      id: pm.id!,
      cantidadSuministrada: 0
    }));
  }

  guardarPedido(): void {
    if (!this.pedidosForm) { return; }
    // Construir el JSON según tu especificación
    const body = {
      fechaPedido: this.formatFecha(this.pedidosForm.fechaPedido),
      proveedor: {
        id: this.pedidosForm.proveedorId,
        proveedorMateriales: this.pedidosForm.items.map(i => ({
          id: i.id,
          cantidadSuministrada: i.cantidadSuministrada
        }))
      }
    };

    this.pedidosService.crearPedido(body).subscribe({
      next: () => {
        this.cancelarFormulario();
        this.loadPedidos();
      },
      error: err => console.error('Error al guardar pedido', err)
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.pedidosForm = null;
  }

  private formatFecha(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}