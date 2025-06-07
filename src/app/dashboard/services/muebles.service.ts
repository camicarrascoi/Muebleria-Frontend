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
}