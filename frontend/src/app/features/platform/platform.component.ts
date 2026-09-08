import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Platform Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage platform settings and configurations</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- System Configuration -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text">System Configuration</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure system-wide settings and preferences</p>
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">Configure →</button>
        </div>

        <!-- User Management -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text">User Management</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Manage platform users and access rights</p>
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">Manage Users →</button>
        </div>

        <!-- Platform Settings -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text">Platform Settings</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure platform appearance and behavior</p>
          <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">Settings →</button>
        </div>
      </div>
    </div>
  `
})
export class PlatformComponent {}
