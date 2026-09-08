import { Routes } from '@angular/router';

export const FMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./fms.component').then(m => m.FmsComponent)
  }
];
