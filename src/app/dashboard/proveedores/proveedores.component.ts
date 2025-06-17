import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../../dashboard/services/auth.service';
import { Proveedor, ProveedorMaterial } from '../../models/proveedores.model';
import { Material } from '../../models/material.model';
import { ProveedoresService } from '../../dashboard/services/proveedores.service';
import { MaterialesService } from '../../dashboard/services/materiales.service';

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

  materialesDisponibles: Material[] = [];

  constructor(
    private proveedoresService: ProveedoresService,
    private materialesService: MaterialesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarMateriales();
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

  cargarMateriales() {
    this.materialesService.obtenerMateriales().subscribe({
      next: data => {
        this.materialesDisponibles = data;
      },
      error: err => console.error('Error al cargar materiales', err)
    });
  }

  abrirFormularioNuevo() {
    this.proveedorSeleccionado = {
      nombre: '',
      direccion: '',
      correo: '',
      telefono: '',
      proveedorMateriales: []
    } as Proveedor;
    this.mostrarFormulario = true;
  }

  editarProveedor(proveedor: Proveedor) {
    this.proveedorSeleccionado = {
      ...proveedor,
      proveedorMateriales: proveedor.proveedorMateriales ? [...proveedor.proveedorMateriales] : []
    };
    this.mostrarFormulario = true;
  }

  guardarProveedor() {
  if (!this.proveedorSeleccionado) return;

  // Validación: asegurarse que todos los materiales tienen ID válido
  const tieneMaterialInvalido = this.proveedorSeleccionado.proveedorMateriales?.some(pm => pm.material.id === null || pm.material.id === undefined);

  if (tieneMaterialInvalido) {
    alert('Por favor selecciona un material válido para todos los elementos.');
    return;
  }

  const body = {
    nombre: this.proveedorSeleccionado.nombre,
    telefono: this.proveedorSeleccionado.telefono,
    correo: this.proveedorSeleccionado.correo,
    direccion: this.proveedorSeleccionado.direccion,
    proveedorMateriales: this.proveedorSeleccionado.proveedorMateriales!.map(pm => ({
      ...(pm.id != null ? { id: pm.id } : {}),
      material: { id: pm.material.id! }, // usamos el operador non-null porque ya validamos arriba
      costoUnitario: pm.costoUnitario
    }))
  };

  const operacion = this.proveedorSeleccionado.id
    ? this.proveedoresService.editarProveedor(this.proveedorSeleccionado.id, body)
    : this.proveedoresService.agregarProveedor(body);

  operacion.subscribe({
    next: () => {
      this.cargarProveedores();
      this.cancelarFormulario();
    },
    error: err => {
      console.error('Error al guardar proveedor:', err);
      alert('Ocurrió un error al guardar el proveedor.');
    }
  });
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

  agregarMaterial() {
    if (this.proveedorSeleccionado) {
      this.proveedorSeleccionado.proveedorMateriales = this.proveedorSeleccionado.proveedorMateriales || [];
      this.proveedorSeleccionado.proveedorMateriales.push({
        material: { id: 0, nombre: '', tipo: '', descripcion: '', unidadDeMedida: '' , stockActual: 0 , proveedorMateriales: [], materialMuebles: [] },
        costoUnitario: 0
      });
    }
  }

  quitarMaterial(index: number) {
    if (this.proveedorSeleccionado?.proveedorMateriales) {
      this.proveedorSeleccionado.proveedorMateriales.splice(index, 1);
    }
  }

  onMaterialChange(pm: ProveedorMaterial, nuevoId: number) {
    const material = this.materialesDisponibles.find(m => m.id === nuevoId);
    if (material) {
      pm.material = material;
    }
  }
}
