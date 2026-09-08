import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../../../../core/services/payroll.service';

@Component({
  selector: 'app-payroll-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1">
            <span>Home</span>
            <span>›</span>
            <span>HRMS</span>
            <span>›</span>
            <span>Payroll</span>
            <span>›</span>
            <span class="font-semibold text-gray-900 dark:text-dark-text">Dashboard</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">HRMS</h2>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">Payroll</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Dashboard - Overview of payroll runs, totals, and processing status.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            (click)="refreshData()"
            class="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-xs flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          
          <button 
            routerLink="/hrms/compensation/payroll/payroll-runs"
            class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium text-xs flex items-center gap-2 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Payroll runs
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards (5 Cards Matching Screenshot 5) -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Card 1: Total employees -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-dark-text">0</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Total employees</p>
            </div>
            <div class="w-10 h-10 bg-sky-50 dark:bg-sky-900/20 text-sky-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Active payroll period -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-dark-text">—</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Active payroll period</p>
            </div>
            <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Payroll runs -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-dark-text">0</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Payroll runs</p>
            </div>
            <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: Total gross pay -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xl font-bold text-gray-900 dark:text-dark-text">ETB 0</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Total gross pay</p>
            </div>
            <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 5: Total net pay -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xl font-bold text-gray-900 dark:text-dark-text">ETB 0</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Total net pay</p>
            </div>
            <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 2x2 Grid Analytics Panels (Matching Screenshot 5) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Panel 1: Payroll by department -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200/80 dark:border-dark-border">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-dark-text mb-6">Payroll by department</h4>
          <div class="flex items-center justify-center py-12 text-xs text-gray-400 font-medium">
            No data available.
          </div>
        </div>

        <!-- Panel 2: Payroll by month (gross) -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200/80 dark:border-dark-border">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-dark-text mb-6">Payroll by month (gross)</h4>
          <div class="flex items-center justify-center py-12 text-xs text-gray-400 font-medium">
            No data available.
          </div>
        </div>

        <!-- Panel 3: Earnings vs deductions -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200/80 dark:border-dark-border">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-dark-text mb-6">Earnings vs deductions</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Earnings</span>
              <div class="flex items-center gap-3 flex-1 mx-4">
                <div class="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full w-2 rounded-full"></div>
                </div>
              </div>
              <span class="text-gray-900 dark:text-dark-text font-bold">ETB 0</span>
            </div>
            
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Deductions</span>
              <div class="flex items-center gap-3 flex-1 mx-4">
                <div class="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full w-2 rounded-full"></div>
                </div>
              </div>
              <span class="text-gray-900 dark:text-dark-text font-bold">ETB 0</span>
            </div>
          </div>
        </div>

        <!-- Panel 4: Payroll status distribution -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200/80 dark:border-dark-border">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-dark-text mb-6">Payroll status distribution</h4>
          <div class="flex items-center justify-center py-12 text-xs text-gray-400 font-medium">
            No data available.
          </div>
        </div>
      </div>
    </div>
  `
})
export class PayrollDashboardComponent implements OnInit {
  summary: any = null;

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.payrollService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => console.error('Failed to load dashboard summary:', err)
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
