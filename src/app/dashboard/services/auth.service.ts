import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = 'http://localhost:8080/api/v1/usuario';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'rol';

  constructor(private http: HttpClient, private router: Router) {}

  login(nombre: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API}/login`, { nombre, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.ROLE_KEY, response.rol);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USUARIO';
  }

  // Registro de usuario
  registerUsuario(data: { nombre: string; password: string; rol: string }) {
    // Incluye el token para solicitudes protegidas
    const token = this.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.post(this.API, data, headers ? { headers } : {});
  }

  // Obtener lista de usuarios
getUsuarios() {
  const token = this.getToken();
  const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  return this.http.get<any[]>(`${this.API}`, headers ? { headers } : {});
}

// Eliminar un usuario
eliminarUsuario(id: number) {
  const token = this.getToken();
  const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  return this.http.delete(`${this.API}/${id}`, headers ? { headers } : {});
}

// Actualizar rol de un usuario
 editarUsuario(usuario: { id: number; nombre: string; password: string; rol: string }) {
    const token = this.getToken();
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http.put(
      `${this.API}`,      // PUT http://localhost:8080/api/v1/usuario
      usuario,           // objeto completo con id,nombre,password,rol
      headers ? { headers } : {}
    );
  }


}