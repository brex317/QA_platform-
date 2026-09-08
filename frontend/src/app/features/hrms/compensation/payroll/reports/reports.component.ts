import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicTableComponent, TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PayrollService } from '../../../../../core/services/payroll.service';

@Component({
  selector: 'app-payroll-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Payroll Reports</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and view payroll reports</p>
        </div>
        <button (click)="exportReport()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          <svg class="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </button>
      </div>

      <!-- Period Selector -->
      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payroll Period</label>
            <select [(ngModel)]="selectedPeriod" (change)="loadReportData()" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option [value]="null">Select period...</option>
              <option *ngFor="let period of periods" [value]="period.id">{{ period.code }}</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
            <select [(ngModel)]="reportType" (change)="loadReportData()" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="register">Payroll Register</option>
              <option value="tax">Tax Report</option>
              <option value="pension">Pension Report</option>
              <option value="department">Department Summary</option>
              <option value="cost">Cost Center Report</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tab Headers -->
      <div class="bg-white dark:bg-dark-surface rounded-t-lg border-b border-gray-200 dark:border-dark-border">
        <div class="flex gap-1 px-4 pt-4">
          <button *ngFor="let tab of tabs" (click)="reportType = tab.value; loadReportData()" 
            [class.border-b-2]="reportType === tab.value" 
            [class.border-primary-600]="reportType === tab.value"
            [class.text-primary-600]="reportType === tab.value"
            [class.dark:text-primary-400]="reportType === tab.value"
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Report Table -->
      <div class="bg-white dark:bg-dark-surface rounded-b-lg shadow-sm border border-gray-200 dark:border-dark-border border-t-0">
        <app-dynamic-table [columns]="columns" [data]="paginatedData" emptyMessage="No data available. Please select a period."></app-dynamic-table>
        <app-pagination [currentPage]="pagination.currentPage" [pageSize]="pagination.pageSize" [totalItems]="pagination.totalItems" 
          (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"></app-pagination>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">{{ summary.totalEmployees }}</p>
        </div>
        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gross Pay</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ formatCurrency(summary.totalGross) }}</p>
        </div>
        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deductions</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{{ formatCurrency(summary.totalDeductions) }}</p>
        </div>
        <div class="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Net Pay</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ formatCurrency(summary.totalNet) }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PayrollReportsComponent implements OnInit {
  columns: TableColumn[] = [];
  data: any[] = [];
  paginatedData: any[] = [];
  periods: any[] = [];
  tabs = [
    { label: 'Register', value: 'register' },
    { label: 'Tax', value: 'tax' },
    { label: 'Pension', value: 'pension' },
    { label: 'Department', value: 'department' },
    { label: 'Cost Center', value: 'cost' }
  ];
  selectedPeriod: number | null = null;
  reportType = 'register';
  summary = { totalEmployees: 0, totalGross: 0, totalDeductions: 0, totalNet: 0 };
  pagination = { currentPage: 1, pageSize: 25, totalItems: 0 };

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.loadPeriods();
    this.initializeColumns();
  }

  loadPeriods(): void {
    this.payrollService.getPayrollPeriods().subscribe({
      next: (response) => { this.periods = response || []; },
      error: (err: any) => console.error('Failed to load periods:', err)
    });
  }

  initializeColumns(): void {
    const columnSets: Record<string, TableColumn[]> = {
      register: [
        { key: 'employeeCode', label: 'Emp Code', sortable: true, width: '10%' },
        { key: 'employeeName', label: 'Employee Name', sortable: true, width: '20%' },
        { key: 'department', label: 'Department', sortable: true, width: '12%' },
        { key: 'basicSalary', label: 'Basic Salary', sortable: true, width: '12%' },
        { key: 'allowances', label: 'Allowances', sortable: true, width: '11%' },
        { key: 'grossPay', label: 'Gross Pay', sortable: true, width: '11%' },
        { key: 'tax', label: 'Tax', sortable: true, width: '8%' },
        { key: 'pension', label: 'Pension', sortable: true, width: '8%' },
        { key: 'netPay', label: 'Net Pay', sortable: true, width: '8%' }
      ],
      tax: [
        { key: 'employeeCode', label: 'Emp Code', sortable: true, width: '12%' },
        { key: 'employeeName', label: 'Employee Name', sortable: true, width: '25%' },
        { key: 'taxableIncome', label: 'Taxable Income', sortable: true, width: '18%' },
        { key: 'taxBracket', label: 'Tax Bracket', sortable: true, width: '15%' },
        { key: 'taxRate', label: 'Rate (%)', sortable: true, width: '12%' },
        { key: 'taxAmount', label: 'Tax Amount', sortable: true, width: '18%' }
      ],
      pension: [
        { key: 'employeeCode', label: 'Emp Code', sortable: true, width: '12%' },
        { key: 'employeeName', label: 'Employee Name', sortable: true, width: '25%' },
        { key: 'pensionableIncome', label: 'Pensionable Income', sortable: true, width: '18%' },
        { key: 'employeeContribution', label: 'Employee (7%)', sortable: true, width: '15%' },
        { key: 'employerContribution', label: 'Employer (11%)', sortable: true, width: '15%' },
        { key: 'totalContribution', label: 'Total', sortable: true, width: '15%' }
      ],
      department: [
        { key: 'department', label: 'Department', sortable: true, width: '25%' },
        { key: 'employeeCount', label: 'Employees', sortable: true, width: '15%' },
        { key: 'totalGross', label: 'Total Gross', sortable: true, width: '20%' },
        { key: 'totalTax', label: 'Total Tax', sortable: true, width: '15%' },
        { key: 'totalPension', label: 'Total Pension', sortable: true, width: '15%' },
        { key: 'totalNet', label: 'Total Net', sortable: true, width: '10%' }
      ],
      cost: [
        { key: 'costCenter', label: 'Cost Center', sortable: true, width: '25%' },
        { key: 'employeeCount', label: 'Employees', sortable: true, width: '15%' },
        { key: 'basicSalary', label: 'Basic Salary', sortable: true, width: '15%' },
        { key: 'allowances', label: 'Allowances', sortable: true, width: '15%' },
        { key: 'employerPension', label: 'Employer Pension', sortable: true, width: '15%' },
        { key: 'totalCost', label: 'Total Cost', sortable: true, width: '15%' }
      ]
    };
    this.columns = columnSets[this.reportType] || columnSets['register'];
  }

  loadReportData(): void {
    if (!this.selectedPeriod) return;
    
    this.initializeColumns();
    
    this.payrollService.getPayrollReports(this.selectedPeriod, this.reportType).subscribe({
      next: (response: any) => {
        this.data = response || [];
        this.updateSummary();
        this.pagination.totalItems = this.data.length;
        this.updatePaginatedData();
      },
      error: (err: any) => console.error('Failed to load report data:', err)
    });
  }

  updateSummary(): void {
    this.summary.totalEmployees = this.data.length;
    this.summary.totalGross = this.data.reduce((sum, x) => sum + (x.grossPay || x.totalGross || 0), 0);
    this.summary.totalDeductions = this.data.reduce((sum, x) => sum + ((x.tax || 0) + (x.pension || 0)), 0);
    this.summary.totalNet = this.data.reduce((sum, x) => sum + (x.netPay || x.totalNet || 0), 0);
  }

  updatePaginatedData(): void {
    const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
    this.paginatedData = this.data.slice(start, start + this.pagination.pageSize);
  }

  exportReport(): void {
    console.log('Exporting report to Excel...');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
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
