import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PayrollService } from '../../../../../core/services/payroll.service';

@Component({
  selector: 'app-payroll-journals',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, BadgeComponent, DynamicTableComponent, PaginationComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Payroll Journals</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage accounting journals for payroll runs</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Post Journal
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card label="Total Journals" [value]="stats.total" icon="folder" iconColor="blue"></app-stat-card>
        <app-stat-card label="Draft" [value]="stats.draft" icon="chart" iconColor="yellow"></app-stat-card>
        <app-stat-card label="Posted" [value]="stats.posted" icon="check" iconColor="green"></app-stat-card>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select [(ngModel)]="filters.status" (change)="applyFilters()" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Posted">Posted</option>
              <option value="Reversed">Reversed</option>
            </select>
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="filters.withoutJournal" (change)="applyFilters()" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Runs without journal</span>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table [columns]="columns" [data]="paginatedData" [actions]="tableActions" emptyMessage="No payroll journals found"></app-dynamic-table>
        <app-pagination [currentPage]="pagination.currentPage" [pageSize]="pagination.pageSize" [totalItems]="pagination.totalItems" 
          (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"></app-pagination>
      </div>
    </div>

    <app-modal [isOpen]="isModalOpen" title="Post Payroll Journal" [confirmDisabled]="!isFormValid()" (close)="closeModal()" (confirm)="saveJournal()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payroll Run <span class="text-red-500">*</span></label>
          <select [(ngModel)]="formData.runId" name="runId" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="">Select run...</option>
            <option *ngFor="let run of payrollRuns" [value]="run.id">{{ run.runNumber }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Journal Date <span class="text-red-500">*</span></label>
          <input type="date" [(ngModel)]="formData.journalDate" name="journalDate" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Debit Amount (ETB) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.debitAmount" name="debitAmount" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credit Amount (ETB) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.creditAmount" name="creditAmount" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status <span class="text-red-500">*</span></label>
          <select [(ngModel)]="formData.status" name="status" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="Draft">Draft</option>
            <option value="Posted">Posted</option>
          </select>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class PayrollJournalsComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  payrollRuns: any[] = [];
  stats = { total: 0, draft: 0, posted: 0 };
  filters = { status: '', withoutJournal: false };
  pagination = { currentPage: 1, pageSize: 10, totalItems: 0 };
  isModalOpen = false;
  formData: any = this.getEmptyForm();

  constructor(private payrollService: PayrollService) {
    this.columns = [
      { key: 'runNumber', label: 'Run Number', sortable: true, width: '18%' },
      { key: 'journalDate', label: 'Journal Date', sortable: true, width: '15%' },
      { key: 'debitAmount', label: 'Debit (ETB)', sortable: true, width: '15%' },
      { key: 'creditAmount', label: 'Credit (ETB)', sortable: true, width: '15%' },
      { key: 'status', label: 'Status', sortable: true, width: '12%' },
      { key: 'createdAt', label: 'Created', sortable: true, width: '15%' },
      { key: 'createdBy', label: 'Created By', width: '10%' }
    ];
    this.tableActions = [
      { label: 'Post', onClick: (row: any) => this.postJournal(row), condition: (row: any) => row.status === 'Draft' },
      { label: 'Reverse', onClick: (row: any) => this.reverseJournal(row), condition: (row: any) => row.status === 'Posted' }
    ];
  }

  ngOnInit(): void {
    this.loadPayrollRuns();
    this.loadJournals();
  }

  loadPayrollRuns(): void {
    this.payrollService.getPayrollRuns().subscribe({
      next: (response) => { this.payrollRuns = response.filter((x: any) => x.status === 'Approved' || x.status === 'Paid') || []; },
      error: (err: any) => console.error('Failed to load payroll runs:', err)
    });
  }

  loadJournals(): void {
    this.payrollService.getPayrollJournals().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load journals:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.draft = this.data.filter(x => x.status === 'Draft').length;
    this.stats.posted = this.data.filter(x => x.status === 'Posted').length;
  }

  applyFilters(): void {
    let filtered = [...this.data];
    if (this.filters.status) {
      filtered = filtered.filter(x => x.status === this.filters.status);
    }
    this.filteredData = filtered;
    this.pagination.totalItems = filtered.length;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pagination.pageSize);
  }

  openModal(): void {
    this.formData = this.getEmptyForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formData = this.getEmptyForm();
  }

  saveJournal(): void {
    if (!this.isFormValid()) return;
    this.payrollService.createPayrollJournal(this.formData).subscribe({
      next: () => { this.closeModal(); this.loadJournals(); },
      error: (err) => console.error('Failed to save journal:', err)
    });
  }

  postJournal(row: any): void {
    this.payrollService.updateJournalStatus(row.id, 'Posted').subscribe({
      next: () => this.loadJournals(),
      error: (err: any) => console.error('Failed to post journal:', err)
    });
  }

  reverseJournal(row: any): void {
    this.payrollService.updateJournalStatus(row.id, 'Reversed').subscribe({
      next: () => this.loadJournals(),
      error: (err: any) => console.error('Failed to reverse journal:', err)
    });
  }

  isFormValid(): boolean {
    return !!(this.formData.runId && this.formData.journalDate && this.formData.debitAmount >= 0 && this.formData.creditAmount >= 0);
  }

  getEmptyForm(): any {
    return { runId: '', journalDate: new Date().toISOString().split('T')[0], debitAmount: 0, creditAmount: 0, status: 'Draft' };
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
    this.updatePaginatedData();
  }

  onPageSizeChange(size: number): void {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
    this.updatePaginatedData();
  }
}
