import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { Material, ProveedorSimple } from '../../models/material.model';
import { MaterialesService } from '../services/materiales.service';
import { AuthService } from '../services/auth.service';
import { ProveedoresService } from '../services/proveedores.service';
import { Proveedor } from '../../models/proveedores.model';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css'],
})
export class MaterialesComponent implements OnInit {
  materiales: Material[] = [];
  proveedores: Proveedor[] = [];
  proveedoresSeleccionados: Proveedor[] = [];
  materialSeleccionado: Material | null = null;
  mostrarFormulario = false;
  esAdmin = false;
  tiposMaterial: string[] = [];

  constructor(
    private materialesService: MaterialesService,
    private proveedoresService: ProveedoresService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    // Cargar proveedores antes de materiales para asignaciones
    this.cargarProveedores();
    // Obtener tipos de material
    this.materialesService.getTiposMaterial().subscribe({
      next: (tipos) => (this.tiposMaterial = tipos),
      error: (err) => console.error('Error al obtener tipos de material', err),
    });
  }

  cargarProveedores(): void {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (provData) => {
        this.proveedores = provData;
        this.cargarMateriales();
      },
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  cargarMateriales(): void {
    this.materialesService.obtenerMateriales().subscribe({
      next: (data) => {
        this.materiales = data.map((material: any) => ({
          id: material.id,
          nombre: material.nombre,
          tipo: material.tipo,
          descripcion: material.descripcion,
          unidadDeMedida: material.unidadDeMedida,
          stockActual: material.stockActual,
          proveedorMateriales: (material.proveedorMateriales || []).map((prov: any) => ({
            id: prov.id,
            nombre: prov.nombreProveedor,
          })),
          materialMuebles: (material.materialMuebles || []).map((mm: any) => ({
            id: mm.id,
            cantidadUtilizada: mm.cantidadUtilizada,
            muebleNombre: mm.nombreMueble,
          })),
        }));
      },
      error: (err) => console.error('Error al cargar materiales', err),
    });
  }

  abrirFormularioNuevo(): void {
    this.materialSeleccionado = {
      id: null,
      nombre: '',
      tipo: '',
      descripcion: '',
      unidadDeMedida: '',
      stockActual: 0,
      proveedorMateriales: [],
      materialMuebles: [],
    };
    this.proveedoresSeleccionados = [];
    this.mostrarFormulario = true;
  }

  editarMaterial(material: Material): void {
    this.materialSeleccionado = { ...material };
    // Mapear proveedores para el select múltiple
    this.proveedoresSeleccionados = this.materialSeleccionado.proveedorMateriales
      .map(pm => this.proveedores.find(p => p.id === pm.id)!)
      .filter(p => !!p);
    this.mostrarFormulario = true;
  }

  guardarMaterial(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.materialSeleccionado) {
      return;
    }

    // Validación extra: solo letras en nombre y descripción
    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
    if (
      !letrasRegex.test(this.materialSeleccionado.nombre) ||
      !letrasRegex.test(this.materialSeleccionado.descripcion)
    ) {
      alert('Nombre y descripción deben contener solo letras y espacios.');
      return;
    }

    // Asignar proveedores seleccionados
    this.materialSeleccionado.proveedorMateriales = this.proveedoresSeleccionados.map(p => ({
      id: p.id!,
      nombre: p.nombre,
    }));

    // Llamada a servicio
    if (this.materialSeleccionado.id) {
      this.materialesService.editarMaterial(
        this.materialSeleccionado.id,
        this.materialSeleccionado
      ).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cancelarFormulario();
        },
        error: err => console.error('Error al actualizar material', err),
      });
    } else {
      this.materialesService.agregarMaterial(this.materialSeleccionado).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cancelarFormulario();
        },
        error: err => console.error('Error al crear material', err),
      });
    }
  }

  eliminarMaterial(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.materialesService.eliminarMaterial(id).subscribe({
        next: () => this.cargarMateriales(),
        error: err => console.error('Error al eliminar material', err),
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.materialSeleccionado = null;
  }
}
