import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly API = 'http://localhost:8080/api/v1/reporte';

  constructor(private http: HttpClient) {}

  descargarReporteCompleto() {
    return this.http.get(`${this.API}/completo`, {
      responseType: 'blob'
    });
  }
}