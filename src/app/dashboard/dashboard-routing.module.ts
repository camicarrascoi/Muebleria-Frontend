// src/app/dashboard/dashboard-routing.module.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MueblesComponent } from './muebles/muebles.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { VentasComponent } from './ventas/ventas.component';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'muebles', component: MueblesComponent },
      { path: 'materiales', component: MaterialesComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'ventas', component: VentasComponent },
      { path: '', redirectTo: 'muebles', pathMatch: 'full' }
    ]
  }
];
