import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../dashboard/services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.usuario === 'admin' && this.clave === 'admin') {
      this.authService.loginAsAdmin();
      this.router.navigate(['/dashboard']);
    } else if (this.usuario === 'usuario' && this.clave === 'usuario') {
      this.authService.loginAsUser();
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  }
}
