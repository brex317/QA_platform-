import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-documents',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Employee Documents</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage official contracts, certificates, and compliance records</p>
        </div>
        <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let doc of mockDocs" class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-200 dark:border-dark-border flex items-start gap-4">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 dark:text-dark-text text-sm">{{ doc.title }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ doc.category }} • {{ doc.size }}</p>
            <p class="text-xs text-gray-400 mt-2">Uploaded: {{ doc.date }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeDocumentsComponent {
  mockDocs = [
    { title: 'Employment Agreement Standard.pdf', category: 'Contract', size: '1.2 MB', date: '2025-01-15' },
    { title: 'Tax Exemption Form 2025.pdf', category: 'Tax', size: '450 KB', date: '2025-02-01' },
    { title: 'ID Verification Scan.pdf', category: 'Identity', size: '2.1 MB', date: '2025-01-10' }
  ];
}
