import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, ModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header / Welcome Banner -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
            <span>Home</span>
            <span class="text-gray-400 font-normal">›</span>
            <span>HRMS</span>
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {{ currentUserName }}! Here's what's happening today.
          </p>
        </div>
        <button
          (click)="openAddEmployee()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      <!-- Stats Cards (3 cards matching reference screenshot) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Card 1: Employees loaded -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-dark-text">{{ stats.total }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Employees loaded</p>
            </div>
            <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Active -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-dark-text">{{ stats.active }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Active</p>
            </div>
            <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Other status -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200/80 dark:border-dark-border shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-dark-text">{{ stats.inactive + stats.onLeave }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Other status</p>
            </div>
            <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-200/80 dark:border-dark-border space-y-4">
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()"
            placeholder="Search"
            class="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <svg class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-xs text-gray-400">Up to 100 records per request. Use search to narrow results.</p>

        <!-- Controls Row -->
        <div class="flex items-center justify-between pt-1">
          <!-- Include Inactive Toggle -->
          <label class="flex items-center gap-3 cursor-pointer select-none">
            <div class="relative">
              <input
                type="checkbox"
                [(ngModel)]="includeInactive"
                (ngModelChange)="applyFilters()"
                class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Include inactive</span>
          </label>

          <!-- Buttons -->
          <div class="flex items-center gap-3">
            <button
              (click)="exportData()"
              class="px-4 py-2 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            
            <button
              (click)="refreshData()"
              class="px-4 py-2 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Employee Data Table -->
      <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200/80 dark:border-dark-border overflow-hidden">
        <app-dynamic-table
          [columns]="columns"
          [data]="paginatedEmployees"
          [actions]="actions"
          [isLoading]="isLoading">
        </app-dynamic-table>

        <!-- Pagination Bar -->
        <div class="border-t border-gray-200 dark:border-dark-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Items per page: 
            <select
              [(ngModel)]="pageSize"
              (ngModelChange)="updatePagination()"
              class="mx-2 px-2 py-1 border border-gray-300 dark:border-dark-border rounded bg-white dark:bg-dark-bg text-xs">
              <option [ngValue]="10">10</option>
              <option [ngValue]="25">25</option>
              <option [ngValue]="50">50</option>
            </select>
            <span>
              {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, filteredEmployees.length) }} of {{ filteredEmployees.length }}
            </span>
          </div>

          <div class="flex items-center gap-1">
            <button
              (click)="goToPage(1)"
              [disabled]="currentPage === 1"
              class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
              Page {{ currentPage }}
            </span>
            <button
              (click)="nextPage()"
              [disabled]="currentPage * pageSize >= filteredEmployees.length"
              class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              (click)="goToPage(totalPages)"
              [disabled]="currentPage * pageSize >= filteredEmployees.length"
              class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  Math = Math;
  
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  
  searchTerm = '';
  includeInactive = false;
  isLoading = false;
  
  currentPage = 1;
  pageSize = 10;
  currentUserName = 'Tesfay Bsrat';
  
  stats = {
    total: 26,
    active: 26,
    inactive: 0,
    onLeave: 0
  };
  
  columns: TableColumn[] = [
    { key: 'code', label: 'CODE', sortable: true, width: '15%' },
    { key: 'fullName', label: 'EMPLOYEE', sortable: true, width: '30%' },
    { key: 'jobTitle', label: 'JOB TITLE', sortable: true, width: '22%' },
    { key: 'phoneNumber', label: 'PHONE NUMBER', sortable: true, width: '18%' },
    { key: 'status', label: 'STATUS', sortable: true, width: '15%' }
  ];

  // Actions matching Image 4 exactly
  actions: TableAction[] = [
    {
      label: 'Edit employee',
      icon: 'edit',
      onClick: (row: any) => this.editEmployee(row)
    },
    {
      label: 'View Employee profile',
      icon: 'eye',
      onClick: (row: any) => this.viewProfile(row)
    },
    {
      label: 'Copy employee code',
      icon: 'copy',
      onClick: (row: any) => this.copyToClipboard(row.code, 'Employee code copied!')
    },
    {
      label: 'Copy public ID',
      icon: 'copy',
      onClick: (row: any) => this.copyToClipboard(`PUB-${row.id}`, 'Public ID copied!')
    },
    {
      label: 'Copy email',
      icon: 'copy',
      onClick: (row: any) => this.copyToClipboard(row.email, 'Email copied!')
    },
    {
      label: 'Delete employee',
      icon: 'delete',
      onClick: (row: any) => this.deleteEmployee(row),
      className: 'flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium'
    }
  ];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.currentUserName = this.authService.getUserDisplayName(user);
    }
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees({
      search: this.searchTerm,
      status: this.includeInactive ? '' : 'ACTIVE'
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

  applyFilters(): void {
    let filtered = [...this.employees];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.fullName.toLowerCase().includes(search) ||
        emp.code.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.jobTitle.toLowerCase().includes(search)
      );
    }

    if (!this.includeInactive) {
      filtered = filtered.filter(emp => emp.status === 'ACTIVE');
    }

    this.filteredEmployees = filtered;
    this.stats = {
      total: this.employees.length,
      active: this.employees.filter(e => e.status === 'ACTIVE').length,
      inactive: this.employees.filter(e => e.status === 'INACTIVE').length,
      onLeave: this.employees.filter(e => e.status === 'ON_LEAVE').length
    };
    this.currentPage = 1;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.updatePagination();
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
    alert('Employee data exported successfully.');
  }

  copyToClipboard(text: string, message: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    alert(message);
  }

  viewProfile(employee: Employee): void {
    this.router.navigate(['/hrms/employees/profile', employee.id]);
  }

  editEmployee(employee: Employee): void {
    console.log('Edit employee:', employee);
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => console.error('Failed to delete employee:', err)
      });
    }
  }

  openAddEmployee(): void {
    this.router.navigate(['/hrms/employees/onboarding']);
  }
}
