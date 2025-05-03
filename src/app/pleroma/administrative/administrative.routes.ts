import { Routes } from '@angular/router';
import { CreateContractorPageComponent } from './pages/create-contractor-page/create-contractor-page.component';
import { BudgetInformationPageComponent } from './pages/budget-information-page/budget-information-page.component';
import { MasterInfoPageComponent } from './pages/master-info-page/master-info-page.component';
import { AdministrativeLayoutPageComponent } from './layout/administrative-layout-page/administrative-layout-page.component';

export const administrativeRoutes: Routes = [
  {
    path: '',
    component: AdministrativeLayoutPageComponent,
    children: [
      {
        path: 'create-contractor',
        component: CreateContractorPageComponent,
      },
      {
        path: 'budget-information',
        component: BudgetInformationPageComponent,
      },
      {
        path: 'master-info',
        component: MasterInfoPageComponent,
      },
      {
        path: '**',
        redirectTo: 'create-contractor',
      },
    ],
  },
];
