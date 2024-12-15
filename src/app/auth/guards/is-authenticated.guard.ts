import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.retrieveUserFromStorage()).pipe(
    switchMap(() => authService.isUserAuthenticated$),
    map((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        const loginPath = router.parseUrl('/auth');
        return new RedirectCommand(loginPath);
      }
      return isAuthenticated;
    }),
  );
};
