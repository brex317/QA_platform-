import { Routes } from '@angular/router';

export const REPORTS_ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reports-analytics.component').then(m => m.ReportsAnalyticsComponent)
  }
];
