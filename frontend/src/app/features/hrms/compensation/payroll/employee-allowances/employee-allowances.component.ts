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
  selector: 'app-employee-allowances',
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
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Employee Allowances</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage allowances assigned to employees
          </p>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Assign Allowance
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card
          label="Total Assignments"
          [value]="stats.total"
          icon="users"
          iconColor="blue">
        </app-stat-card>

        <app-stat-card
          label="Active"
          [value]="stats.active"
          icon="check"
          iconColor="green">
        </app-stat-card>

        <app-stat-card
          label="Total Amount"
          [value]="formatCurrency(stats.totalAmount)"
          icon="cash"
          iconColor="purple">
        </app-stat-card>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allowance Type</label>
            <select
              [(ngModel)]="filters.allowanceTypeId"
              (change)="applyFilters()"
              class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Types</option>
              <option *ngFor="let type of allowanceTypes" [value]="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              [(ngModel)]="filters.status"
              (change)="applyFilters()"
              class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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
          emptyMessage="No employee allowances found">
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

    <!-- Assign Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Allowance Assignment' : 'Assign Allowance'"
      [confirmDisabled]="!isFormValid()"
      (close)="closeModal()"
      (confirm)="saveAllowance()">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Employee <span class="text-red-500">*</span>
          </label>
          <select
            [(ngModel)]="formData.employeeId"
            name="employeeId"
            [disabled]="isEditMode"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50">
            <option value="">Select employee...</option>
            <option *ngFor="let emp of employees" [value]="emp.id">
              {{ emp.fullName }} - {{ emp.employeeCode }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Allowance Type <span class="text-red-500">*</span>
          </label>
          <select
            [(ngModel)]="formData.allowanceTypeId"
            name="allowanceTypeId"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500">
            <option value="">Select type...</option>
            <option *ngFor="let type of allowanceTypes" [value]="type.id">
              {{ type.name }} ({{ type.type }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (ETB) <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            [(ngModel)]="formData.amount"
            name="amount"
            min="0"
            step="0.01"
            class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            placeholder="0.00">
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
export class EmployeeAllowancesComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  
  employees: any[] = [];
  allowanceTypes: any[] = [];

  stats = { total: 0, active: 0, totalAmount: 0 };
  
  filters = {
    allowanceTypeId: '',
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
    this.loadEmployees();
    this.loadAllowanceTypes();
    this.loadEmployeeAllowances();
  }

  initializeColumns(): void {
    this.columns = [
      { key: 'employeeName', label: 'Employee', sortable: true, width: '25%' },
      { key: 'allowanceTypeName', label: 'Allowance Type', sortable: true, width: '25%' },
      { key: 'allowanceTypeType', label: 'Type', sortable: true, width: '15%' },
      { key: 'amount', label: 'Amount', sortable: true, width: '15%' },
      { key: 'currency', label: 'Currency', width: '10%' },
      { key: 'isActive', label: 'Status', width: '10%' }
    ];
  }

  initializeTableActions(): void {
    this.tableActions = [
      {
        label: 'Edit',
        onClick: (row: any) => this.editAllowance(row)
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

  loadEmployees(): void {
    // Mock data for demonstration
    this.employees = [
      { id: 1, fullName: 'Tesfay Bsrat', employeeCode: 'EMP001' },
      { id: 2, fullName: 'Meron Haile', employeeCode: 'EMP002' }
    ];
  }

  loadAllowanceTypes(): void {
    this.payrollService.getAllowanceTypes().subscribe({
      next: (response) => {
        this.allowanceTypes = response.filter((x: any) => x.isActive) || [];
      },
      error: (err: any) => console.error('Failed to load allowance types:', err)
    });
  }

  loadEmployeeAllowances(): void {
    this.payrollService.getEmployeeAllowances().subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load employee allowances:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.active = this.data.filter(x => x.isActive).length;
    this.stats.totalAmount = this.data.reduce((sum, x) => sum + (x.amount || 0), 0);
  }

  applyFilters(): void {
    let filtered = [...this.data];

    if (this.filters.allowanceTypeId) {
      filtered = filtered.filter(x => x.allowanceTypeId == this.filters.allowanceTypeId);
    }

    if (this.filters.status) {
      const isActive = this.filters.status === 'true';
      filtered = filtered.filter(x => x.isActive === isActive);
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

  editAllowance(row: any): void {
    this.isEditMode = true;
    this.formData = { ...row };
    this.isModalOpen = true;
  }

  saveAllowance(): void {
    if (!this.isFormValid()) return;

    const apiCall = this.isEditMode
      ? this.payrollService.updateEmployeeAllowance(this.formData.id, this.formData)
      : this.payrollService.createEmployeeAllowance(this.formData);

    apiCall.subscribe({
      next: () => {
        this.closeModal();
        this.loadEmployeeAllowances();
      },
      error: (err) => console.error('Failed to save employee allowance:', err)
    });
  }

  toggleStatus(row: any): void {
    const updated = { ...row, isActive: !row.isActive };
    this.payrollService.updateEmployeeAllowance(row.id, updated).subscribe({
      next: () => this.loadEmployeeAllowances(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  isFormValid(): boolean {
    return !!(
      this.formData.employeeId &&
      this.formData.allowanceTypeId &&
      this.formData.amount > 0
    );
  }

  getEmptyForm(): any {
    return {
      employeeId: '',
      allowanceTypeId: '',
      amount: 0,
      currency: 'ETB',
      isActive: true
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
