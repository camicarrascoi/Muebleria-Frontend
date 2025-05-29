import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AdminGuard } from './guards/admin.guard';
import { UsuarioGuard } from './guards/usuario.guard';

import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { StockComponent } from './shared/stock.component';
import { VentasReportComponent } from './shared/ventas-report.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'stock', component: StockComponent },
      { path: 'ventas', component: VentasReportComponent }
    ]
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [UsuarioGuard],
    children: [
      { path: '', redirectTo: 'stock', pathMatch: 'full' },
      { path: 'stock', component: StockComponent },
      { path: 'ventas', component: VentasReportComponent }
    ]
  }
];
