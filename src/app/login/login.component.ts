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
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      localStorage.setItem('rol', 'admin');
      this.router.navigate(['/admin']);
    } else if (this.username === 'usuario' && this.password === 'usuario') {
      localStorage.setItem('rol', 'usuario');
      this.router.navigate(['/usuario']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
