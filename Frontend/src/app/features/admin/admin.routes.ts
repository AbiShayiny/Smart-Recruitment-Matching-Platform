import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { UserManagement } from './pages/user-management/user-management';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'users',
    component: UserManagement
  },
  {
    path: 'dashboard',
    component: Dashboard
  }
];
