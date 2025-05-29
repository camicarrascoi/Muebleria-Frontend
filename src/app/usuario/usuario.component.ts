import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  template: `
    <h2>Vista de Usuario</h2>
    <p>Bienvenido, usuario.</p>
  `
})
export class UsuarioComponent implements OnInit {
  rol: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.rol = localStorage.getItem('rol');
    if (this.rol !== 'usuario') {
      alert('No tienes permiso para acceder a esta página.');
      this.router.navigate(['/login']);
    }
  }
}
