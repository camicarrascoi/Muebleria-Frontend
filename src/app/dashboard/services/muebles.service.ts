import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mueble } from '../../models/mueble.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MueblesService {

  private apiUrl = 'http://tu-backend-api.com/api/muebles'; // Cambia a la URL real

  constructor(private http: HttpClient) { }

  obtenerMuebles(): Observable<Mueble[]> {
    return this.http.get<Mueble[]>(this.apiUrl);
  }

  agregarMueble(mueble: Mueble): Observable<Mueble> {
    return this.http.post<Mueble>(this.apiUrl, mueble);
  }

  editarMueble(mueble: Mueble): Observable<Mueble> {
    return this.http.put<Mueble>(`${this.apiUrl}/${mueble.id}`, mueble);
  }
  
  eliminarMueble(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

  
