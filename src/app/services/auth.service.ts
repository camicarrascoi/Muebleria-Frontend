import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: 'admin' | 'usuario' | null = null;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      this.role = 'admin';
      return true;
    } else if (username === 'user' && password === '1234') {
      this.role = 'usuario';
      return true;
    }
    return false;
  }

  getRole(): 'admin' | 'usuario' | null {
    return this.role;
  }

  isLoggedIn(): boolean {
    return this.role !== null;
  }

  logout(): void {
    this.role = null;
    this.router.navigate(['/']); // Redirige al login
  }
}
