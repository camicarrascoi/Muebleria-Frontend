import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');
  
  if (!rol) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
