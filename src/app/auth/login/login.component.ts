import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../dashboard/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,  // para HttpClient en AuthService
    RouterModule       // para routerLink, Router.navigate
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  clave = '';
  error = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.error = '';
    this.authService.login(this.usuario, this.clave).subscribe({
      next: res => {
        // Guarda el token y el rol ya los hace AuthService
        // Redirige según rol
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/dashboard']); // o '/admin-dashboard'
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        this.error = err.error?.error || 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
