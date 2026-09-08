import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card.component';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PayrollService } from '../../../../../core/services/payroll.service';

@Component({
  selector: 'app-tax-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, DynamicTableComponent, PaginationComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Tax Schedules</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage tax brackets and rates</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Tax Bracket
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card label="Total Brackets" [value]="stats.total" icon="chart" iconColor="blue"></app-stat-card>
        <app-stat-card label="Active" [value]="stats.active" icon="check" iconColor="green"></app-stat-card>
        <app-stat-card label="Highest Rate" [value]="stats.highestRate + '%'" icon="chart" iconColor="red"></app-stat-card>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <input type="text" [(ngModel)]="searchQuery" (input)="applyFilters()" placeholder="Search brackets..." 
          class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table [columns]="columns" [data]="paginatedData" [actions]="tableActions" emptyMessage="No tax schedules found"></app-dynamic-table>
        <app-pagination [currentPage]="pagination.currentPage" [pageSize]="pagination.pageSize" [totalItems]="pagination.totalItems" 
          (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"></app-pagination>
      </div>
    </div>

    <app-modal [isOpen]="isModalOpen" [title]="isEditMode ? 'Edit Tax Bracket' : 'New Tax Bracket'" 
      [confirmDisabled]="!isFormValid()" (close)="closeModal()" (confirm)="saveTaxSchedule()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order <span class="text-red-500">*</span></label>
          <input type="number" [(ngModel)]="formData.orderNo" name="orderNo" min="1" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Amount (ETB) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.fromAmount" name="fromAmount" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Amount (ETB)</label>
            <input type="number" [(ngModel)]="formData.toAmount" name="toAmount" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500" placeholder="Leave empty for unlimited">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (%) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.ratePercent" name="ratePercent" min="0" max="100" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gov Deduction (ETB) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.govDeduction" name="govDeduction" min="0" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Effective From</label>
          <input type="date" [(ngModel)]="formData.effectiveFrom" name="effectiveFrom" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" [(ngModel)]="formData.isActive" name="isActive" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
          </label>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class TaxSchedulesComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  searchQuery = '';
  stats = { total: 0, active: 0, highestRate: 0 };
  pagination = { currentPage: 1, pageSize: 10, totalItems: 0 };
  isModalOpen = false;
  isEditMode = false;
  formData: any = this.getEmptyForm();

  constructor(private payrollService: PayrollService) {
    this.columns = [
      { key: 'orderNo', label: 'Order', sortable: true, width: '10%' },
      { key: 'fromAmount', label: 'From (ETB)', sortable: true, width: '15%' },
      { key: 'toAmount', label: 'To (ETB)', sortable: true, width: '15%' },
      { key: 'ratePercent', label: 'Rate (%)', sortable: true, width: '12%' },
      { key: 'govDeduction', label: 'Gov Deduction (ETB)', sortable: true, width: '18%' },
      { key: 'effectiveFrom', label: 'Effective From', sortable: true, width: '15%' },
      { key: 'isActive', label: 'Status', width: '15%' }
    ];
    this.tableActions = [
      { label: 'Edit', onClick: (row: any) => this.editTaxSchedule(row) },
      { label: 'Deactivate', onClick: (row: any) => this.toggleStatus(row), condition: (row: any) => row.isActive },
      { label: 'Activate', onClick: (row: any) => this.toggleStatus(row), condition: (row: any) => !row.isActive }
    ];
  }

  ngOnInit(): void { this.loadTaxSchedules(); }
  
  loadTaxSchedules(): void {
    this.payrollService.getTaxSchedules().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load tax schedules:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.active = this.data.filter(x => x.isActive).length;
    this.stats.highestRate = Math.max(...this.data.map(x => x.ratePercent || 0), 0);
  }

  applyFilters(): void {
    let filtered = [...this.data];
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(x => 
        x.orderNo?.toString().includes(query) || 
        x.ratePercent?.toString().includes(query)
      );
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

  editTaxSchedule(row: any): void {
    this.isEditMode = true;
    this.formData = { ...row };
    this.isModalOpen = true;
  }

  saveTaxSchedule(): void {
    if (!this.isFormValid()) return;
    const apiCall = this.isEditMode
      ? this.payrollService.updateTaxSchedule(this.formData.id, this.formData)
      : this.payrollService.createTaxSchedule(this.formData);
    apiCall.subscribe({
      next: () => { this.closeModal(); this.loadTaxSchedules(); },
      error: (err) => console.error('Failed to save tax schedule:', err)
    });
  }

  toggleStatus(row: any): void {
    const updated = { ...row, isActive: !row.isActive };
    this.payrollService.updateTaxSchedule(row.id, updated).subscribe({
      next: () => this.loadTaxSchedules(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  isFormValid(): boolean {
    return !!(this.formData.orderNo && this.formData.fromAmount >= 0 && this.formData.ratePercent >= 0 && this.formData.govDeduction >= 0);
  }

  getEmptyForm(): any {
    return { orderNo: 1, fromAmount: 0, toAmount: null, ratePercent: 0, govDeduction: 0, effectiveFrom: new Date().toISOString().split('T')[0], isActive: true };
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
