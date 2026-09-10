import { CanActivateFn } from '@angular/router';

export const employerGuard: CanActivateFn = (route, state) => {
  return true;
};
