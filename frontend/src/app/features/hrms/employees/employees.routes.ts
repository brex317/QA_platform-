import { Routes } from '@angular/router';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./employee-profile/employee-profile.component').then(m => m.EmployeeProfileComponent)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./employee-onboarding/employee-onboarding.component').then(m => m.EmployeeOnboardingComponent)
  },
  {
    path: 'documents',
    loadComponent: () => import('./employee-documents/employee-documents.component').then(m => m.EmployeeDocumentsComponent)
  }
];
