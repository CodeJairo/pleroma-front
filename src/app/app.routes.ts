import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { authenticatedGuard } from './auth/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'pleroma',
    loadChildren: () =>
      import('./pleroma/pleroma.routes').then((r) => r.pleromaRoutes),
    canMatch: [authenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'pleroma',
  },
];
