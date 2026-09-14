import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.isProtectedApiRequest(req.url) && authService.isLoggedIn()) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${authService.getToken()}` } }));
  }
  return next(req);
};
