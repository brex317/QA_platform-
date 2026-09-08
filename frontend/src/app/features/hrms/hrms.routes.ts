import { Routes } from '@angular/router';

export const HRMS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
  // Organization
  {
    path: 'organization',
    loadComponent: () => import('./organization/organization.component').then(m => m.OrganizationComponent)
  },
  // Employee Management
  {
    path: 'employees',
    loadChildren: () => import('./employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
  },
  // Settings
  {
    path: 'clearance',
    loadComponent: () => import('./clearance/clearance.component').then(m => m.ClearanceComponent)
  },
  {
    path: 'overtime',
    loadComponent: () => import('./overtime/overtime.component').then(m => m.OvertimeComponent)
  },
  {
    path: 'severance',
    loadComponent: () => import('./severance/severance.component').then(m => m.SeveranceComponent)
  },
  // Employee Operations
  {
    path: 'termination',
    loadComponent: () => import('./termination/termination.component').then(m => m.TerminationComponent)
  },
  {
    path: 'delegation',
    loadComponent: () => import('./delegation/delegation.component').then(m => m.DelegationComponent)
  },
  {
    path: 'recruitment',
    loadComponent: () => import('./recruitment/recruitment.component').then(m => m.RecruitmentComponent)
  },
  {
    path: 'promotion',
    loadComponent: () => import('./promotion/promotion.component').then(m => m.PromotionComponent)
  },
  // Performance Management
  {
    path: 'performance',
    loadComponent: () => import('./performance/performance.component').then(m => m.PerformanceComponent)
  },
  // Planning
  {
    path: 'workforce-planning',
    loadComponent: () => import('./workforce-planning/workforce-planning.component').then(m => m.WorkforcePlanningComponent)
  },
  // Inbox
  {
    path: 'inbox',
    loadComponent: () => import('./hrms-inbox/hrms-inbox.component').then(m => m.HrmsInboxComponent)
  },
  // Transfer
  {
    path: 'transfer',
    loadComponent: () => import('./transfer/transfer.component').then(m => m.TransferComponent)
  },
  // Leave Management
  {
    path: 'leave',
    loadComponent: () => import('./leave/leave.component').then(m => m.LeaveComponent)
  },
  // Attendance
  {
    path: 'attendance',
    loadComponent: () => import('./attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  // Documents
  {
    path: 'documents',
    loadComponent: () => import('./documents/documents.component').then(m => m.DocumentsComponent)
  },
  // Compensation (includes Payroll)
  {
    path: 'compensation/payroll',
    loadChildren: () => import('./compensation/payroll/payroll.routes').then(m => m.PAYROLL_ROUTES)
  },
  // Training
  {
    path: 'training',
    loadComponent: () => import('./training/training.component').then(m => m.TrainingComponent)
  }
];
