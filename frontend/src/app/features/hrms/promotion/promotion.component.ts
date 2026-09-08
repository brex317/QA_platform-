import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Promotion Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage employee promotions and career progression</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
        </div>
        
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Under Review</div>
        </div>
        
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Approved</div>
        </div>
        
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="text-3xl font-bold text-gray-600 dark:text-gray-400">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">This Year</div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-dark-text">Promotion Records</h2>
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            New Promotion
          </button>
        </div>

        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">No Promotions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">No promotion records found</p>
        </div>
      </div>
    </div>
  `
})
export class PromotionComponent {}
