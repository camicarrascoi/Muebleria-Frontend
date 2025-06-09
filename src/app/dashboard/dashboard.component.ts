import { CommonModule, CurrencyPipe, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialesService } from '../dashboard/services/materiales.service';
import { MueblesService } from '../dashboard/services/muebles.service';
import { ProveedoresService } from '../dashboard/services/proveedores.service';
import { AuthService } from '../dashboard/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mostrarResumen: boolean = true;
  cantidadMuebles: number = 0;
  cantidadMateriales: number = 0;
  cantidadProveedores: number = 0;
  cantidadVentas: number = 0; // Si se implementa ventas en el futuro
  esAdmin: boolean = false;

  constructor(
    private materialesService: MaterialesService,
    private mueblesService: MueblesService,
    private proveedoresService: ProveedoresService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarResumen();
  }

  cargarResumen() {
    this.mueblesService.obtenerMuebles().subscribe({
      next: muebles => this.cantidadMuebles = muebles.length,
      error: err => console.error('Error al obtener muebles', err)
    });

    this.materialesService.obtenerMateriales().subscribe({
      next: materiales => this.cantidadMateriales = materiales.length,
      error: err => console.error('Error al obtener materiales', err)
    });

    this.proveedoresService.obtenerProveedores().subscribe({
      next: proveedores => this.cantidadProveedores = proveedores.length,
      error: err => console.error('Error al obtener proveedores', err)
    });
  }
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige a login
  }
}
