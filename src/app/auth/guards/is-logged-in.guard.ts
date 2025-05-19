import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const IsLoggedInGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return await firstValueFrom(
    authService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        console.log('IsLoggedInGuard:', isLoggedIn);
        if (isLoggedIn) return true;
        return router.createUrlTree(['auth/login']);
      })
    )
  );
};
