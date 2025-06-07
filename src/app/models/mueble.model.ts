export interface Material {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  unidadDeMedida: string;
  stockActual: number;
}

export interface MaterialMueble {
  id: number;
  cantidadUtilizada: number;
  material: Material;
}

export interface Mueble {
  id?: number;  // id opcional para facilitar creación de nuevos muebles
  nombre: string;
  descripcion: string;
  precioVenta: number;
  stock: number;
  materialMuebles: MaterialMueble[];
}
