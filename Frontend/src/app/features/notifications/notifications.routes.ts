import { Routes } from '@angular/router';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: 'notification-list',
    loadComponent: () =>
      import('./pages/notification-list/notification-list').then(
        m => m.NotificationList
      )
  },
  {
    path: '',
    redirectTo: 'notification-list',
    pathMatch: 'full'
  }
];