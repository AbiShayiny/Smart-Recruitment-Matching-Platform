import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const token = authService.getToken();

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.role === 'Administrator') {
      return true;
    }
  }

  router.navigate(['/auth/login']);
  return false;
};