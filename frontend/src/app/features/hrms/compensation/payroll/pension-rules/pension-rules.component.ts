import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card.component';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PayrollService } from '../../../../../core/services/payroll.service';

@Component({
  selector: 'app-pension-rules',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, DynamicTableComponent, PaginationComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Pension Rules</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage pension contribution rates by employment type</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Pension Rule
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card label="Total Rules" [value]="stats.total" icon="folder" iconColor="blue"></app-stat-card>
        <app-stat-card label="Active" [value]="stats.active" icon="check" iconColor="green"></app-stat-card>
        <app-stat-card label="Employment Types" [value]="stats.employmentTypes" icon="users" iconColor="purple"></app-stat-card>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table [columns]="columns" [data]="paginatedData" [actions]="tableActions" emptyMessage="No pension rules found"></app-dynamic-table>
        <app-pagination [currentPage]="pagination.currentPage" [pageSize]="pagination.pageSize" [totalItems]="pagination.totalItems" 
          (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"></app-pagination>
      </div>
    </div>

    <app-modal [isOpen]="isModalOpen" [title]="isEditMode ? 'Edit Pension Rule' : 'New Pension Rule'" 
      [confirmDisabled]="!isFormValid()" (close)="closeModal()" (confirm)="savePensionRule()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Type <span class="text-red-500">*</span></label>
          <select [(ngModel)]="formData.employmentType" name="employmentType" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Rate (%) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.employeeRatePercent" name="employeeRatePercent" min="0" max="100" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employer Rate (%) <span class="text-red-500">*</span></label>
            <input type="number" [(ngModel)]="formData.employerRatePercent" name="employerRatePercent" min="0" max="100" step="0.01" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
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
export class PensionRulesComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  stats = { total: 0, active: 0, employmentTypes: 0 };
  pagination = { currentPage: 1, pageSize: 10, totalItems: 0 };
  isModalOpen = false;
  isEditMode = false;
  formData: any = this.getEmptyForm();

  constructor(private payrollService: PayrollService) {
    this.columns = [
      { key: 'employmentType', label: 'Employment Type', sortable: true, width: '25%' },
      { key: 'employeeRatePercent', label: 'Employee Rate (%)', sortable: true, width: '20%' },
      { key: 'employerRatePercent', label: 'Employer Rate (%)', sortable: true, width: '20%' },
      { key: 'effectiveFrom', label: 'Effective From', sortable: true, width: '18%' },
      { key: 'isActive', label: 'Status', width: '17%' }
    ];
    this.tableActions = [
      { label: 'Edit', onClick: (row: any) => this.editPensionRule(row) },
      { label: 'Deactivate', onClick: (row: any) => this.toggleStatus(row), condition: (row: any) => row.isActive },
      { label: 'Activate', onClick: (row: any) => this.toggleStatus(row), condition: (row: any) => !row.isActive }
    ];
  }

  ngOnInit(): void { this.loadPensionRules(); }
  
  loadPensionRules(): void {
    this.payrollService.getPensionRules().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load pension rules:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.active = this.data.filter(x => x.isActive).length;
    this.stats.employmentTypes = new Set(this.data.map(x => x.employmentType)).size;
  }

  applyFilters(): void {
    this.filteredData = [...this.data];
    this.pagination.totalItems = this.filteredData.length;
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

  editPensionRule(row: any): void {
    this.isEditMode = true;
    this.formData = { ...row };
    this.isModalOpen = true;
  }

  savePensionRule(): void {
    if (!this.isFormValid()) return;
    const apiCall = this.isEditMode
      ? this.payrollService.updatePensionRule(this.formData.id, this.formData)
      : this.payrollService.createPensionRule(this.formData);
    apiCall.subscribe({
      next: () => { this.closeModal(); this.loadPensionRules(); },
      error: (err) => console.error('Failed to save pension rule:', err)
    });
  }

  toggleStatus(row: any): void {
    const updated = { ...row, isActive: !row.isActive };
    this.payrollService.updatePensionRule(row.id, updated).subscribe({
      next: () => this.loadPensionRules(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  isFormValid(): boolean {
    return !!(this.formData.employmentType && this.formData.employeeRatePercent >= 0 && this.formData.employerRatePercent >= 0);
  }

  getEmptyForm(): any {
    return { employmentType: 'Permanent', employeeRatePercent: 7, employerRatePercent: 11, effectiveFrom: new Date().toISOString().split('T')[0], isActive: true };
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
