import { Routes } from '@angular/router';

export const APPLICATIONS_ROUTES: Routes = [
  {
    path: 'applicants-list',
    loadComponent: () =>
      import('./pages/applicants-list/applicants-list').then(
        m => m.ApplicantsList
      )
  },
  {
    path: 'application-details',
    loadComponent: () =>
      import('./pages/application-details/application-details').then(
        m => m.ApplicationDetails
      )
  },
  {
    path: '',
    redirectTo: 'applicants-list',
    pathMatch: 'full'
  }
];