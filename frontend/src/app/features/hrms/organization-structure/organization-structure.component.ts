import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization-structure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Organization Structure</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Define and manage organizational hierarchy</p>
      </div>
      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-12">
        <div class="text-center">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-dark-text">Organization Structure Module</h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  `
})
export class OrganizationStructureComponent {}
