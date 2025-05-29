import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AdminGuard } from './guards/admin.guard';
import { UsuarioGuard } from './guards/usuario.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [UsuarioGuard] },
];
