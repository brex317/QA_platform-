import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PayrollService } from '../../../../../core/services/payroll.service';
import { HelpFieldDirective } from '../../../../../shared/directives/help-field.directive';

@Component({
  selector: 'app-allowance-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    BadgeComponent,
    DynamicTableComponent,
    PaginationComponent,
    ModalComponent,
    HelpFieldDirective
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Allowance Types</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage earning and deduction components
          </p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Allowance Type
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card
          label="Total Allowance Types"
          [value]="stats.total"
          icon="folder"
          iconColor="blue">
        </app-stat-card>

        <app-stat-card
          label="Active"
          [value]="stats.active"
          icon="check"
          iconColor="green">
        </app-stat-card>

        <app-stat-card
          label="Inactive"
          [value]="stats.inactive"
          icon="inactive"
          iconColor="gray">
        </app-stat-card>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              [(ngModel)]="filters.type"
              (change)="applyFilters()"
              class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Types</option>
              <option value="EARNING">Earnings</option>
              <option value="DEDUCTION">Deductions</option>
            </select>
          </div>

          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="filters.showInactive"
                (change)="applyFilters()"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Inactive</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table
          [columns]="columns"
          [data]="filteredData"
          [actions]="tableActions"
          emptyMessage="No allowance types found">
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
      [title]="isEditMode ? 'Edit Allowance Type' : 'New Allowance Type'"
      [confirmDisabled]="!isFormValid()"
      (close)="closeModal()"
      (confirm)="saveAllowanceType()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            System Component <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            [(ngModel)]="formData.systemComponent"
            appHelpField="hrms.payroll.allowance_types.system_component"
            name="systemComponent"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., BASIC_SALARY">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Code <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            [(ngModel)]="formData.code"
            appHelpField="hrms.payroll.allowance_types.code"
            name="code"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., BS">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            [(ngModel)]="formData.name"
            appHelpField="hrms.payroll.allowance_types.name"
            name="name"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., Basic Salary">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type <span class="text-red-500">*</span>
          </label>
          <select
            [(ngModel)]="formData.type"
            appHelpField="hrms.payroll.allowance_types.type"
            name="type"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="EARNING">Earning</option>
            <option value="DEDUCTION">Deduction</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isTaxable"
              appHelpField="hrms.payroll.allowance_types.is_taxable"
              name="isTaxable"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Taxable</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isPensionable"
              appHelpField="hrms.payroll.allowance_types.is_pensionable"
              name="isPensionable"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pensionable</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isRecurring"
              appHelpField="hrms.payroll.allowance_types.is_recurring"
              name="isRecurring"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isActive"
              name="isActive"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Effective From
          </label>
          <input
            type="date"
            [(ngModel)]="formData.effectiveFrom"
            name="effectiveFrom"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class AllowanceTypesComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  
  stats = { total: 0, active: 0, inactive: 0 };
  
  filters = {
    type: '',
    showInactive: false
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
    this.loadAllowanceTypes();
  }

  initializeColumns(): void {
    this.columns = [
      { key: 'code', label: 'Code', sortable: true, width: '10%' },
      { key: 'name', label: 'Name', sortable: true, width: '25%' },
      { key: 'systemComponent', label: 'System Component', sortable: true, width: '20%' },
      { key: 'type', label: 'Type', sortable: true, width: '12%' },
      { key: 'isTaxable', label: 'Taxable', width: '10%' },
      { key: 'isPensionable', label: 'Pensionable', width: '10%' },
      { key: 'isActive', label: 'Status', width: '13%' }
    ];
  }

  initializeTableActions(): void {
    this.tableActions = [
      {
        label: 'Edit',
        onClick: (row: any) => this.editAllowanceType(row)
      },
      {
        label: 'Deactivate',
        onClick: (row: any) => this.toggleStatus(row),
        condition: (row: any) => row.isActive
      },
      {
        label: 'Activate',
        onClick: (row: any) => this.toggleStatus(row),
        condition: (row: any) => !row.isActive
      }
    ];
  }

  loadAllowanceTypes(): void {
    this.payrollService.getAllowanceTypes().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load allowance types:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.active = this.data.filter(x => x.isActive).length;
    this.stats.inactive = this.data.filter(x => !x.isActive).length;
  }

  applyFilters(): void {
    let filtered = [...this.data];

    if (this.filters.type) {
      filtered = filtered.filter(x => x.type === this.filters.type);
    }

    if (!this.filters.showInactive) {
      filtered = filtered.filter(x => x.isActive);
    }

    this.filteredData = filtered;
    this.pagination.totalItems = filtered.length;
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

  editAllowanceType(row: any): void {
    this.isEditMode = true;
    this.formData = { ...row };
    this.isModalOpen = true;
  }

  saveAllowanceType(): void {
    if (!this.isFormValid()) return;

    const apiCall = this.isEditMode
      ? this.payrollService.updateAllowanceType(this.formData.id, this.formData)
      : this.payrollService.createAllowanceType(this.formData);

    apiCall.subscribe({
      next: () => {
        this.closeModal();
        this.loadAllowanceTypes();
      },
      error: (err) => console.error('Failed to save allowance type:', err)
    });
  }

  toggleStatus(row: any): void {
    const updated = { ...row, isActive: !row.isActive };
    this.payrollService.updateAllowanceType(row.id, updated).subscribe({
      next: () => this.loadAllowanceTypes(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  isFormValid(): boolean {
    return !!(
      this.formData.systemComponent?.trim() &&
      this.formData.code?.trim() &&
      this.formData.name?.trim() &&
      this.formData.type
    );
  }

  getEmptyForm(): any {
    return {
      systemComponent: '',
      code: '',
      name: '',
      type: 'EARNING',
      isTaxable: true,
      isPensionable: true,
      isRecurring: true,
      isActive: true,
      effectiveFrom: new Date().toISOString().split('T')[0]
    };
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pagination.pageSize = size;
    this.pagination.currentPage = 1;
  }
}
