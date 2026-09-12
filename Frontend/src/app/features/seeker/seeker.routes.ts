import { Routes } from '@angular/router';

export const SEEKER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'find-jobs',
    pathMatch: 'full'
  },

  {
    path: 'find-jobs',
    loadComponent: () =>
      import('../jobs/pages/job-search/job-search')
        .then(m => m.JobSearch)
  },

  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('../jobs/pages/job-details/job-details')
        .then(m => m.JobDetails)
  },

  {
    path: 'my-applications',
    loadComponent: () =>
      import('./pages/my-applications/my-applications')
        .then(m => m.MyApplications)
  },

  {
    path: 'my-profile',
    loadComponent: () =>
      import('./pages/profile/profile')
        .then(m => m.Profile)
  },

  {
    path: 'my-cv',
    loadComponent: () =>
      import('./pages/cv-upload/cv-upload')
        .then(m => m.CvUpload)
  },

  {
    path: 'contact-requests',
    loadComponent: () =>
      import('./pages/contact-requests/contact-requests')
        .then(m => m.ContactRequests)
  },

  {
    path: 'notifications',
    loadComponent: () =>
      import('../notifications/pages/notification-list/notification-list')
        .then(m => m.NotificationList)
  }
];