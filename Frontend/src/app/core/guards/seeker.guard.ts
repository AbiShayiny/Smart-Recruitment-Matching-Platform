import { CanActivateFn } from '@angular/router';

export const seekerGuard: CanActivateFn = (route, state) => {
  return true;
};
