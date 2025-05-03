import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: 'pleroma',
    loadChildren: () =>
      import('./pleroma/pleroma.routes').then((r) => r.pleromaRoutes),
  },
  {
    path: '**',
    redirectTo: 'pleroma',
  },
];
