import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule],
  template: `
    <h2>Dashboard</h2>
    <p>Bienvenido al inventario mueblería</p>

    <button (click)="logout()">Cerrar sesión</button>

    <nav *ngIf="rol">
      <a routerLink="muebles" routerLinkActive="active">Muebles</a> |
      <a routerLink="materiales" routerLinkActive="active">Materiales</a> |
      <a routerLink="proveedores" routerLinkActive="active">Proveedores</a> |
      <a routerLink="ventas" routerLinkActive="active">Ventas</a>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class DashboardComponent {
  rol: string | null = null;

  constructor(private router: Router) {
    this.rol = localStorage.getItem('rol');
    if (!this.rol) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}
