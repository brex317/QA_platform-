import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'platform',
        loadChildren: () => import('./features/platform/platform.routes').then(m => m.PLATFORM_ROUTES)
      },
      {
        path: 'hrms',
        loadChildren: () => import('./features/hrms/hrms.routes').then(m => m.HRMS_ROUTES)
      },
      {
        path: 'platform-inbox',
        loadChildren: () => import('./features/platform-inbox/platform-inbox.routes').then(m => m.PLATFORM_INBOX_ROUTES)
      },
      {
        path: 'fms',
        loadChildren: () => import('./features/fms/fms.routes').then(m => m.FMS_ROUTES)
      },
      {
        path: 'ppms',
        loadChildren: () => import('./features/ppms/ppms.routes').then(m => m.PPMS_ROUTES)
      },
      {
        path: 'reports-analytics',
        loadChildren: () => import('./features/reports-analytics/reports-analytics.routes').then(m => m.REPORTS_ANALYTICS_ROUTES)
      },
      {
        path: 'tenant',
        loadChildren: () => import('./features/tenant/tenant.routes').then(m => m.TENANT_ROUTES)
      },
      {
        path: 'workflow',
        loadChildren: () => import('./features/workflow/workflow.routes').then(m => m.WORKFLOW_ROUTES)
      },
      {
        path: 'notification',
        loadChildren: () => import('./features/notification/notification.routes').then(m => m.NOTIFICATION_ROUTES)
      },
      {
        path: 'system-management',
        loadChildren: () => import('./features/system-management/system-management.routes').then(m => m.SYSTEM_MANAGEMENT_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
