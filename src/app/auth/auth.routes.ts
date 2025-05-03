import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RecoverPageComponent } from './pages/recover-page/recover-page.component';

export const authRoutes: Routes = [
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
];
