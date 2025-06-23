export interface Venta {
  id: number | null;
  fecha: string | Date;
  total: number;
  ventaMuebles: VentaMueble[];    // ahora con la nueva forma
}

export interface VentaMueble {
  mueble: { id: number }; 
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
  nombreMueble?: string;
}

export interface VentaPayload {
  id?: number;
  fecha: string;
  total?: number;                // puede calcularlo el backend
  ventaMuebles: VentaMueblePayload[];
}

export interface VentaMueblePayload {
  mueble: { id: number };
  cantidad: number;
  id?: number;
}
