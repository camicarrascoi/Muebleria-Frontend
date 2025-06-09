import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../../dashboard/services/auth.service'; 
import { Mueble } from '../../models/mueble.model';
import { MueblesService } from '../../dashboard/services/muebles.service';

@Component({
  selector: 'app-muebles',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgIf, NgForOf, FormsModule],
  templateUrl: './muebles.component.html',
  styleUrls: ['./muebles.component.css']
})
export class MueblesComponent implements OnInit {
  muebles: Mueble[] = [];
  muebleSeleccionado: Mueble | null = null;
  mostrarFormulario: boolean = false;
  esAdmin: boolean = false;

  constructor(
    private mueblesService: MueblesService,
    private authService: AuthService // inyecta servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.cargarMuebles();
    this.esAdmin = this.authService.isAdmin(); // verifica si el usuario es admin
  }

  cargarMuebles() {
    this.mueblesService.obtenerMuebles().subscribe({
        next: data => this.muebles = data,
        error: err => console.error(err)
      });
  }

  abrirFormularioNuevo() {
    this.muebleSeleccionado = {
      nombre: '',
      descripcion: '',
      precioVenta: 0,
      stock: 0,
      materialMuebles: []
    };
    this.mostrarFormulario = true;
  }

  editarMueble(mueble: Mueble) {
    this.muebleSeleccionado = { ...mueble };
    this.mostrarFormulario = true;
  }

  guardarMueble() {
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
      this.mueblesService.agregarMueble(this.muebleSeleccionado!).subscribe({
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