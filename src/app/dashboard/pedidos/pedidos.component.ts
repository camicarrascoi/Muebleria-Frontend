import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedoresService } from '../../dashboard/services/proveedores.service';
import { MaterialesService } from '../../dashboard/services/materiales.service';
import { PedidoService } from '../../dashboard/services/pedido.service';
import { Proveedor } from '../../models/proveedores.model';
import { Material } from '../../models/material.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  proveedores: Proveedor[] = [];
  materiales: Material[] = [];

  pedido = {
    proveedorId: 0,
    fechaPedido: '',
    materiales: [
      { materialId: 0, cantidad: 1, costoUnitario: 0 }
    ]
  };

  constructor(
    private proveedorService: ProveedoresService,
    private materialService: MaterialesService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.proveedorService.obtenerProveedores().subscribe({
      next: data => this.proveedores = data,
      error: err => console.error('Error cargando proveedores', err)
    });

    this.materialService.obtenerMateriales().subscribe({
      next: data => this.materiales = data,
      error: err => console.error('Error cargando materiales', err)
    });
  }

  agregarMaterial() {
    this.pedido.materiales.push({ materialId: 0, cantidad: 1, costoUnitario: 0 });
  }

  quitarMaterial(index: number) {
    this.pedido.materiales.splice(index, 1);
  }

  guardarPedido() {
    this.pedidoService.crearPedido(this.pedido).subscribe({
      next: () => {
        alert('Pedido creado con éxito');
        this.pedido = {
          proveedorId: 0,
          fechaPedido: '',
          materiales: [{ materialId: 0, cantidad: 1, costoUnitario: 0 }]
        };
      },
      error: err => {
        console.error('Error al crear pedido', err);
        alert('Error al crear el pedido');
      }
    });
  }
}
