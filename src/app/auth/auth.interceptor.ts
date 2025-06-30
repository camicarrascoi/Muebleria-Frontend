import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../dashboard/services/auth.service';

  export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);  // inyectar servicio en función

      const token = authService.getToken();

      if(token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }

    return next(req);
  }