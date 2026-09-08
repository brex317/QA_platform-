import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clearance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Clearance Setting</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure employee clearance workflows</p>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-dark-text">Clearance Templates</h2>
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Create Template
          </button>
        </div>

        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">No Clearance Templates</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Create your first clearance template</p>
        </div>
      </div>
    </div>
  `
})
export class ClearanceComponent {}
