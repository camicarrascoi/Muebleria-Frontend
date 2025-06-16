export interface VentaMueble {
  id: number | null;      // PK relación en BD (puede ser null si es nuevo)
  muebleId: number;       // FK al mueble
  nombre: string;         // Nombre para mostrar
  cantidad: number;       // Cantidad vendida
}

export interface Venta {
  id: number | null;
  fecha: Date | null;     // Date o null para manejo flexible
  total: number;
  ventaMuebles: VentaMueble[];
}

// Payload para backend
export interface VentaMueblePayload {
  mueble: { id: number };
  cantidad: number;
}

export interface VentaPayload {
  id?: number | null;
  fecha: string;  // YYYY-MM-DD
  ventaMuebles: VentaMueblePayload[];
}
