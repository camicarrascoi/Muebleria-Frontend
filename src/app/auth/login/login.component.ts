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

  constructor(private router: Router, private authService: AuthService) { }

  
  onLogin() {
  this.error = '';
  this.authService.login(this.usuario, this.clave).subscribe({
    next: res => {
      console.log('Respuesta login:', res); // <--- aquí
      localStorage.setItem('rol', res.rol); // Asegúrate que se guarda el rol
      if (res.rol === 'ADMIN') {
        this.router.navigate(['/dashboard']);
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
