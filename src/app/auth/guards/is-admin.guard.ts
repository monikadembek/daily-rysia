import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { from, map } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.retrieveUserFromStorage()).pipe(
    map(() => {
      const isAdmin = authService.isAdmin;
      if (!isAdmin) {
        const loginPath = router.parseUrl('/auth');
        return new RedirectCommand(loginPath);
      }
      return isAdmin;
    }),
  );
};
