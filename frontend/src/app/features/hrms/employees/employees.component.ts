import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">HRMS</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {{ currentUserName }}! Here's what's happening today.
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="space-y-4">
          <!-- Search Bar -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="applyFilters()"
              placeholder="Up to 100 records per request. Use search to narrow results"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap items-center gap-4">
            <!-- Include Inactive Toggle -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="includeInactive"
                (ngModelChange)="applyFilters()"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
              <span class="text-sm text-gray-700 dark:text-gray-300">Include inactive</span>
            </label>

            <!-- Department Filter -->
            <select
              [(ngModel)]="selectedDepartment"
              (ngModelChange)="applyFilters()"
              class="px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text text-sm focus:ring-2 focus:ring-primary-500">
              <option value="">All Departments</option>
              <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
            </select>

            <!-- Action Buttons -->
            <div class="ml-auto flex gap-2">
              <button
                (click)="exportData()"
                class="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button
                (click)="refreshData()"
                class="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        <app-dynamic-table
          [columns]="columns"
          [data]="paginatedEmployees"
          [actions]="actions"
          [isLoading]="isLoading">
        </app-dynamic-table>

        <!-- Pagination -->
        <div class="border-t border-gray-200 dark:border-dark-border px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, filteredEmployees.length) }} of {{ filteredEmployees.length }} results
            </div>
            <div class="flex gap-2">
              <button
                (click)="previousPage()"
                [disabled]="currentPage === 1"
                class="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Previous
              </button>
              <button
                (click)="nextPage()"
                [disabled]="currentPage * pageSize >= filteredEmployees.length"
                class="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Modal -->
      <app-modal
        [isOpen]="isModalOpen"
        [title]="isEditMode ? 'Edit Employee' : 'Add Employee'"
        [size]="'lg'"
        (close)="closeModal()">
        <form class="space-y-4">
          <!-- Form content would go here -->
          <div class="text-center text-gray-500 dark:text-gray-400 py-8">
            Employee form coming soon...
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: []
})
export class EmployeesComponent implements OnInit {
  Math = Math;
  
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  departments: string[] = [];
  
  searchTerm = '';
  selectedDepartment = '';
  includeInactive = false;
  isLoading = false;
  isModalOpen = false;
  isEditMode = false;
  
  currentPage = 1;
  pageSize = 10;
  
  currentUserName = 'User';
  
  columns: TableColumn[] = [
    { key: 'code', label: 'CODE', sortable: true, width: '12%' },
    { key: 'fullName', label: 'EMPLOYEE', sortable: true, width: '25%' },
    { key: 'jobTitle', label: 'JOB TITLE', sortable: true, width: '18%' },
    { key: 'phoneNumber', label: 'PHONE NUMBER', sortable: true, width: '15%' },
    { key: 'status', label: 'STATUS', sortable: true, width: '10%' },
    { key: 'actions', label: 'ACTIONS', sortable: false, width: '10%' }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (row: any) => this.editEmployee(row)
    },
    {
      label: 'Delete',
      icon: 'delete',
      onClick: (row: any) => this.deleteEmployee(row),
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getUserDisplayName(this.authService.currentUser);
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees({
      search: this.searchTerm,
      status: this.includeInactive ? '' : 'ACTIVE',
      department: this.selectedDepartment
    }).subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        this.isLoading = false;
      }
    });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => console.error('Failed to load departments:', err)
    });
  }

  applyFilters(): void {
    let filtered = [...this.employees];

    // Apply search
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.fullName.toLowerCase().includes(search) ||
        emp.code.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.jobTitle.toLowerCase().includes(search)
      );
    }

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === this.selectedDepartment);
    }

    // Apply active/inactive filter
    if (!this.includeInactive) {
      filtered = filtered.filter(emp => emp.status === 'ACTIVE');
    }

    this.filteredEmployees = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredEmployees.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  refreshData(): void {
    this.loadEmployees();
  }

  exportData(): void {
    console.log('Exporting data...');
    // TODO: Implement export functionality
  }

  editEmployee(employee: Employee): void {
    console.log('Edit employee:', employee);
    this.isEditMode = true;
    this.isModalOpen = true;
    // TODO: Load employee data into form
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          console.log('Employee deleted');
          this.loadEmployees();
        },
        error: (err) => console.error('Failed to delete employee:', err)
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
  }
}
