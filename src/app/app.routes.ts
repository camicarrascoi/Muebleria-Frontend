import { Routes } from '@angular/router';
import { LoginComponent }      from './auth/login/login.component';
import { dashboardRoutes }     from './dashboard/dashboard-routing.module';

export const routes: Routes = [
  { path: '',        redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',   component: LoginComponent },

  // Ya no existe: { path: 'usuario', component: UsuarioComponent },

  // Todas las rutas de /dashboard, incluyendo usuarios/crear con AdminGuard
  ...dashboardRoutes,

  // Cualquier otra URL, redirige a login
  { path: '**', redirectTo: 'login' }
];