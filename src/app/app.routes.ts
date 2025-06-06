import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';  // Ajusta la ruta si es diferente
import { dashboardRoutes } from './dashboard/dashboard-routing.module';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  ...dashboardRoutes,  // Aquí incluyes las rutas hijas del dashboard
  { path: '**', redirectTo: 'login' }
];
