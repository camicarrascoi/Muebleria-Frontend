import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  correo = '';
  clave = '';
  error = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.correo === 'admin@admin.com' && this.clave === 'admin') {
      localStorage.setItem('rol', 'admin');
      this.router.navigate(['/dashboard']);
    } else if (this.correo === 'usuario@usuario.com' && this.clave === 'usuario') {
      localStorage.setItem('rol', 'usuario');
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Credenciales inválidas';
    }
  }
}
