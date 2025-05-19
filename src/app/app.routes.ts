import { Routes } from '@angular/router';
import { IsLoggedOutGuard } from './auth/guards/is-logged-out.guard';
import { IsLoggedInGuard } from '@auth/guards/is-logged-in.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes),
    canMatch: [IsLoggedOutGuard],
  },
  {
    path: 'pleroma',
    loadChildren: () => import('./pleroma/pleroma.routes').then(r => r.pleromaRoutes),
    canMatch: [IsLoggedInGuard],
  },
  {
    path: '**',
    redirectTo: 'pleroma',
  },
];
