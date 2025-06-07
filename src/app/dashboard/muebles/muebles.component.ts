import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, NgIf, NgForOf } from '@angular/common';
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

  constructor(private mueblesService: MueblesService) {}

  ngOnInit(): void {
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

  abrirFormularioNuevo() {}
  editarMueble(mueble: Mueble) {}
  eliminarMueble(id: number) {}
}