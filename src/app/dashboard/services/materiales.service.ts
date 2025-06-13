import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Material } from '../../models/material.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private apiUrl = 'http://localhost:8080/api/v1/materiales'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  obtenerMateriales(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl).pipe(
      tap(data => console.log('Materiales recibidos:', data)) // Aquí logueamos los datos
    );
  }

  obtenerMaterialPorId(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/${id}`);
  }

  agregarMaterial(material: Material): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, material);
  }

  editarMaterial(id: number, material: Material): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/${id}`, material);
  }

  eliminarMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
