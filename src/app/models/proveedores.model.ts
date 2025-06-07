export interface Proveedor {
  id?: number; // <- el signo ? lo vuelve opcional
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
}