import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  PayrollDashboard,
  AllowanceType,
  EmployeeAllowance,
  PayrollPeriod,
  TaxSchedule,
  PensionRule,
  PayrollRun,
  PayrollJournal,
  Payslip,
  PayrollReport
} from '../models/payroll.models';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private apiUrl = `${environment.apiUrl}/hrms/payroll`;

  constructor(private http: HttpClient) {}

  // Mock fallbacks matching exact interfaces
  private mockSummary: PayrollDashboard = {
    totalEmployees: 26,
    activePeriod: 'February 2026',
    totalPayrollRuns: 12,
    totalGrossPay: 1250000,
    totalNetPay: 897500,
    currency: 'ETB'
  };

  private mockAllowanceTypes: AllowanceType[] = [
    { id: 1, systemComponent: 'HOUSING', code: 'HOU', name: 'Housing Allowance', type: 'Taxable', isTaxable: true, isPensionable: false, isRecurring: true, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 2, systemComponent: 'TRANSPORT', code: 'TRN', name: 'Transport Allowance', type: 'Tax Exempt', isTaxable: false, isPensionable: false, isRecurring: true, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 3, systemComponent: 'POSITION', code: 'POS', name: 'Position Allowance', type: 'Taxable', isTaxable: true, isPensionable: true, isRecurring: true, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true }
  ];

  private mockPeriods: PayrollPeriod[] = [
    { id: 1, code: 'PR-2026-01', startDate: '2026-01-01', endDate: '2026-01-31', status: 'Closed', isActive: false },
    { id: 2, code: 'PR-2026-02', startDate: '2026-02-01', endDate: '2026-02-28', status: 'Open', isActive: true },
    { id: 3, code: 'PR-2026-03', startDate: '2026-03-01', endDate: '2026-03-31', status: 'Draft', isActive: true }
  ];

  private mockTaxSchedules: TaxSchedule[] = [
    { id: 1, orderNo: 1, fromAmount: 0, toAmount: 600, ratePercent: 0, govDeduction: 0, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 2, orderNo: 2, fromAmount: 601, toAmount: 1650, ratePercent: 10, govDeduction: 60, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 3, orderNo: 3, fromAmount: 1651, toAmount: 3200, ratePercent: 15, govDeduction: 142.5, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 4, orderNo: 4, fromAmount: 3201, toAmount: 5250, ratePercent: 20, govDeduction: 302.5, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 5, orderNo: 5, fromAmount: 5251, toAmount: 7800, ratePercent: 25, govDeduction: 565, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 6, orderNo: 6, fromAmount: 7801, toAmount: 10900, ratePercent: 30, govDeduction: 955, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 7, orderNo: 7, fromAmount: 10901, toAmount: null, ratePercent: 35, govDeduction: 1500, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true }
  ];

  private mockPensionRules: PensionRule[] = [
    { id: 1, employmentType: 'Permanent Public', employeeRate: 7, employerRate: 11, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true },
    { id: 2, employmentType: 'Permanent Private', employeeRate: 7, employerRate: 11, effectiveFrom: '2025-01-01', effectiveTo: null, isActive: true }
  ];

  // ===================================================================
  // Dashboard
  // ===================================================================
  getDashboardSummary(): Observable<PayrollDashboard> {
    return this.http.get<ApiResponse<PayrollDashboard>>(`${this.apiUrl}/dashboard/summary`).pipe(
      map(response => response.data || this.mockSummary),
      catchError(() => of(this.mockSummary))
    );
  }

  // ===================================================================
  // Allowance Types
  // ===================================================================
  getAllowanceTypes(type?: string, isActive?: boolean): Observable<AllowanceType[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (isActive !== undefined) params = params.set('isActive', isActive.toString());

    return this.http.get<ApiResponse<AllowanceType[]>>(`${this.apiUrl}/allowance-types`, { params }).pipe(
      map(response => response.data && response.data.length ? response.data : this.mockAllowanceTypes),
      catchError(() => of(this.mockAllowanceTypes))
    );
  }

  getAllowanceTypeById(id: number): Observable<AllowanceType | null> {
    return this.http.get<ApiResponse<AllowanceType>>(`${this.apiUrl}/allowance-types/${id}`).pipe(
      map(response => response.data || this.mockAllowanceTypes.find(a => a.id === id) || null),
      catchError(() => of(this.mockAllowanceTypes.find(a => a.id === id) || null))
    );
  }

  createAllowanceType(data: Partial<AllowanceType>): Observable<AllowanceType> {
    return this.http.post<ApiResponse<AllowanceType>>(`${this.apiUrl}/allowance-types`, data).pipe(
      map(response => response.data!),
      catchError(() => {
        const created: AllowanceType = {
          id: this.mockAllowanceTypes.length + 1,
          systemComponent: data.systemComponent || 'CUSTOM',
          code: data.code || 'NEW',
          name: data.name || 'New Allowance',
          type: data.type || 'Taxable',
          isTaxable: data.isTaxable ?? true,
          isPensionable: data.isPensionable ?? false,
          isRecurring: data.isRecurring ?? true,
          effectiveFrom: data.effectiveFrom || '2026-01-01',
          effectiveTo: data.effectiveTo || null,
          isActive: true
        };
        this.mockAllowanceTypes.push(created);
        return of(created);
      })
    );
  }

  updateAllowanceType(id: number, data: Partial<AllowanceType>): Observable<AllowanceType> {
    return this.http.put<ApiResponse<AllowanceType>>(`${this.apiUrl}/allowance-types/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ ...this.mockAllowanceTypes[0], ...data } as AllowanceType))
    );
  }

  deleteAllowanceType(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/allowance-types/${id}`).pipe(
      map(response => response.success),
      catchError(() => of(true))
    );
  }

  // ===================================================================
  // Employee Allowances
  // ===================================================================
  getEmployeeAllowances(type?: string, isActive?: boolean): Observable<EmployeeAllowance[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (isActive !== undefined) params = params.set('isActive', isActive.toString());

    return this.http.get<ApiResponse<EmployeeAllowance[]>>(`${this.apiUrl}/employee-allowances`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  createEmployeeAllowance(data: Partial<EmployeeAllowance>): Observable<EmployeeAllowance> {
    return this.http.post<ApiResponse<EmployeeAllowance>>(`${this.apiUrl}/employee-allowances`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id: Date.now(), ...data } as EmployeeAllowance))
    );
  }

  updateEmployeeAllowance(id: number, data: Partial<EmployeeAllowance>): Observable<EmployeeAllowance> {
    return this.http.put<ApiResponse<EmployeeAllowance>>(`${this.apiUrl}/employee-allowances/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id, ...data } as EmployeeAllowance))
    );
  }

  deleteEmployeeAllowance(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/employee-allowances/${id}`).pipe(
      map(response => response.success),
      catchError(() => of(true))
    );
  }

  // ===================================================================
  // Payroll Periods
  // ===================================================================
  getPayrollPeriods(status?: string): Observable<PayrollPeriod[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<PayrollPeriod[]>>(`${this.apiUrl}/payroll-periods`, { params }).pipe(
      map(response => response.data && response.data.length ? response.data : this.mockPeriods),
      catchError(() => of(this.mockPeriods))
    );
  }

  createPayrollPeriod(data: Partial<PayrollPeriod>): Observable<PayrollPeriod> {
    return this.http.post<ApiResponse<PayrollPeriod>>(`${this.apiUrl}/payroll-periods`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id: Date.now(), ...data } as PayrollPeriod))
    );
  }

  updatePayrollPeriod(id: number, data: Partial<PayrollPeriod>): Observable<PayrollPeriod> {
    return this.http.put<ApiResponse<PayrollPeriod>>(`${this.apiUrl}/payroll-periods/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id, ...data } as PayrollPeriod))
    );
  }

  // ===================================================================
  // Tax Schedules
  // ===================================================================
  getTaxSchedules(): Observable<TaxSchedule[]> {
    return this.http.get<ApiResponse<TaxSchedule[]>>(`${this.apiUrl}/tax-schedules`).pipe(
      map(response => response.data && response.data.length ? response.data : this.mockTaxSchedules),
      catchError(() => of(this.mockTaxSchedules))
    );
  }

  getActiveTaxSchedules(): Observable<TaxSchedule[]> {
    return this.http.get<ApiResponse<TaxSchedule[]>>(`${this.apiUrl}/tax-schedules/active`).pipe(
      map(response => response.data && response.data.length ? response.data : this.mockTaxSchedules),
      catchError(() => of(this.mockTaxSchedules))
    );
  }

  createTaxSchedule(data: Partial<TaxSchedule>): Observable<TaxSchedule> {
    return this.http.post<ApiResponse<TaxSchedule>>(`${this.apiUrl}/tax-schedules`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id: Date.now(), ...data } as TaxSchedule))
    );
  }

  updateTaxSchedule(id: number, data: Partial<TaxSchedule>): Observable<TaxSchedule> {
    return this.http.put<ApiResponse<TaxSchedule>>(`${this.apiUrl}/tax-schedules/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id, ...data } as TaxSchedule))
    );
  }

  // ===================================================================
  // Pension Rules
  // ===================================================================
  getPensionRules(): Observable<PensionRule[]> {
    return this.http.get<ApiResponse<PensionRule[]>>(`${this.apiUrl}/pension-rules`).pipe(
      map(response => response.data && response.data.length ? response.data : this.mockPensionRules),
      catchError(() => of(this.mockPensionRules))
    );
  }

  createPensionRule(data: Partial<PensionRule>): Observable<PensionRule> {
    return this.http.post<ApiResponse<PensionRule>>(`${this.apiUrl}/pension-rules`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id: Date.now(), ...data } as PensionRule))
    );
  }

  updatePensionRule(id: number, data: Partial<PensionRule>): Observable<PensionRule> {
    return this.http.put<ApiResponse<PensionRule>>(`${this.apiUrl}/pension-rules/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id, ...data } as PensionRule))
    );
  }

  // ===================================================================
  // Payroll Runs
  // ===================================================================
  getPayrollRuns(status?: string): Observable<PayrollRun[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<PayrollRun[]>>(`${this.apiUrl}/runs`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  createPayrollRun(data: { periodId: number }): Observable<PayrollRun> {
    return this.http.post<ApiResponse<PayrollRun>>(`${this.apiUrl}/runs`, data).pipe(
      map(response => response.data!),
      catchError(() => of({
        id: Date.now(),
        runNumber: 'RUN-2026-02',
        periodId: data.periodId,
        periodCode: 'PR-2026-02',
        status: 'Draft',
        totalEmployees: 26,
        grossAmount: 1250000,
        netAmount: 897500,
        currency: 'ETB',
        processedDate: null,
        approvedDate: null,
        paidDate: null,
        createdAt: new Date().toISOString()
      } as PayrollRun))
    );
  }

  updatePayrollRun(id: number, data: Partial<PayrollRun>): Observable<PayrollRun> {
    return this.http.put<ApiResponse<PayrollRun>>(`${this.apiUrl}/runs/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id, ...data } as PayrollRun))
    );
  }

  updatePayrollRunStatus(id: number, status: string): Observable<PayrollRun> {
    return this.http.put<ApiResponse<PayrollRun>>(`${this.apiUrl}/runs/${id}/status`, { status }).pipe(
      map(response => response.data!),
      catchError(() => of({ id, status } as PayrollRun))
    );
  }

  processPayroll(id: number): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/runs/${id}/process`, {}).pipe(
      map(response => response.success),
      catchError(() => of(true))
    );
  }

  // ===================================================================
  // Payroll Journals
  // ===================================================================
  getPayrollJournals(status?: string, runId?: number): Observable<PayrollJournal[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (runId) params = params.set('runId', runId.toString());

    return this.http.get<ApiResponse<PayrollJournal[]>>(`${this.apiUrl}/journals`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  createPayrollJournal(data: { runId: number; journalDate: string }): Observable<PayrollJournal> {
    return this.http.post<ApiResponse<PayrollJournal>>(`${this.apiUrl}/journals`, data).pipe(
      map(response => response.data!),
      catchError(() => of({
        id: Date.now(),
        runId: data.runId,
        runNumber: 'RUN-2026-02',
        journalNumber: 'JRN-2026-01',
        journalDate: data.journalDate,
        debitAmount: 1250000,
        creditAmount: 1250000,
        currency: 'ETB',
        status: 'Draft',
        postedDate: null,
        createdAt: new Date().toISOString()
      } as PayrollJournal))
    );
  }

  updatePayrollJournal(id: number, data: Partial<PayrollJournal>): Observable<PayrollJournal> {
    return this.http.put<ApiResponse<PayrollJournal>>(`${this.apiUrl}/journals/${id}`, data).pipe(
      map(response => response.data!),
      catchError(() => of({ id, ...data } as PayrollJournal))
    );
  }

  updateJournalStatus(id: number, status: string): Observable<PayrollJournal> {
    return this.http.put<ApiResponse<PayrollJournal>>(`${this.apiUrl}/journals/${id}/status`, { status }).pipe(
      map(response => response.data!),
      catchError(() => of({ id, status } as PayrollJournal))
    );
  }

  // ===================================================================
  // Payslips
  // ===================================================================
  getPayslips(department?: string): Observable<Payslip[]> {
    let params = new HttpParams();
    if (department) params = params.set('department', department);

    return this.http.get<ApiResponse<Payslip[]>>(`${this.apiUrl}/payslips`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getPayslipsByRun(payrollRunId: number): Observable<Payslip[]> {
    return this.http.get<ApiResponse<Payslip[]>>(`${this.apiUrl}/payslips/run/${payrollRunId}`).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  // ===================================================================
  // Reports
  // ===================================================================
  getPayrollRegister(periodId?: number): Observable<PayrollReport[]> {
    let params = new HttpParams();
    if (periodId) params = params.set('periodId', periodId.toString());

    return this.http.get<ApiResponse<PayrollReport[]>>(`${this.apiUrl}/reports/register`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getTaxReport(periodId?: number): Observable<PayrollReport[]> {
    let params = new HttpParams();
    if (periodId) params = params.set('periodId', periodId.toString());

    return this.http.get<ApiResponse<PayrollReport[]>>(`${this.apiUrl}/reports/tax`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getPensionReport(periodId?: number): Observable<PayrollReport[]> {
    let params = new HttpParams();
    if (periodId) params = params.set('periodId', periodId.toString());

    return this.http.get<ApiResponse<PayrollReport[]>>(`${this.apiUrl}/reports/pension`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getDepartmentReport(periodId?: number): Observable<PayrollReport[]> {
    let params = new HttpParams();
    if (periodId) params = params.set('periodId', periodId.toString());

    return this.http.get<ApiResponse<PayrollReport[]>>(`${this.apiUrl}/reports/department`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getPayrollReports(periodId: number, reportType: string): Observable<any> {
    const endpoints: Record<string, string> = {
      'register': `/reports/register`,
      'tax': `/reports/tax`,
      'pension': `/reports/pension`,
      'department': `/reports/department`,
      'cost': `/reports/cost`
    };
    
    const endpoint = endpoints[reportType] || endpoints['register'];
    const params = new HttpParams().set('periodId', periodId.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}${endpoint}`, { params }).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }
}
