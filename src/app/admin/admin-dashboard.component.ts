import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <h2>Panel de administración</h2>
    <p>Aquí puedes gestionar muebles, proveedores, materiales, balances, etc.</p>
  `
})
export class AdminDashboardComponent {}
