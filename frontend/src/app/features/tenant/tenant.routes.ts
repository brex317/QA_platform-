import { Routes } from '@angular/router';

export const TENANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tenant.component').then(m => m.TenantComponent)
  }
];
