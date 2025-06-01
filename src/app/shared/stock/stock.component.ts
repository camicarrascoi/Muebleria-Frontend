import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule aquí

@Component({
  selector: 'app-stock',
  standalone: true, // indica que es standalone
  imports: [CommonModule],  // importa CommonModule para *ngFor
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  muebles = [
    {
      id: 1,
      nombre: 'Silla Modelo A',
      descripcion: 'Silla de madera con respaldo alto',
      categoria: 'Sillas',
      precioVenta: 120000,
      stock: 25
    },
    {
      id: 2,
      nombre: 'Mesa Rústica',
      descripcion: 'Mesa grande de comedor estilo rústico',
      categoria: 'Mesas',
      precioVenta: 350000,
      stock: 10
    },
    {
      id: 3,
      nombre: 'Banco Bajo',
      descripcion: 'Banco pequeño para terraza',
      categoria: 'Bancos',
      precioVenta: 80000,
      stock: 40
    }
  ];
}
