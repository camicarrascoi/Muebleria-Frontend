import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';  // Ajusta la ruta si es diferente
import { dashboardRoutes } from './dashboard/dashboard-routing.module';
import { UsuarioComponent } from './dashboard/usuario/usuario.component';  

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'usuario', component: UsuarioComponent },
  ...dashboardRoutes,  // Aquí incluyes las rutas hijas del dashboard
  { path: '**', redirectTo: 'login' }
];
