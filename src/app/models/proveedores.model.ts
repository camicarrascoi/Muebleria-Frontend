import { Material } from './material.model';


export interface Proveedor {
  id?: number;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  fechaPedido?: string | Date;
  proveedorMateriales: ProveedorMaterial[];   // la propiedad que usarás en el template
}

export interface ProveedorMaterial {
  id?: number;
  material: MaterialSimpleProveedor;
  costoUnitario: number;
  cantidadSuministrada: number;
  fechaPedido?: string | Date; 
}

export interface MaterialSimpleProveedor {
  id: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
  unidadDeMedida?: string;
  stockActual?: number;
}
