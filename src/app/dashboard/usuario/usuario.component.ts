import { Component } from '@angular/core';
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
export class UsuarioComponent {
    nombre = '';
    password = '';
    rol = 'USUARIO'; // o dejar seleccionable si el admin elige

    constructor(private authService: AuthService, private router: Router) { }

    crearUsuario() {
        const usuario = {
            nombre: this.nombre,
            password: this.password,
            rol: 'USUARIO' // siempre será usuario
        };

        this.authService.registerUsuario(usuario).subscribe({
            next: () => {
                alert('Usuario creado correctamente');
                this.router.navigate(['/dashboard']);
            },
            error: err => {
                console.error('Error al crear usuario:', err);
                alert(`Error ${err.status}: ${err.error?.message || err.message}`);
            }
        });
    }
}
