import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../../dashboard/services/auth.service'; 
import { Mueble } from '../../models/mueble.model';
import { MueblesService } from '../../dashboard/services/muebles.service';

@Component({
  selector: 'app-muebles',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgIf, NgForOf],
  templateUrl: './muebles.component.html',
  styleUrls: ['./muebles.component.css']
})
export class MueblesComponent implements OnInit {
  muebles: Mueble[] = [];
  esAdmin = true;

  constructor
  (
    private mueblesService: MueblesService,
    private authService: AuthService // inyecta servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin(); // suponiendo que devuelve boolean
    this.cargarMuebles();
  }

  cargarMuebles() {
    this.mueblesService.obtenerMuebles()
      .subscribe({
        next: data => this.muebles = data,
        error: err => console.error(err)
      });
  }

  trackByMuebleId(index: number, mueble: Mueble) {
    return mueble.id;
  }

  trackByMatId(index: number, mat: any) {
    return mat.id;
  }

  abrirFormularioNuevo() {
    // lógica para abrir formulario de agregar mueble
  }

  editarMueble(mueble: Mueble) {
    if (!this.esAdmin) return; // seguridad extra
    // lógica para editar
  }

  eliminarMueble(id: number) {
    if (!this.esAdmin) return; // seguridad extra
    // lógica para eliminar
  }
}