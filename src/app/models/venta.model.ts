export interface VentaMueble {
  id: number;           // obligatoria
  muebleId: number;     // obligatoria
  nombre: string;
  cantidad: number;
}

export interface Venta {
  id: number | null;
  fecha: Date;
  total: number;
  ventaMuebles: VentaMueble[];
}