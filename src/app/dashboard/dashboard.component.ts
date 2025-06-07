import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule],
  template: `
    <h2>MUEBLERIA DON PEPE</h2>
    <p>Bienvenido al inventario mueblería</p>

    <button (click)="logout()" class="cerrar">Cerrar sesión</button>

    <nav *ngIf="rol" class="navbar">
      <ul class="navbar-links">
        <li class="mueble"><a routerLink="muebles" routerLinkActive="active">Muebles</a></li>
        <li class="materiales"><a routerLink="materiales" routerLinkActive="active">Materiales</a></li>
        <li class="proveedores"><a routerLink="proveedores" routerLinkActive="active">Proveedores</a></li>
        <li class="ventas"><a routerLink="ventas" routerLinkActive="active">Ventas</a></li>
      </ul>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #fdf8ed;
      padding: 30px;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
    }

    h2 {
      text-align: center;
      color: #4b3621;
      margin-bottom: 10px;
    }

    p {
      text-align: center;
      color: #6b5e49;
      margin-bottom: 30px;
    }

    button.cerrar {
      display: block;
      margin: 0 auto 30px;
      padding: 10px 20px;
      font-weight: bold;
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button.cerrar:hover {
      background-color: #b22a2a;
    }

    .navbar {
      background-color: #4b3621;
      padding: 10px 20px;
      border-radius: 10px;
      max-width: 600px;
      margin: 0 auto 40px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

    .navbar-links {
      list-style: none;
      display: flex;
      justify-content: space-around;
      padding: 0;
      margin: 0;
    }

    .navbar-links li {
      border-radius: 10px;
      transition: transform 0.2s ease;
    }

    .navbar-links li:hover {
      transform: scale(1.1);
    }

    .navbar-links a {
      display: block;
      padding: 12px 24px;
      color: white;
      font-weight: 600;
      text-decoration: none;
      font-size: 1.1rem;
      border-radius: 10px;
    }

    .navbar-links li.mueble { background-color: #4caf50; }
    .navbar-links li.materiales { background-color: #f4b400; }
    .navbar-links li.proveedores { background-color: #e53935; }
    .navbar-links li.ventas { background-color: #3b5998; }

    .navbar-links li.mueble:hover a { background-color: #388e3c; }
    .navbar-links li.materiales:hover a { background-color: #c79100; }
    .navbar-links li.proveedores:hover a { background-color: #ab2d2d; }
    .navbar-links li.ventas:hover a { background-color: #2d4373; }

    @media (max-width: 600px) {
      .navbar-links {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
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
  
  canView(section: string): boolean {
    if (this.rol === 'admin') return true;
    if (this.rol === 'usuario') {
      return section === 'muebles' || section === 'materiales';
    }
    return false;
  }

}

