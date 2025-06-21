import { Material } from './material.model';

export interface Proveedor {
  id?: number;
  nombre: string;
  rut?: string;  //opcional
  direccion: string;
  correo: string;
  telefono: string;
  fechaPedido?: Date;  
  proveedorMateriales?: ProveedorMaterial[]; // para poder mapear
  materiales?: MaterialSimpleProveedor[];    // la propiedad que usarás en el template
}

export interface ProveedorMaterial {
  id?: number; // ← ahora es opcional
  material: Material;
  costoUnitario: number;
  cantidadSolicitada?: number;
}

export interface MaterialSimpleProveedor {
  id: number;
  nombre: string;
  tipo?: string;
  descripcion?: string;
  unidadDeMedida?: string;
  stockActual?: number;
}
