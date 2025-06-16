export interface Proveedor {
  id?: number;
  nombre: string;
  rut?: string;   // Si no usas rut, puede ser opcional
  direccion: string;
  correo: string;
  telefono: string;
  proveedorMateriales?: ProveedorMaterial[]; // para poder mapear
  materiales?: MaterialSimpleProveedor[];    // la propiedad que usarás en el template
}

export interface ProveedorMaterial {
  id: number;
  costoUnitario: number;
  material: MaterialSimpleProveedor;
}

export interface MaterialSimpleProveedor {
  id: number;
  nombre: string;
  tipo?: string;
  descripcion?: string;
  unidadDeMedida?: string;
  stockActual?: number;
}
