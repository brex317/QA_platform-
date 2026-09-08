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
  selector: 'app-payroll-runs',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, BadgeComponent, DynamicTableComponent, PaginationComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Payroll Runs</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage payroll processing runs</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Payroll Run
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card label="Total Runs" [value]="stats.total" icon="folder" iconColor="blue"></app-stat-card>
        <app-stat-card label="In Progress" [value]="stats.inProgress" icon="chart" iconColor="yellow"></app-stat-card>
        <app-stat-card label="Paid" [value]="stats.paid" icon="check" iconColor="green"></app-stat-card>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select [(ngModel)]="filters.status" (change)="applyFilters()" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
            <option value="Reversed">Reversed</option>
          </select>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table [columns]="columns" [data]="paginatedData" [actions]="tableActions" emptyMessage="No payroll runs found"></app-dynamic-table>
        <app-pagination [currentPage]="pagination.currentPage" [pageSize]="pagination.pageSize" [totalItems]="pagination.totalItems" 
          (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"></app-pagination>
      </div>
    </div>

    <app-modal [isOpen]="isModalOpen" [title]="isEditMode ? 'Edit Payroll Run' : 'Create Payroll Run'" 
      [confirmDisabled]="!isFormValid()" (close)="closeModal()" (confirm)="savePayrollRun()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Run Number <span class="text-red-500">*</span></label>
          <input type="text" [(ngModel)]="formData.runNumber" name="runNumber" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500" placeholder="e.g., RUN-2026-12">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period <span class="text-red-500">*</span></label>
          <select [(ngModel)]="formData.periodId" name="periodId" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="">Select period...</option>
            <option *ngFor="let period of periods" [value]="period.id">{{ period.code }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status <span class="text-red-500">*</span></label>
          <select [(ngModel)]="formData.status" name="status" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
            <option value="Reversed">Reversed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Employees</label>
          <input type="number" [(ngModel)]="formData.totalEmployees" name="totalEmployees" min="0" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gross Amount (ETB)</label>
            <input type="number" [(ngModel)]="formData.grossAmount" name="grossAmount" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Net Amount (ETB)</label>
            <input type="number" [(ngModel)]="formData.netAmount" name="netAmount" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class PayrollRunsComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  periods: any[] = [];
  stats = { total: 0, inProgress: 0, paid: 0 };
  filters = { status: '' };
  pagination = { currentPage: 1, pageSize: 10, totalItems: 0 };
  isModalOpen = false;
  isEditMode = false;
  formData: any = this.getEmptyForm();

  constructor(private payrollService: PayrollService) {
    this.columns = [
      { key: 'runNumber', label: 'Run Number', sortable: true, width: '15%' },
      { key: 'periodCode', label: 'Period', sortable: true, width: '12%' },
      { key: 'totalEmployees', label: 'Employees', sortable: true, width: '12%' },
      { key: 'grossAmount', label: 'Gross Amount', sortable: true, width: '15%' },
      { key: 'netAmount', label: 'Net Amount', sortable: true, width: '15%' },
      { key: 'status', label: 'Status', sortable: true, width: '13%' },
      { key: 'createdAt', label: 'Created', sortable: true, width: '18%' }
    ];
    this.tableActions = [
      { label: 'View Details', onClick: (row: any) => this.viewDetails(row) },
      { label: 'Edit', onClick: (row: any) => this.editPayrollRun(row), condition: (row: any) => row.status === 'Draft' },
      { label: 'Submit', onClick: (row: any) => this.changeStatus(row, 'Submitted'), condition: (row: any) => row.status === 'Draft' },
      { label: 'Approve', onClick: (row: any) => this.changeStatus(row, 'Approved'), condition: (row: any) => row.status === 'Submitted' },
      { label: 'Mark as Paid', onClick: (row: any) => this.changeStatus(row, 'Paid'), condition: (row: any) => row.status === 'Approved' },
      { label: 'Reverse', onClick: (row: any) => this.changeStatus(row, 'Reversed'), condition: (row: any) => row.status === 'Paid' }
    ];
  }

  ngOnInit(): void {
    this.loadPeriods();
    this.loadPayrollRuns();
  }

  loadPeriods(): void {
    this.payrollService.getPayrollPeriods().subscribe({
      next: (response) => { this.periods = response.filter((x: any) => x.status === 'Open') || []; },
      error: (err: any) => console.error('Failed to load periods:', err)
    });
  }

  loadPayrollRuns(): void {
    this.payrollService.getPayrollRuns().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load payroll runs:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.inProgress = this.data.filter(x => ['Draft', 'Submitted', 'Approved'].includes(x.status)).length;
    this.stats.paid = this.data.filter(x => x.status === 'Paid').length;
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
    this.isEditMode = false;
    this.formData = this.getEmptyForm();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formData = this.getEmptyForm();
  }

  editPayrollRun(row: any): void {
    this.isEditMode = true;
    this.formData = { ...row };
    this.isModalOpen = true;
  }

  savePayrollRun(): void {
    if (!this.isFormValid()) return;
    const apiCall = this.isEditMode
      ? this.payrollService.updatePayrollRun(this.formData.id, this.formData)
      : this.payrollService.createPayrollRun(this.formData);
    apiCall.subscribe({
      next: () => { this.closeModal(); this.loadPayrollRuns(); },
      error: (err: any) => console.error('Failed to save payroll run:', err)
    });
  }

  changeStatus(row: any, newStatus: string): void {
    this.payrollService.updatePayrollRunStatus(row.id, newStatus).subscribe({
      next: () => this.loadPayrollRuns(),
      error: (err: any) => console.error('Failed to change status:', err)
    });
  }

  viewDetails(row: any): void {
    console.log('View details for:', row);
  }

  isFormValid(): boolean {
    return !!(this.formData.runNumber?.trim() && this.formData.periodId && this.formData.status);
  }

  getEmptyForm(): any {
    return { runNumber: '', periodId: '', status: 'Draft', totalEmployees: 0, grossAmount: 0, netAmount: 0 };
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
