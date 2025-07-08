import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  nombre = '';
  password = '';
  rol = 'USUARIO';
  usuarios: any[] = [];
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    if (this.isAdmin) {
      this.cargarUsuarios();
    }
  }

  crearUsuario() {
    const usuario = {
      nombre: this.nombre,
      password: this.password,
      rol: 'USUARIO' // Siempre será usuario
    };

    this.authService.registerUsuario(usuario).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.nombre = '';
        this.password = '';

        if (this.isAdmin) {
          this.cargarUsuarios(); // Refrescar lista solo si es admin
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: err => {
        console.error('Error al crear usuario:', err);
        alert(`Error ${err.status}: ${err.error?.message || err.message}`);
      }
    });
  }

  cargarUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: data => this.usuarios = data,
      error: err => console.error('Error al cargar usuarios:', err)
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás segura/o de eliminar este usuario?')) {
      this.authService.eliminarUsuario(id).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      });
    }
  }
}
