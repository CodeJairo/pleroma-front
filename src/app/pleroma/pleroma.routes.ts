import { Routes } from '@angular/router';
import { LayoutPageComponent } from './layouts/layout-page/layout-page.component';
import { HomePageComponent } from '../shared/pages/home-page/home-page.component';
import { NoAccessSubscriptionComponent } from '@shared/pages/no-access-subscription-page/no-access-subscription-page.component';

export const pleromaRoutes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'administrative',
        loadChildren: () => import('./administrative/administrative.routes').then(r => r.administrativeRoutes),
      },
      {
        path: '**',
        component: NoAccessSubscriptionComponent,
      },
    ],
  },
];
