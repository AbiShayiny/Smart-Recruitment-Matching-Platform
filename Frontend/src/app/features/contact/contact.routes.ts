import { Routes } from '@angular/router';

export const CONTACT_ROUTES: Routes = [
  {
    path: 'contact-requests',
    loadComponent: () =>
      import('./pages/contact-requests/contact-requests').then(
        m => m.ContactRequests
      )
  },
  {
    path: '',
    redirectTo: 'contact-requests',
    pathMatch: 'full'
  }
];