import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Importa RouterModule para <router-outlet>
  template: `
    <h1>Inventario Mueblería</h1>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
