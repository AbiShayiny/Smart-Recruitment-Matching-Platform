import { Routes } from '@angular/router';

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
    path: '**',
    redirectTo: 'seeker/find-jobs'
  }
];