import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { Mueble } from '../../models/mueble.model';
import { MueblesService } from '../services/muebles.service';
import { Material } from '../../models/material.model';
import { MaterialesService } from '../services/materiales.service';

interface MaterialMueble {
  id?: number; // puede ser undefined para nuevos registros
  cantidadUtilizada: number;
  material: Material;
}

interface MuebleConMateriales extends Mueble {
  materialMuebles: MaterialMueble[];
}

@Component({
  selector: 'app-muebles',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgIf, NgForOf, FormsModule],
  templateUrl: './muebles.component.html',
  styleUrls: ['./muebles.component.css']
})
export class MueblesComponent implements OnInit {
  muebles: MuebleConMateriales[] = [];
  materialesDisponibles: Material[] = [];
  muebleSeleccionado: MuebleConMateriales = this.getMuebleVacio();
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

  getMuebleVacio(): MuebleConMateriales {
    return {
      id: undefined,
      nombre: '',
      descripcion: '',
      precioVenta: 0,
      stock: 0,
      materialMuebles: []
    };
  }

  cargarMuebles() {
    this.mueblesService.obtenerMuebles().subscribe({
      next: data => {
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
    this.muebleSeleccionado = this.getMuebleVacio();
    this.muebleSeleccionado.materialMuebles = this.materialesDisponibles.map(mat => ({
      cantidadUtilizada: 0,
      material: mat
    }));
    this.mostrarFormulario = true;
  }

  editarMueble(mueble: MuebleConMateriales) {
    const materialesMap = new Map<number, MaterialMueble>();

    // Agregar materiales usados en el mueble
    mueble.materialMuebles.forEach(mm => {
      if (mm.material?.id != null) {
        materialesMap.set(mm.material.id, { ...mm, material: mm.material });
      }
    });

    // Agregar materiales disponibles que no estén en el mueble
    this.materialesDisponibles.forEach(mat => {
      if (!materialesMap.has(mat.id!)) {
        materialesMap.set(mat.id!, {
          cantidadUtilizada: 0,
          material: mat
        });
      }
    });

    this.muebleSeleccionado = {
      ...mueble,
      materialMuebles: Array.from(materialesMap.values())
    };

    this.mostrarFormulario = true;
  }

  guardarMueble() {
    if (!this.muebleSeleccionado) return;

    if (this.muebleSeleccionado.id) {
      this.mueblesService.editarMueble(this.muebleSeleccionado).subscribe({
        next: () => {
          this.cargarMuebles();
          this.mostrarFormulario = false;
        },
        error: err => console.error(err)
      });
    } else {
      this.mueblesService.agregarMueble(this.muebleSeleccionado).subscribe({
        next: () => {
          this.cargarMuebles();
          this.mostrarFormulario = false;
          this.muebleSeleccionado = this.getMuebleVacio();
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
    this.muebleSeleccionado = this.getMuebleVacio();
  }
}
