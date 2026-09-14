import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const employerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getRole() === 'Employer') {
    return true;
  }

  if (!authService.isLoggedIn()) {
    authService.logout();
  }

  return router.createUrlTree(['/auth/login']);
};
