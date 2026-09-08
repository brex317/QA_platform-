import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-employee-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center gap-4">
        <a
          routerLink="/hrms/employees"
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Employee Onboarding</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Add a new employee to your organization</p>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
        <form [formGroup]="onboardingForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
              <input
                type="text"
                formControlName="firstName"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="First Name">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
              <input
                type="text"
                formControlName="lastName"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="Last Name">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Code *</label>
              <input
                type="text"
                formControlName="code"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="EMP-1001">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="email@company.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                formControlName="phoneNumber"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="+251 91 123 4567">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
              <input
                type="text"
                formControlName="jobTitle"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="Software Engineer">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
              <select
                formControlName="department"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500">
                <option value="">Select Department</option>
                <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Basic Salary (ETB) *</label>
              <input
                type="number"
                formControlName="basicSalary"
                class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                placeholder="25000">
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-200 dark:border-dark-border pt-4">
            <a
              routerLink="/hrms/employees"
              class="px-5 py-2 border border-gray-300 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="onboardingForm.invalid || isSubmitting"
              class="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium">
              {{ isSubmitting ? 'Saving...' : 'Save & Complete Onboarding' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EmployeeOnboardingComponent implements OnInit {
  onboardingForm: FormGroup;
  isSubmitting = false;
  departments: string[] = ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.onboardingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      code: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      basicSalary: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.employeeService.getDepartments().subscribe({
      next: (depts) => {
        if (depts && depts.length) {
          this.departments = depts;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.onboardingForm.invalid) return;

    this.isSubmitting = true;
    const formVal = this.onboardingForm.value;
    const newEmployee = {
      code: formVal.code,
      firstName: formVal.firstName,
      lastName: formVal.lastName,
      email: formVal.email,
      phoneNumber: formVal.phoneNumber,
      jobTitle: formVal.jobTitle,
      department: formVal.department,
      basicSalary: formVal.basicSalary,
      status: 'ACTIVE',
      hireDate: new Date().toISOString()
    };

    this.employeeService.createEmployee(newEmployee as any).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/hrms/employees']);
      },
      error: (err) => {
        console.error('Failed to create employee:', err);
        this.isSubmitting = false;
      }
    });
  }
}
