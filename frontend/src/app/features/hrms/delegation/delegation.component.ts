import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delegation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Delegation Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage authority delegation and acting assignments</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Delegations</div>
        </div>
        
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Approval</div>
        </div>
        
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Expired</div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-dark-text">Delegation List</h2>
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Create Delegation
          </button>
        </div>

        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">No Delegations</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">No authority delegations found</p>
        </div>
      </div>
    </div>
  `
})
export class DelegationComponent {}
