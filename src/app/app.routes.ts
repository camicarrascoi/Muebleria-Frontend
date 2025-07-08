import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { dashboardRoutes } from './dashboard/dashboard-routing.module';
import { UsuarioComponent } from './dashboard/usuario/usuario.component'; // bien importado

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Ruta para crear cuenta desde el login
  { path: 'usuario', component: UsuarioComponent },

  // Rutas del dashboard (incluye crear usuario dentro del panel)
  ...dashboardRoutes,

  { path: '**', redirectTo: 'login' }
];
