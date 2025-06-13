// Modelo para uso interno / visualización en el frontend
export interface VentaMueble {
  id: number;           // PK de la relación en BD, puede ser 0 en nuevos
  muebleId: number;     // FK al mueble
  nombre: string;       // Nombre del mueble
  cantidad: number;     // Cantidad vendida
}

export interface Venta {
  id: number | null;
  fecha: Date;
  total: number;         // Calculado por el backend
  ventaMuebles: VentaMueble[];
}


// Tipos para enviar al backend
export interface VentaMueblePayload {
  muebles: { id: number };
  cantidad: number;
}

export interface VentaPayload {
  id?: number | null;
  fecha: Date;
  ventaMuebles: VentaMueblePayload[];
}