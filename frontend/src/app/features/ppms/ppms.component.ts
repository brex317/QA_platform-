import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ppms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Procurement & Project Management System (PPMS)</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage procurement and project operations</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Procurement -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Purchase Requests</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Manage purchase requisitions</p>
        </div>

        <!-- Purchase Orders -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Purchase Orders</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Create and manage POs</p>
        </div>

        <!-- Vendors -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Vendor Management</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Manage vendor information</p>
        </div>

        <!-- Projects -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Project Management</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Track projects and tasks</p>
        </div>

        <!-- Contracts -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Contract Management</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Manage contracts and agreements</p>
        </div>

        <!-- Inventory -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Inventory</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Track inventory and stock</p>
        </div>

        <!-- Bidding -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Bidding Process</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Manage bidding and RFQs</p>
        </div>

        <!-- Reports -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">PPMS Reports</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Generate procurement reports</p>
        </div>
      </div>
    </div>
  `
})
export class PpmsComponent {}
