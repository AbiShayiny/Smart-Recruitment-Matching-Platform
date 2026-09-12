import { Routes } from '@angular/router';

import { EMPLOYER_ROUTES } from './features/employer/employer.routes';
import { APPLICATIONS_ROUTES } from './features/applications/applications.routes';
import { CONTACT_ROUTES } from './features/contact/contact.routes';
import { NOTIFICATIONS_ROUTES } from './features/notifications/notifications.routes';

export const routes: Routes = [
  {
    path: 'employer',
    children: EMPLOYER_ROUTES
  },
  {
    path: 'applications',
    children: APPLICATIONS_ROUTES
  },
  {
    path: 'contact',
    children: CONTACT_ROUTES
  },
  {
    path: 'notifications',
    children: NOTIFICATIONS_ROUTES
  },
  {
    path: '',
    redirectTo: 'employer/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'employer/dashboard'
  }
];