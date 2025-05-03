import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RecoverPageComponent } from './pages/recover-page/recover-page.component';
import { AuthLayoutPageComponent } from './layout/auth-layout-page/auth-layout-page.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutPageComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'recover',
        component: RecoverPageComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
