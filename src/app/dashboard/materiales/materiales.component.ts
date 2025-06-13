import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { Material } from '../../models/material.model';
import { MaterialesService } from '../../dashboard/services/materiales.service';
import { AuthService } from '../../dashboard/services/auth.service';

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
  mostrarFormulario: boolean = false;
  esAdmin: boolean = false;

  constructor(
    private materialesService: MaterialesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarMateriales();
    this.esAdmin = this.authService.isAdmin(); // o como se llame tu método
  }

  cargarMateriales() {
    this.materialesService.obtenerMateriales().subscribe({
      next: data => {
        console.log('Materiales recibidos:', data);
        this.materiales = data;
      },
      error: err => console.error('Error al cargar materiales', err)
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
    this.mostrarFormulario = true;
  }

  editarMaterial(material: Material){
    this.materialSeleccionado = { ...material };
    this.mostrarFormulario = true;
  }

  guardarMaterial() { 
    if (this.materialSeleccionado?.id) {
      // Editar
      this.materialesService.editarMaterial(this.materialSeleccionado.id, this.materialSeleccionado).subscribe({
        next: () => {
          this.cargarMateriales();
          this.mostrarFormulario = false;
          this.materialSeleccionado = null;
        },
        error: err => console.error('Error al actualizar material', err)
      });
    } else {
      // Crear nuevo
      this.materialesService.agregarMaterial(this.materialSeleccionado!).subscribe({
        next: () => {
          this.cargarMateriales();
          this.mostrarFormulario = false;
          this.materialSeleccionado = null;
        },
        error: err => console.error('Error al crear material', err)
      });
    }
  }
  
  eliminarMaterial(id:number) {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.materialesService.eliminarMaterial(id).subscribe({
        next: () => this.cargarMateriales(),
        error: err => console.error('Error al eliminar material', err)
      });
    }
  }
  
  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.materialSeleccionado = null;
  }
}
