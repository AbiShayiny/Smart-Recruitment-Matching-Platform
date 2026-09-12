import { Routes } from '@angular/router';

export const EMPLOYER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(
        m => m.Dashboard
      )
  },
  {
    path: 'company-profile',
    loadComponent: () =>
      import('./pages/company-profile/company-profile').then(
        m => m.CompanyProfile
      )
  },
  {
    path: 'vacancy-list',
    loadComponent: () =>
      import('./pages/vacancy-list/vacancy-list').then(
        m => m.VacancyList
      )
  },
  {
    path: 'vacancy-create',
    loadComponent: () =>
      import('./pages/vacancy-create/vacancy-create').then(
        m => m.VacancyCreate
      )
  },
  {
    path: 'vacancy-details',
    loadComponent: () =>
      import('./pages/vacancy-details/vacancy-details').then(
        m => m.VacancyDetails
      )
  },
  {
    path: 'vacancy-edit',
    loadComponent: () =>
      import('./pages/vacancy-edit/vacancy-edit').then(
        m => m.VacancyEdit
      )
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];