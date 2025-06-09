export interface Proveedor {
  id?: number;
  nombre: string;
  rut: string;
  direccion: string;
  correo: string;
  telefono: string;
  materiales: MaterialSimpleProveedor[];
}

export interface MaterialSimpleProveedor {
  id: number;
  nombre: string;
  tipo: string;
}
