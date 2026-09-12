import { Routes } from '@angular/router';

import { EMPLOYER_ROUTES } from './features/employer/employer.routes';
import { APPLICATIONS_ROUTES } from './features/applications/applications.routes';
import { CONTACT_ROUTES } from './features/contact/contact.routes';
import { NOTIFICATIONS_ROUTES } from './features/notifications/notifications.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'seeker',
    pathMatch: 'full'
  },
  {
    path: 'seeker',
    loadChildren: () =>
      import('./features/seeker/seeker.routes')
        .then(m => m.SEEKER_ROUTES)
  },
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
    path: '**',
    redirectTo: 'seeker/find-jobs'
  }
];
