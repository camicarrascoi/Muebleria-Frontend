import { Proveedor } from './proveedores.model';
import { Mueble } from './mueble.model';

export interface Material {
  id: number | null;
  nombre: string;
  tipo: string;
  descripcion: string;
  unidadDeMedida: string;
  stockActual: number;
  proveedorMateriales: ProveedorSimple[];
  materialMuebles: MuebleMaterialSimple[];
}

export interface ProveedorSimple {
  id: number;
  costoUnitario: number;
  cantidadSuministrada: number;
  nombreProveedor: string;
}

export interface MuebleMaterialSimple {
  id: number;
  cantidadUtilizada: number;
  muebleNombre: string;
}

export interface MaterialRequest {
  id?: number | null;
  nombre: string;
  tipo: string;
  descripcion: string;
  unidadDeMedida: string;
  stockActual: number;
  proveedorIds?: number[];  // opcional
}