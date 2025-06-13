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
      rut: '',
      direccion: '',
      correo: '',
      telefono: '',
      materiales: []
    };
    this.mostrarFormulario = true;
  }

  editarProveedor(proveedor: Proveedor) {
    this.proveedorSeleccionado = { ...proveedor };
    this.mostrarFormulario = true;
  }

  guardarProveedor() {
    if (this.proveedorSeleccionado?.id) {
      // Editar
      this.proveedoresService.editarProveedor(this.proveedorSeleccionado).subscribe({
        next: () => {
          this.cargarProveedores();
          this.mostrarFormulario = false;
          this.proveedorSeleccionado = null;
        },
        error: err => console.error('Error al editar proveedor', err)
      });
    } else {
      // Agregar
      this.proveedoresService.agregarProveedor(this.proveedorSeleccionado!).subscribe({
        next: () => {
          this.cargarProveedores();
          this.mostrarFormulario = false;
          this.proveedorSeleccionado = null;
        },
        error: err => console.error('Error al agregar proveedor', err)
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
}
