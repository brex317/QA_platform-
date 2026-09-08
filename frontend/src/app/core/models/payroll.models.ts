export interface PayrollDashboard {
  totalEmployees: number;
  activePeriod: string;
  totalPayrollRuns: number;
  totalGrossPay: number;
  totalNetPay: number;
  currency: string;
}

export interface AllowanceType {
  id: number;
  systemComponent: string;
  code: string;
  name: string;
  type: string;
  isTaxable: boolean;
  isPensionable: boolean;
  isRecurring: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface EmployeeAllowance {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  allowanceTypeId: number;
  allowanceCode: string;
  allowanceName: string;
  allowanceType: string;
  amount: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface PayrollPeriod {
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
}

export interface TaxSchedule {
  id: number;
  orderNo: number;
  fromAmount: number;
  toAmount: number | null;
  ratePercent: number;
  govDeduction: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface PensionRule {
  id: number;
  employmentType: string;
  employeeRate: number;
  employerRate: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
}

export interface PayrollRun {
  id: number;
  runNumber: string;
  periodId: number;
  periodCode: string;
  status: string;
  totalEmployees: number;
  grossAmount: number;
  netAmount: number;
  currency: string;
  processedDate: string | null;
  approvedDate: string | null;
  paidDate: string | null;
  createdAt: string;
}

export interface PayrollJournal {
  id: number;
  runId: number;
  runNumber: string;
  journalNumber: string;
  journalDate: string;
  debitAmount: number;
  creditAmount: number;
  currency: string;
  status: string;
  postedDate: string | null;
  createdAt: string;
}

export interface Payslip {
  id: number;
  payrollRunId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  department: string;
  grossPay: number;
  taxDeduction: number;
  pensionDeduction: number;
  otherDeductions: number;
  netPay: number;
  currency: string;
}

export interface PayrollReport {
  employeeCode: string;
  employeeName: string;
  department: string;
  grossPay: number;
  taxDeduction: number;
  pensionDeduction: number;
  netPay: number;
}
