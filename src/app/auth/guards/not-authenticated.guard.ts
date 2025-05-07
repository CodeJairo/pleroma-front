import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {
  return true; // TODO: REMOVE THIS LINE WHEN THE GUARD IS IMPLEMENTED
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());
  if (isAuthenticated) {
    router.navigateByUrl('/pleroma');
  }
  return !isAuthenticated;
};
