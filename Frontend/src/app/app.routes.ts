import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './features/auth/auth.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { adminGuard } from './core/guards/admin.guard';

import { EMPLOYER_ROUTES } from './features/employer/employer.routes';
import { APPLICATIONS_ROUTES } from './features/applications/applications.routes';
import { CONTACT_ROUTES } from './features/contact/contact.routes';
import { NOTIFICATIONS_ROUTES } from './features/notifications/notifications.routes';

export const routes: Routes = [

  // Authentication
  {
    path: 'auth',
    children: AUTH_ROUTES
  },

  // Admin
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: ADMIN_ROUTES
  },

  // Job Seeker
  {
    path: 'seeker',
    loadChildren: () =>
      import('./features/seeker/seeker.routes')
        .then(m => m.SEEKER_ROUTES)
  },

  // Employer
  {
    path: 'employer',
    children: EMPLOYER_ROUTES
  },

  // Applications
  {
    path: 'applications',
    children: APPLICATIONS_ROUTES
  },

  // Contact
  {
    path: 'contact',
    children: CONTACT_ROUTES
  },

  // Notifications
  {
    path: 'notifications',
    children: NOTIFICATIONS_ROUTES
  },

  // Default route
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];