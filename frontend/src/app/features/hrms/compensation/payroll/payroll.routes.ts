import { Routes } from '@angular/router';

export const PAYROLL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.PayrollDashboardComponent)
  },
  {
    path: 'allowance-types',
    loadComponent: () => import('./allowance-types/allowance-types.component').then(m => m.AllowanceTypesComponent)
  },
  {
    path: 'employee-allowances',
    loadComponent: () => import('./employee-allowances/employee-allowances.component').then(m => m.EmployeeAllowancesComponent)
  },
  {
    path: 'payroll-periods',
    loadComponent: () => import('./payroll-periods/payroll-periods.component').then(m => m.PayrollPeriodsComponent)
  },
  {
    path: 'tax-schedules',
    loadComponent: () => import('./tax-schedules/tax-schedules.component').then(m => m.TaxSchedulesComponent)
  },
  {
    path: 'pension-rules',
    loadComponent: () => import('./pension-rules/pension-rules.component').then(m => m.PensionRulesComponent)
  },
  {
    path: 'payroll-runs',
    loadComponent: () => import('./payroll-runs/payroll-runs.component').then(m => m.PayrollRunsComponent)
  },
  {
    path: 'payroll-journals',
    loadComponent: () => import('./payroll-journals/payroll-journals.component').then(m => m.PayrollJournalsComponent)
  },
  {
    path: 'payslips',
    loadComponent: () => import('./payslips/payslips.component').then(m => m.PayslipsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.PayrollReportsComponent)
  }
];
