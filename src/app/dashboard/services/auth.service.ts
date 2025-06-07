import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleKey = 'rol';
  private role: 'admin' | 'user' | null = null;

  constructor() {
    this.role = (localStorage.getItem(this.roleKey) as 'admin' | 'user') || null;
  }

  loginAsAdmin() {
    this.role = 'admin';
    localStorage.setItem(this.roleKey, this.role);
  }

  loginAsUser() {
    this.role = 'user';
    localStorage.setItem(this.roleKey, this.role);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isUser(): boolean {
    return this.role === 'user';
  }

  getRole(): string | null {
    return this.role;
  }

  logout() {
    this.role = null;
    localStorage.removeItem(this.roleKey);
  }
}
