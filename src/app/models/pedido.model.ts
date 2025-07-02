export interface Material {
  id?: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  unidadDeMedida: string;
  stockActual: number;
}

export interface ProveedorMaterial {
  id?: number;
  costoUnitario: number;
  cantidadSuministrada: number;
  material: Material;
}

export interface Proveedor {
  id?: number;
  nombre: string;
  telefono: string;
  direccion: string;
  proveedorMateriales: ProveedorMaterial[];
}

export interface PedidoItem {
  id: number;
  cantidadSuministrada: number;
  costoUnitario: number;
  material: Material;
}

export interface Pedido {
  id?: number;
  fechaPedido: Date | string;
  proveedor: Proveedor;
  items: PedidoItem[];
  cantidadPedido?: number;
  costoTotal?: number;
  detalleCantidades?: {
    nombreMaterial: string;
    cantidad: number;
  }[];
}