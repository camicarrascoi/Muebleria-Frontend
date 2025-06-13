// src/app/dashboard/dashboard-routing.module.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'muebles',
        loadComponent: () => import('./muebles/muebles.component').then(m => m.MueblesComponent)
      },
      {
        path: 'materiales',
        loadComponent: () => import('./material/materiales.component').then(m => m.MaterialesComponent)
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./proveedores/proveedores.component').then(m => m.ProveedoresComponent)
      },
      {
        path: 'venta',
        loadComponent: () => import('./venta/venta.component').then(m => m.VentaComponent)
      },
      
    ]
  }
];
