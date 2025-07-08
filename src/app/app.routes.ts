import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { dashboardRoutes } from './dashboard/dashboard-routing.module';
import { UsuarioComponent } from './dashboard/usuario/usuario.component'; //Importa el componente

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  //Ruta para crear cuenta (visible desde login)
  { path: 'usuario', component: UsuarioComponent },

  // Rutas del dashboard
  ...dashboardRoutes,

  // Redirección por defecto
  { path: '**', redirectTo: 'login' }
];
