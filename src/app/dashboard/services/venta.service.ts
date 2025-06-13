import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaPayload } from '../../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:8080/api/v1/ventas';

  constructor(private http: HttpClient) {}

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  crearVenta(payload: VentaPayload): Observable<Venta> {
    // El backend calcula el total y devuelve la venta completa
    return this.http.post<Venta>(this.apiUrl, payload);
  }

  editarVenta(payload: VentaPayload): Observable<Venta> {
    // Asume que payload.id está definido para editar
    return this.http.put<Venta>(`${this.apiUrl}/${payload.id}`, payload);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}