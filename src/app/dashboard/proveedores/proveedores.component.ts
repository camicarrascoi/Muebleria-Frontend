import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../../dashboard/services/auth.service';
import { Proveedor } from '../../models/proveedores.model';
import { ProveedoresService } from '../../dashboard/services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedorSeleccionado: Proveedor | null = null;
  mostrarFormulario = false;

  esAdmin = false;
  esUsuario = false;

  constructor(
    private proveedoresService: ProveedoresService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    const rol = this.authService.getRole();
    this.esAdmin = rol === 'admin';
    this.esUsuario = rol === 'usuario';
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: data => {
        console.log('Proveedores recibidos:', data);
        this.proveedores = data;
      },
      error: err => console.error('Error al obtener proveedores', err)
    });
  }

abrirFormularioNuevo() {
  this.proveedorSeleccionado = {
    nombre: '',
    direccion: '',
    correo: '',
    telefono: '',
    proveedorMateriales: [
      {
        material: { id: 0, nombre: '', tipo: '' },
        costoUnitario: 0
      }
    ]
  } as Proveedor;
  this.mostrarFormulario = true;
}

editarProveedor(proveedor: Proveedor) {
  this.proveedorSeleccionado = {
    ...proveedor,
    proveedorMateriales: proveedor.proveedorMateriales ?? []
  };
  this.mostrarFormulario = true;
}

  guardarProveedor() {
  if (!this.proveedorSeleccionado) return;

  const body = {
    nombre: this.proveedorSeleccionado.nombre,
    telefono: this.proveedorSeleccionado.telefono,
    correo: this.proveedorSeleccionado.correo,
    direccion: this.proveedorSeleccionado.direccion,
    proveedorMateriales: this.proveedorSeleccionado.proveedorMateriales!.map(pm => ({
      // SI pm.id existe, lo incluimos para actualizar esa fila
      ...(pm.id != null ? { id: pm.id } : {}),
      material: { id: pm.material.id },
      costoUnitario: pm.costoUnitario
    }))
  };

  if (this.proveedorSeleccionado.id) {
    this.proveedoresService
      .editarProveedor(this.proveedorSeleccionado.id, body)
      .subscribe(() => {
        this.cargarProveedores();
        this.cancelarFormulario();
      });
  } else {
    this.proveedoresService
      .agregarProveedor(body)
      .subscribe(() => {
        this.cargarProveedores();
        this.cancelarFormulario();
      });
  }
}
  eliminarProveedor(id: number) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedoresService.eliminarProveedor(id).subscribe({
        next: () => this.cargarProveedores(),
        error: err => console.error('Error al eliminar proveedor', err)
      });
    }
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.proveedorSeleccionado = null;
  }
  eliminarMaterial(index: number) {
    if (this.proveedorSeleccionado && this.proveedorSeleccionado.proveedorMateriales) {
      this.proveedorSeleccionado.proveedorMateriales.splice(index, 1);
    }
  }
  
}
