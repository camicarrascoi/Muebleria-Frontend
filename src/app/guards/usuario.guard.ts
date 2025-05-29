import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('rol');
    if (role === 'usuario') {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
