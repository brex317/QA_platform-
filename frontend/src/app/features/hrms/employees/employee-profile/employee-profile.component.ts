import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6" *ngIf="employee; else loadingOrError">
      <!-- Back button and title -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a
            routerLink="/hrms/employees"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">{{ employee.fullName }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ employee.jobTitle }} • Code: {{ employee.code }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span 
            [class.bg-green-100]="employee.status === 'ACTIVE'"
            [class.text-green-800]="employee.status === 'ACTIVE'"
            [class.bg-yellow-100]="employee.status === 'ON_LEAVE'"
            [class.text-yellow-800]="employee.status === 'ON_LEAVE'"
            [class.bg-gray-100]="employee.status === 'INACTIVE'"
            [class.text-gray-800]="employee.status === 'INACTIVE'"
            class="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide">
            {{ employee.status }}
          </span>
        </div>
      </div>

      <!-- Employee Overview Card -->
      <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div class="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-primary-500">
            {{ getInitials(employee.fullName) }}
          </div>
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-dark-text mt-1">{{ employee.email }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-dark-text mt-1">{{ employee.phoneNumber || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-dark-text mt-1">{{ employee.department }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hire Date</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-dark-text mt-1">{{ employee.hireDate | date:'mediumDate' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Basic Salary</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-dark-text mt-1">{{ employee.basicSalary | currency:'ETB':'symbol':'1.2-2' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 dark:border-dark-border">
        <nav class="flex space-x-8">
          <button
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.id"
            [class.border-primary-600]="activeTab === tab.id"
            [class.text-primary-600]="activeTab === tab.id"
            [class.border-transparent]="activeTab !== tab.id"
            [class.text-gray-500]="activeTab !== tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
        <div *ngIf="activeTab === 'personal'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Personal Details</h3>
            <dl class="space-y-3">
              <div class="flex justify-between border-b border-gray-100 dark:border-dark-border py-2">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Full Name</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-dark-text">{{ employee.fullName }}</dd>
              </div>
              <div class="flex justify-between border-b border-gray-100 dark:border-dark-border py-2">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-dark-text">{{ employee.email }}</dd>
              </div>
              <div class="flex justify-between border-b border-gray-100 dark:border-dark-border py-2">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Phone</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-dark-text">{{ employee.phoneNumber || 'N/A' }}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Employment Info</h3>
            <dl class="space-y-3">
              <div class="flex justify-between border-b border-gray-100 dark:border-dark-border py-2">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Employee Code</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-dark-text">{{ employee.code }}</dd>
              </div>
              <div class="flex justify-between border-b border-gray-100 dark:border-dark-border py-2">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Job Title</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-dark-text">{{ employee.jobTitle }}</dd>
              </div>
              <div class="flex justify-between border-b border-gray-100 dark:border-dark-border py-2">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Department</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-dark-text">{{ employee.department }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div *ngIf="activeTab === 'salary'" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-text">Compensation Breakdown</h3>
          <div class="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Basic Salary</p>
              <p class="text-xl font-bold text-gray-900 dark:text-dark-text">{{ employee.basicSalary | currency:'ETB':'symbol':'1.2-2' }}</p>
            </div>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">Monthly Rate</span>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingOrError>
      <div class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400" *ngIf="isLoading">Loading employee profile...</p>
        <p class="text-red-500" *ngIf="!isLoading">Employee not found.</p>
      </div>
    </ng-template>
  `
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;
  activeTab = 'personal';

  tabs = [
    { id: 'personal', label: 'Personal & Employment' },
    { id: 'salary', label: 'Compensation & Payroll' }
  ];

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.employeeService.getEmployeeById(id).subscribe({
        next: (emp) => {
          this.employee = emp || null;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  getInitials(name: string): string {
    if (!name) return 'E';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
