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
    const rol = this.authService.obtenerRol();
    this.esAdmin = rol === 'admin';
    this.esUsuario = rol === 'usuario';
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: data => this.proveedores = data,
      error: err => console.error(err)
    });
  }

  abrirFormularioNuevo() {
    this.proveedorSeleccionado = {
      nombre: '',
      telefono: '',
      correo: '',
      direccion: ''
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
      this.proveedoresService.editarProveedor(this.proveedorSeleccionado).subscribe(() => {
        this.cargarProveedores();
        this.mostrarFormulario = false;
      });
    } else {
      // Agregar
      this.proveedoresService.agregarProveedor(this.proveedorSeleccionado!).subscribe(() => {
        this.cargarProveedores();
        this.mostrarFormulario = false;
      });
    }
  }

  eliminarProveedor(id: number) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedoresService.eliminarProveedor(id).subscribe(() => {
        this.cargarProveedores();
      });
    }
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.proveedorSeleccionado = null;
  }
}