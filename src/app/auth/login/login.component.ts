import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  clave = '';
  error = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.usuario === 'admin' && this.clave === 'admin') {
      localStorage.setItem('rol', 'admin');
      this.router.navigate(['/dashboard']);
    } else if (this.usuario === 'usuario' && this.clave === 'usuario') {
      localStorage.setItem('rol', 'usuario');
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  }
}