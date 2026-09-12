import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './features/auth/auth.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: 'auth',
    children: AUTH_ROUTES
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    children: ADMIN_ROUTES
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }

];