import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { Mueble } from '../../models/mueble.model';
import { MueblesService } from '../services/muebles.service';
import { Material } from '../../models/material.model'; // modelo para materiales
import { MaterialesService } from '../services/materiales.service'; // servicio para materiales

@Component({
  selector: 'app-muebles',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgIf, NgForOf, FormsModule],
  templateUrl: './muebles.component.html',
  styleUrls: ['./muebles.component.css']
})
export class MueblesComponent implements OnInit {
  muebles: Mueble[] = [];
  materialesDisponibles: Material[] = [];  // Todos los materiales para elegir
  muebleSeleccionado: Mueble | null = null;
  mostrarFormulario: boolean = false;
  esAdmin: boolean = false;

  constructor(
    private mueblesService: MueblesService,
    private materialesService: MaterialesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarMuebles();
    this.cargarMateriales();
    this.esAdmin = this.authService.isAdmin();
  }

  cargarMuebles() {
    this.mueblesService.obtenerMuebles().subscribe({
      next: data => {
        console.log('Muebles recibidos:', data);
        this.muebles = data;
      },
      error: err => console.error('Error al obtener muebles', err)
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
  this.muebleSeleccionado = {
    nombre: '',
    descripcion: '',
    precioVenta: 0,
    stock: 0,
    materialMuebles: this.materialesDisponibles
      .filter(mat => mat.id !== null && mat.id !== undefined)
      .map(mat => ({
        id: undefined, // opcional incluir o no
        cantidadUtilizada: 0,
        material: { ...mat, id: mat.id as number }
      }))
  };
  this.mostrarFormulario = true;
}


editarMueble(mueble: Mueble) {
  this.muebleSeleccionado = {
    ...mueble,
    materialMuebles: this.materialesDisponibles
      .filter(mat => mat.id !== null && mat.id !== undefined)
      .map(mat => {
        const encontrado = mueble.materialMuebles.find(mm => mm.material.id === mat.id);
        return encontrado
          ? encontrado
          : {
              id: undefined, // opcional incluir o no
              cantidadUtilizada: 0,
              material: { ...mat, id: mat.id as number }
            };
      })
  };
  this.mostrarFormulario = true;
}

actualizarMaterial(materialId: number, cantidad: number) {
  if (!this.muebleSeleccionado) return;

  const mm = this.muebleSeleccionado.materialMuebles.find(mm => mm.material.id === materialId);
  if (mm) {
    mm.cantidadUtilizada = cantidad;
  }
}

  guardarMueble() {
    if (!this.muebleSeleccionado) return;

    if (this.muebleSeleccionado?.id) {
      // Editar
      this.mueblesService.editarMueble(this.muebleSeleccionado).subscribe({
        next: () => {
          this.cargarMuebles();
          this.mostrarFormulario = false;
          this.muebleSeleccionado = null;
        },
        error: err => console.error(err)
      });
    } else {
      // Crear nuevo
      this.mueblesService.agregarMueble(this.muebleSeleccionado).subscribe({
        next: () => {
          this.cargarMuebles();
          this.mostrarFormulario = false;
          this.muebleSeleccionado = null;
        },
        error: err => console.error(err)
      });
    }
  }

  eliminarMueble(id: number) {
    if (confirm('¿Estás seguro de eliminar este mueble?')) {
      this.mueblesService.eliminarMueble(id).subscribe({
        next: () => this.cargarMuebles(),
        error: err => console.error(err)
      });
    }
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.muebleSeleccionado = null;
  }
}
