import { Routes } from '@angular/router';

export const PPMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ppms.component').then(m => m.PpmsComponent)
  }
];
