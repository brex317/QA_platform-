import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your QA Platform ERP system
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Placeholder stat cards -->
        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-dark-text mt-2">1,234</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-dark-text mt-2">42</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-dark-text mt-2">87</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-dark-text mt-2">$52K</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-left">
            <div class="font-medium">Process Payroll</div>
            <div class="text-sm opacity-90 mt-1">Run monthly payroll</div>
          </button>
          <button class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-dark-text rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left">
            <div class="font-medium">View Reports</div>
            <div class="text-sm opacity-70 mt-1">Analytics & insights</div>
          </button>
          <button class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-dark-text rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left">
            <div class="font-medium">Manage Users</div>
            <div class="text-sm opacity-70 mt-1">User administration</div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
