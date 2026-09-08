import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card.component';
import { DynamicTableComponent, TableColumn, TableAction } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { PayrollService } from '../../../../../core/services/payroll.service';

@Component({
  selector: 'app-payslips',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, DynamicTableComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-text">Payslips</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">View and download employee payslips</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-stat-card label="Total Payslips" [value]="stats.total" icon="folder" iconColor="blue"></app-stat-card>
        <app-stat-card label="Total Gross Pay" [value]="formatCurrency(stats.totalGross)" icon="cash" iconColor="green"></app-stat-card>
        <app-stat-card label="Total Net Pay" [value]="formatCurrency(stats.totalNet)" icon="cash" iconColor="purple"></app-stat-card>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select [(ngModel)]="filters.department" (change)="applyFilters()" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payroll Run</label>
            <select [(ngModel)]="filters.runId" (change)="applyFilters()" class="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text py-2 px-3 focus:border-primary-500 focus:ring-primary-500">
              <option value="">All Runs</option>
              <option *ngFor="let run of payrollRuns" [value]="run.id">{{ run.runNumber }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <app-dynamic-table [columns]="columns" [data]="paginatedData" [actions]="tableActions" emptyMessage="No payslips found"></app-dynamic-table>
        <app-pagination [currentPage]="pagination.currentPage" [pageSize]="pagination.pageSize" [totalItems]="pagination.totalItems" 
          (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"></app-pagination>
      </div>
    </div>
  `,
  styles: []
})
export class PayslipsComponent implements OnInit {
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [];
  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  payrollRuns: any[] = [];
  stats = { total: 0, totalGross: 0, totalNet: 0 };
  filters = { department: '', runId: '' };
  pagination = { currentPage: 1, pageSize: 10, totalItems: 0 };

  constructor(private payrollService: PayrollService) {
    this.columns = [
      { key: 'employeeCode', label: 'Employee Code', sortable: true, width: '12%' },
      { key: 'employeeName', label: 'Employee Name', sortable: true, width: '20%' },
      { key: 'department', label: 'Department', sortable: true, width: '15%' },
      { key: 'grossPay', label: 'Gross Pay', sortable: true, width: '13%' },
      { key: 'taxDeduction', label: 'Tax', sortable: true, width: '10%' },
      { key: 'pensionDeduction', label: 'Pension', sortable: true, width: '10%' },
      { key: 'netPay', label: 'Net Pay', sortable: true, width: '13%' },
      { key: 'runNumber', label: 'Run', sortable: true, width: '7%' }
    ];
    this.tableActions = [
      { label: 'View Payslip', onClick: (row: any) => this.viewPayslip(row) },
      { label: 'Download PDF', onClick: (row: any) => this.downloadPayslip(row) },
      { label: 'Email to Employee', onClick: (row: any) => this.emailPayslip(row) }
    ];
  }

  ngOnInit(): void {
    this.loadPayrollRuns();
    this.loadPayslips();
  }

  loadPayrollRuns(): void {
    this.payrollService.getPayrollRuns().subscribe({
      next: (response) => { this.payrollRuns = response || []; },
      error: (err: any) => console.error('Failed to load payroll runs:', err)
    });
  }

  loadPayslips(): void {
    this.payrollService.getPayslips(this.filters.department).subscribe({
      next: (response) => {
        this.data = response || [];
        this.updateStats();
        this.applyFilters();
      },
      error: (err: any) => console.error('Failed to load payslips:', err)
    });
  }

  updateStats(): void {
    this.stats.total = this.data.length;
    this.stats.totalGross = this.data.reduce((sum, x) => sum + (x.grossPay || 0), 0);
    this.stats.totalNet = this.data.reduce((sum, x) => sum + (x.netPay || 0), 0);
  }

  applyFilters(): void {
    let filtered = [...this.data];
    if (this.filters.department) {
      filtered = filtered.filter(x => x.department === this.filters.department);
    }
    if (this.filters.runId) {
      filtered = filtered.filter(x => x.payrollRunId == this.filters.runId);
    }
    this.filteredData = filtered;
    this.pagination.totalItems = filtered.length;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pagination.pageSize);
  }

  viewPayslip(row: any): void {
    console.log('View payslip for:', row);
  }

  downloadPayslip(row: any): void {
    console.log('Download payslip for:', row);
  }

  emailPayslip(row: any): void {
    console.log('Email payslip to:', row.employeeName);
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
