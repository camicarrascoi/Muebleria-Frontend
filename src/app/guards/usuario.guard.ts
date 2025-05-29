import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const rol = this.auth.getRol();
    if (rol === 'usuario' || rol === 'admin') {
      return true;  // Admin también puede ver rutas de usuario
    }
    this.router.navigate(['']);
    return false;
  }
}
