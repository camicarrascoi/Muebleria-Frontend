import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  proveedores: Proveedor[] = [];  // <-- lista completa de proveedores para el select
  proveedoresSeleccionados: Proveedor[] = []; // <-- seleccionados en el select múltiple
  materialSeleccionado: Material | null = null;
  mostrarFormulario: boolean = false;
  esAdmin: boolean = false;

  constructor(
    private materialesService: MaterialesService,
    private proveedoresService: ProveedoresService,  // <-- inyectar servicio
    private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarMateriales();
    this.cargarProveedores(); // <-- cargar proveedores
    this.esAdmin = this.authService.isAdmin();
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (provData) => {
        this.proveedores = provData;
        this.cargarMateriales();
      },
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  cargarMateriales() {
  this.materialesService.obtenerMateriales().subscribe({
    next: (data) => {
      this.materiales = data.map(material => ({
        ...material,
        // 1) Mapear proveedores
        proveedorMateriales: material.proveedorMateriales.map(prov => ({
          id: prov.id ?? 0,
          nombre: prov.nombre
        })),
        // 2) Filtrar muebles con cantidadUtilizada > 0
        materialMuebles: material.materialMuebles
          .filter(mm => mm.cantidadUtilizada > 0)
          .map(mm => ({ ...mm }))
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
      materialMuebles: []
    };
    this.proveedoresSeleccionados = [];
    this.mostrarFormulario = true;
  }

  editarMaterial(material: Material) {
    this.materialSeleccionado = { ...material };
    // Mapear los proveedores para que aparezcan seleccionados en el select
    this.proveedoresSeleccionados = this.materialSeleccionado.proveedorMateriales.map(pm => {
      return this.proveedores.find(p => p.id === pm.id)!;
    }).filter(p => p !== undefined);
    this.mostrarFormulario = true;
  }

  guardarMaterial() {
    if (!this.materialSeleccionado) return;

    // Actualizar la lista de proveedores del material con los seleccionados
    this.materialSeleccionado.proveedorMateriales = this.proveedoresSeleccionados.map(p => ({
      id: p.id!,
      nombre: p.nombre
    }));

    if (this.materialSeleccionado.id) {
      this.materialesService.editarMaterial(this.materialSeleccionado.id, this.materialSeleccionado).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cancelarFormulario();
        },
        error: (err) => console.error('Error al actualizar material', err),
      });
    } else {
      this.materialesService.agregarMaterial(this.materialSeleccionado).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cancelarFormulario();
        },
        error: (err) => console.error('Error al crear material', err),
      });
    }
  }

  eliminarMaterial(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.materialesService.eliminarMaterial(id).subscribe({
        next: () => this.cargarMateriales(),
        error: (err) => console.error('Error al eliminar material', err),
      });
    }
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.materialSeleccionado = null;
  }
}
