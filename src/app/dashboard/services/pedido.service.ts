import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PedidoMaterialDTO {
  materialId: number;
  cantidad: number;
  costoUnitario: number;
}

interface PedidoDTO {
  proveedorId: number;
  fechaPedido: string; // formato 'yyyy-MM-dd'
  materiales: PedidoMaterialDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly API = 'http://localhost:8080/api/v1/pedidos'; // Asegúrate que esta ruta exista en el backend

  constructor(private http: HttpClient) {}

  crearPedido(pedido: PedidoDTO): Observable<any> {
    return this.http.post(`${this.API}`, pedido);
  }

  obtenerPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}`);
  }

  // Si después necesitas editar o eliminar, puedes agregar más métodos aquí
}
