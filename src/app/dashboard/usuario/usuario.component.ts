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

usuarioEditando: any = null;

abrirFormularioEdicion(usuario: any) {
  // Crear una copia para no afectar la tabla mientras se edita
  this.usuarioEditando = {
    id: usuario.id,
    nombre: usuario.nombre,
    password: '', // ← nunca mostrar el hash
    rol: usuario.rol
  };
}

cancelarEdicion() {
  this.usuarioEditando = null;
}

guardarEdicion() {
  const datosActualizados = {
    id: this.usuarioEditando.id,
    nombre: this.usuarioEditando.nombre.trim(),
    password: this.usuarioEditando.password.trim(), // puede ser ''
    rol: this.usuarioEditando.rol
  };

  if (!datosActualizados.nombre) {
    alert('El nombre no puede estar vacío.');
    return;
  }

  this.authService.editarUsuario(datosActualizados).subscribe({
    next: () => {
      alert(`Usuario "${datosActualizados.nombre}" actualizado correctamente.`);
      this.usuarioEditando = null;
      this.cargarUsuarios();
    },
    error: err => {
      console.error('Error al editar usuario:', err);
      alert(err.error?.message || 'No se pudo editar el usuario');
    }
  });
}
}