import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('rol', 'admin');
      this.router.navigate(['/admin']);
      return true;
    } else if (username === 'user' && password === '1234') {
      localStorage.setItem('rol', 'usuario');
      this.router.navigate(['/usuario']);
      return true;
    }
    return false;
  }

  getRol(): 'admin' | 'usuario' | null {
    const rol = localStorage.getItem('rol');
    if (rol === 'admin' || rol === 'usuario') {
      return rol;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getRol() !== null;
  }

  logout(): void {
    localStorage.removeItem('rol');
    this.router.navigate(['/']); // Redirige al login
  }
}
