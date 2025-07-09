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

  constructor(private authService: AuthService, private router: Router) { }

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

  /** Elimina un usuario por ID */
  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.authService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      },
      error: err => {
        console.error('Error al eliminar usuario:', err);
        alert('No se pudo eliminar el usuario');
      }
    });
  }

  //Cambia el rol de un usuario (solo admin).
  actualizarRol(usuario: any) {
    if (!confirm(`Vas a cambiar el rol de "${usuario.nombre}" a "${usuario.rol}". ¿Continuar?`)) {
      return;
    }

    // Paso 1: eliminar
    this.authService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        // Paso 2: recrear con nuevo rol
        const nuevo = {
          nombre: usuario.nombre,
          password: usuario.password, // Si deseas pedir contraseña nueva, reemplaza aquí
          rol: usuario.rol
        };

        this.authService.registerUsuario(nuevo).subscribe({
          next: () => {
            alert(`Usuario "${nuevo.nombre}" recreado con rol "${nuevo.rol}"`);
            this.cargarUsuarios();
          },
          error: err2 => {
            console.error('Error al recrear usuario:', err2);
            alert(`No se pudo recrear el usuario: ${err2.error?.message || err2.message}`);
          }
        });
      },
      error: err1 => {
        console.error('Error al eliminar usuario:', err1);
        alert(`No se pudo eliminar el usuario: ${err1.error?.message || err1.message}`);
      }
    });
  }
}