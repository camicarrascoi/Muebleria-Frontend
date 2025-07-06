import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../dashboard/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const isAdmin = this.authService.isAdmin();

    if (token && isAdmin) {
      return true;
    }

    // Si no tiene permisos, redirige al dashboard (o login si no hay token)
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/dashboard']);
    }

    return false;
  }
}