export interface Venta {
  id: number | null;
  fecha: string | Date;
  total: number;
  ventaMuebles: VentaMueble[];
}

export interface VentaMueble {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  nombreMueble: string;
}

export interface VentaPayload {
  id?: number;
  fecha: string;
  ventaMuebles: VentaMueblePayload[];
}

export interface VentaMueblePayload {
  mueble: { id: number };
  cantidad: number;
}