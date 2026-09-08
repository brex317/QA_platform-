import { Routes } from '@angular/router';

export const SYSTEM_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./system-management.component').then(m => m.SystemManagementComponent)
  }
];
