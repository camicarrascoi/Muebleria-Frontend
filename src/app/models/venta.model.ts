export interface VentaMueble {
  id: number;
  nombre: string;
  cantidad: number;
}

export interface Venta {
  id?: number;
  fecha: string;
  total: number;
  ventaMuebles: VentaMueble[];
}
