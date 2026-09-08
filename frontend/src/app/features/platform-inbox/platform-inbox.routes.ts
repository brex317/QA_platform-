import { Routes } from '@angular/router';

export const PLATFORM_INBOX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./platform-inbox.component').then(m => m.PlatformInboxComponent)
  }
];
