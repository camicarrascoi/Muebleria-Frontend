import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { Material } from '../../models/material.model';
import { MaterialesService } from '../services/materiales.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css'],
})
export class MaterialesComponent implements OnInit {
  materiales: Material[] = [];
  materialSeleccionado: Material | null = null;
  proveedoresSeleccionados: string = '';
  mostrarFormulario: boolean = false;
  esAdmin: boolean = false;

  constructor(
    private materialesService: MaterialesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarMateriales();
    this.esAdmin = this.authService.isAdmin(); // Ajustar según método real
  }

  cargarMateriales() {
    this.materialesService.obtenerMateriales().subscribe({
      next: (data) => {
        this.materiales = data;
      },
      error: (err) => console.error('Error al cargar materiales', err),
    });
  }

  abrirFormularioNuevo(): void {
    // Inicializa con valores vacíos y arreglo vacío para proveedores y materialMuebles
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
    this.mostrarFormulario = true;
  }

  editarMaterial(material: Material) {
    // Clonamos el objeto para evitar mutaciones directas
    this.materialSeleccionado = { ...material };
    this.mostrarFormulario = true;
  }

  guardarMaterial() {
    if (!this.materialSeleccionado) return;

    if (this.materialSeleccionado.id) {
      // Editar material existente
      this.materialesService.editarMaterial(this.materialSeleccionado.id, this.materialSeleccionado).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cancelarFormulario();
        },
        error: (err) => console.error('Error al actualizar material', err),
      });
    } else {
      // Crear material nuevo
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
