import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Proveedor } from '../../models/proveedores.model';

@Injectable({ providedIn: 'root' })
export class ProveedoresService {
  private apiUrl = 'http://localhost:8080/api/v1/proveedor';

  constructor(private http: HttpClient) {}

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  // Cambiado a (id, body) para coincidir con tu PUT en el back
  editarProveedor(
    id: number,
    body: {
      nombre: string;
      telefono: string;
      correo: string;
      direccion: string;
      proveedorMateriales: { material: { id: number }; costoUnitario: number }[];
    }
  ): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, body);
  }

  agregarProveedor(body: {
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
    proveedorMateriales: { material: { id: number }; costoUnitario: number }[];
  }): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, body);
  }

  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
