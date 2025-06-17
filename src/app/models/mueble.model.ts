import { Material } from './material.model';

/**
 * Relaciona un Material con la cantidad utilizada para fabricar un Mueble.
 */
export interface MaterialMueble {
  id?: number;              // ID opcional para edición/eliminación en el backend
  cantidadUtilizada: number;
  material: Material;
}

/**
 * Representa un Mueble junto a los materiales necesarios para su producción.
 */
export interface Mueble {
  id?: number;              // ID opcional para facilitar la creación de nuevos muebles
  nombre: string;
  descripcion: string;
  precioVenta: number;
  stock: number;
  materialMuebles: MaterialMueble[];
}