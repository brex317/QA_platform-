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
  selector: 'app-payroll-periods',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    BadgeComponent,
    DynamicTableComponent,
    PaginationComponent,
    ModalComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Payroll Periods</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage payroll processing periods
          </p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Period
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card
          label="Total Periods"
          [value]="stats.total"
          icon="calendar"
          iconColor="blue">
        </app-stat-card>

        <app-stat-card
          label="Open Periods"
          [value]="stats.open"
          icon="folder"
          iconColor="green">
        </app-stat-card>

        <app-stat-card
          label="Closed Periods"
          [value]="stats.closed"
          icon="check"
          iconColor="gray">
        </app-stat-card>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              [(ngModel)]="filters.status"
              (change)="applyFilters()"
              class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table
          [columns]="columns"
          [data]="paginatedData"
          [actions]="tableActions"
          emptyMessage="No payroll periods found">
        </app-dynamic-table>

        <app-pagination
          [currentPage]="pagination.currentPage"
          [pageSize]="pagination.pageSize"
          [totalItems]="pagination.totalItems"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Payroll Period' : 'New Payroll Period'"
      [confirmDisabled]="!isFormValid()"
      (close)="closeModal()"
      (confirm)="savePeriod()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Code <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            [(ngModel)]="formData.code"
            name="code"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., 2026-12">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            [(ngModel)]="formData.startDate"
            name="startDate"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            [(ngModel)]="formData.endDate"
            name="endDate"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status <span class="text-red-500">*</span>
          </label>
          <select
            [(ngModel)]="formData.status"
            name="status"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isActive"
              name="isActive"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
          </label>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class PayrollPeriodsComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  stats = { total: 0, open: 0, closed: 0 };
  
  filters = {
    status: ''
  };

  pagination = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  };

  isModalOpen = false;
  isEditMode = false;
  formData: any = this.getEmptyForm();

  constructor(private payrollService: PayrollService) {
    this.initializeColumns();
    this.initializeTableActions();
  }

  ngOnInit(): void {
    this.loadPayrollPeriods();
  }

  initializeColumns(): void {
    this.columns = [
      { key: 'code', label: 'Code', sortable: true, width: '20%' },
      { key: 'startDate', label: 'Start Date', sortable: true, width: '20%' },
      { key: 'endDate', label: 'End Date', sortable: true, width: '20%' },
      { key: 'status', label: 'Status', sortable: true, width: '15%' },
      { key: 'isActive', label: 'Active', width: '15%' },
      { key: 'createdAt', label: 'Created', sortable: true, width: '10%' }
    ];
  }

  initializeTableActions(): void {
    this.tableActions = [
      {
        label: 'Edit',
        onClick: (row: any) => this.editPeriod(row)
      },
      {
        label: 'Close Period',
        onClick: (row: any) => this.closePeriod(row),
        condition: (row: any) => row.status === 'Open'
      },
      {
        label: 'Reopen Period',
        onClick: (row: any) => this.reopenPeriod(row),
        condition: (row: any) => row.status === 'Closed'
      }
    ];
  }

  loadPayrollPeriods(): void {
    this.payrollService.getPayrollPeriods().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load payroll periods:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.open = this.data.filter(x => x.status === 'Open').length;
    this.stats.closed = this.data.filter(x => x.status === 'Closed').length;
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
    const end = start + this.pagination.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  openModal(): void {
    this.isEditMode = false;
    this.formData = this.getEmptyForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formData = this.getEmptyForm();
  }

  editPeriod(row: any): void {
    this.isEditMode = true;
    this.formData = { ...row };
    this.isModalOpen = true;
  }

  savePeriod(): void {
    if (!this.isFormValid()) return;

    const apiCall = this.isEditMode
      ? this.payrollService.updatePayrollPeriod(this.formData.id, this.formData)
      : this.payrollService.createPayrollPeriod(this.formData);

    apiCall.subscribe({
      next: () => {
        this.closeModal();
        this.loadPayrollPeriods();
      },
      error: (err) => console.error('Failed to save payroll period:', err)
    });
  }

  closePeriod(row: any): void {
    const updated = { ...row, status: 'Closed' };
    this.payrollService.updatePayrollPeriod(row.id, updated).subscribe({
      next: () => this.loadPayrollPeriods(),
      error: (err) => console.error('Failed to close period:', err)
    });
  }

  reopenPeriod(row: any): void {
    const updated = { ...row, status: 'Open' };
    this.payrollService.updatePayrollPeriod(row.id, updated).subscribe({
      next: () => this.loadPayrollPeriods(),
      error: (err) => console.error('Failed to reopen period:', err)
    });
  }

  isFormValid(): boolean {
    return !!(
      this.formData.code?.trim() &&
      this.formData.startDate &&
      this.formData.endDate &&
      this.formData.status
    );
  }

  getEmptyForm(): any {
    return {
      code: '',
      startDate: '',
      endDate: '',
      status: 'Open',
      isActive: true
    };
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
