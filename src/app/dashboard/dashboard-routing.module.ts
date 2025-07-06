// src/app/dashboard/dashboard-routing.module.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminGuard } from '../auth/admin.guards';

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
        loadComponent: () => import('./materiales/materiales.component').then(m => m.MaterialesComponent)
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./proveedores/proveedores.component').then(m => m.ProveedoresComponent)
      },
      {
        path: 'venta',
        loadComponent: () => import('./venta/venta.component').then(m => m.VentaComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pedidos/pedidos.component').then(m => m.PedidosComponent)
      },

      {
        path: 'usuarios/crear',
        loadComponent: () => import('./usuario/usuario.component').then(m => m.UsuarioComponent),
        canActivate: [AdminGuard]
      }


    ]
  }
];
