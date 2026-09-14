import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { UserManagement } from './pages/user-management/user-management';
import { Settings } from './pages/settings/settings';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'users',
    component: UserManagement
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'settings',
    component: Settings
  }
];
