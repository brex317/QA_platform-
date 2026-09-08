import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/hrms/employees`;

  // Demo data matching reference screenshots exactly (26 employees)
  private demoEmployees: Employee[] = [
    { id: 1, code: 'RARAS-000009', fullName: 'Getnet Employee Asfaw', email: 'getnetasfaw7@gmail.com', phoneNumber: '0934752834', jobTitle: 'Senior Accountant', department: 'Finance', status: 'ACTIVE', hireDate: '2023-01-15', salary: 45000, basicSalary: 45000, isActive: true },
    { id: 2, code: 'RARAS-000029', fullName: 'Berihu Esayas CEO', email: 'berihuesayas317@gmail.com', phoneNumber: '0915516151', jobTitle: 'Frontend Developer', department: 'IT', status: 'ACTIVE', hireDate: '2023-02-20', salary: 55000, basicSalary: 55000, isActive: true },
    { id: 3, code: 'RARAS-000002', fullName: 'Gloria Teame Castro', email: 'jldeda2619@robustq.com', phoneNumber: '0988776611', jobTitle: 'Frontend Developer', department: 'IT', status: 'ACTIVE', hireDate: '2023-03-10', salary: 52000, basicSalary: 52000, isActive: true },
    { id: 4, code: 'RARAS-000016', fullName: 'Alemu kebede Desalegne', email: 'spalokhaypquaafdfb@vtmpj.com', phoneNumber: '0901020304', jobTitle: 'QA', department: 'IT', status: 'ACTIVE', hireDate: '2023-04-05', salary: 48000, basicSalary: 48000, isActive: true },
    { id: 5, code: 'RARAS-000010', fullName: 'Yemane Lead Desta', email: 'nwmtazhztqhzffolck@vtmpj.net', phoneNumber: '0912121212', jobTitle: 'Software Engineer', department: 'IT', status: 'ACTIVE', hireDate: '2023-05-12', salary: 60000, basicSalary: 60000, isActive: true },
    { id: 6, code: 'RARAS-000008', fullName: 'Birhanu Employee Gardie', email: 'birie16@gmail.com', phoneNumber: '0912345345', jobTitle: 'Beginner Accountant', department: 'Finance', status: 'ACTIVE', hireDate: '2023-06-01', salary: 35000, basicSalary: 35000, isActive: true },
    { id: 7, code: 'RARAS-000013', fullName: 'Selam Desalegn Garegew', email: 'selamdg22@gmail.com', phoneNumber: '251911467704', jobTitle: 'Junior Accountant', department: 'Finance', status: 'ACTIVE', hireDate: '2023-07-15', salary: 38000, basicSalary: 38000, isActive: true },
    { id: 8, code: 'RARAS-000015', fullName: 'Azeb kassa Hailu', email: 'unkqnzozcpohhquqqj@kjkpc.net', phoneNumber: '0914141414', jobTitle: 'Office Administration', department: 'HR', status: 'ACTIVE', hireDate: '2023-08-01', salary: 32000, basicSalary: 32000, isActive: true },
    { id: 9, code: 'RARAS-000017', fullName: 'Temesgen kidus Hailu', email: 'kyemivxngstanyi@onldm.net', phoneNumber: '0912568978', jobTitle: 'Chief', department: 'Executive', status: 'ACTIVE', hireDate: '2022-01-10', salary: 85000, basicSalary: 85000, isActive: true },
    { id: 10, code: 'RARAS-000005', fullName: 'Tesfay Bsrat Hishe', email: 'tesfaybsrat26@gmail.com', phoneNumber: '0943643207', jobTitle: 'Beginner Accountant', department: 'Finance', status: 'ACTIVE', hireDate: '2023-09-15', salary: 35000, basicSalary: 35000, isActive: true },
    { id: 11, code: 'RARAS-000004', fullName: 'Kidu Gidey Kahsay', email: 'kidugidey@gmail.com', phoneNumber: '0911223344', jobTitle: 'Systems Specialist', department: 'IT', status: 'ACTIVE', hireDate: '2023-10-01', salary: 50000, basicSalary: 50000, isActive: true },
    { id: 12, code: 'RARAS-000011', fullName: 'Mulugeta Haile Tekle', email: 'mulugeta@qa-platform.com', phoneNumber: '0922334455', jobTitle: 'HR Specialist', department: 'HR', status: 'ACTIVE', hireDate: '2023-10-12', salary: 42000, basicSalary: 42000, isActive: true },
    { id: 13, code: 'RARAS-000014', fullName: 'Tewodros Kassahun Bekele', email: 'tedo@qa-platform.com', phoneNumber: '0933445566', jobTitle: 'Payroll Specialist', department: 'Finance', status: 'ACTIVE', hireDate: '2023-11-01', salary: 46000, basicSalary: 46000, isActive: true },
    { id: 14, code: 'RARAS-000018', fullName: 'Aster Solomon Desta', email: 'aster@qa-platform.com', phoneNumber: '0944556677', jobTitle: 'Auditor', department: 'Finance', status: 'ACTIVE', hireDate: '2023-11-15', salary: 48000, basicSalary: 48000, isActive: true },
    { id: 15, code: 'RARAS-000019', fullName: 'Fikadu Zewde Worku', email: 'fikadu@qa-platform.com', phoneNumber: '0955667788', jobTitle: 'DevOps Engineer', department: 'IT', status: 'ACTIVE', hireDate: '2023-12-01', salary: 62000, basicSalary: 62000, isActive: true },
    { id: 16, code: 'RARAS-000020', fullName: 'Genet Tadesse Abera', email: 'genet@qa-platform.com', phoneNumber: '0966778899', jobTitle: 'QA Automation Engineer', department: 'IT', status: 'ACTIVE', hireDate: '2024-01-05', salary: 54000, basicSalary: 54000, isActive: true },
    { id: 17, code: 'RARAS-000021', fullName: 'Habtamu Girma Mengistu', email: 'habtamu@qa-platform.com', phoneNumber: '0977889900', jobTitle: 'Database Administrator', department: 'IT', status: 'ACTIVE', hireDate: '2024-01-15', salary: 58000, basicSalary: 58000, isActive: true },
    { id: 18, code: 'RARAS-000022', fullName: 'Helen Tariku Assefa', email: 'helen@qa-platform.com', phoneNumber: '0988990011', jobTitle: 'Recruiter', department: 'HR', status: 'ACTIVE', hireDate: '2024-02-01', salary: 40000, basicSalary: 40000, isActive: true },
    { id: 19, code: 'RARAS-000023', fullName: 'Kibrom Berhane Kidane', email: 'kibrom@qa-platform.com', phoneNumber: '0999001122', jobTitle: 'Backend Engineer', department: 'IT', status: 'ACTIVE', hireDate: '2024-02-15', salary: 60000, basicSalary: 60000, isActive: true },
    { id: 20, code: 'RARAS-000024', fullName: 'Ledia Wolde Kassa', email: 'ledia@qa-platform.com', phoneNumber: '0910112233', jobTitle: 'UI/UX Designer', department: 'IT', status: 'ACTIVE', hireDate: '2024-03-01', salary: 51000, basicSalary: 51000, isActive: true },
    { id: 21, code: 'RARAS-000025', fullName: 'Mesfin Alebachew Tsegaye', email: 'mesfin@qa-platform.com', phoneNumber: '0921223344', jobTitle: 'Project Manager', department: 'Operations', status: 'ACTIVE', hireDate: '2024-03-15', salary: 65000, basicSalary: 65000, isActive: true },
    { id: 22, code: 'RARAS-000026', fullName: 'Nigist Daniel Ferede', email: 'nigist@qa-platform.com', phoneNumber: '0932334455', jobTitle: 'Compliance Officer', department: 'Legal', status: 'ACTIVE', hireDate: '2024-04-01', salary: 53000, basicSalary: 53000, isActive: true },
    { id: 23, code: 'RARAS-000027', fullName: 'Sintayehu Melesse Baye', email: 'sinta@qa-platform.com', phoneNumber: '0943445566', jobTitle: 'Support Lead', department: 'Support', status: 'ACTIVE', hireDate: '2024-04-15', salary: 44000, basicSalary: 44000, isActive: true },
    { id: 24, code: 'RARAS-000028', fullName: 'Tigist Workneh Tola', email: 'tigist@qa-platform.com', phoneNumber: '0954556677', jobTitle: 'Training Specialist', department: 'HR', status: 'ACTIVE', hireDate: '2024-05-01', salary: 41000, basicSalary: 41000, isActive: true },
    { id: 25, code: 'RARAS-000030', fullName: 'Yonas Gebremedhin Kahsay', email: 'yonas@qa-platform.com', phoneNumber: '0965667788', jobTitle: 'Security Analyst', department: 'IT', status: 'ACTIVE', hireDate: '2024-05-15', salary: 57000, basicSalary: 57000, isActive: true },
    { id: 26, code: 'RARAS-000031', fullName: 'Zenebech Demisse Chala', email: 'zenebech@qa-platform.com', phoneNumber: '0976778899', jobTitle: 'Executive Secretary', department: 'Executive', status: 'ACTIVE', hireDate: '2024-06-01', salary: 36000, basicSalary: 36000, isActive: true }
  ];

  constructor(private http: HttpClient) {}

  getEmployees(filters?: { search?: string; status?: string; department?: string }): Observable<Employee[]> {
    let employees = [...this.demoEmployees];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      employees = employees.filter(emp =>
        emp.fullName.toLowerCase().includes(search) ||
        emp.code.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.jobTitle.toLowerCase().includes(search)
      );
    }

    if (filters?.status && filters.status !== '') {
      employees = employees.filter(emp => emp.status === filters.status);
    }

    if (filters?.department && filters.department !== '') {
      employees = employees.filter(emp => emp.department === filters.department);
    }

    return of(employees).pipe(delay(100));
  }

  getEmployeeById(id: number): Observable<Employee | null> {
    const employee = this.demoEmployees.find(emp => emp.id === id);
    return of(employee || null).pipe(delay(100));
  }

  createEmployee(data: Partial<Employee>): Observable<Employee> {
    const newEmployee: Employee = {
      id: this.demoEmployees.length + 1,
      code: `RARAS-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      fullName: data.fullName || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      jobTitle: data.jobTitle || '',
      department: data.department || '',
      status: data.status || 'ACTIVE',
      hireDate: data.hireDate || new Date().toISOString().split('T')[0],
      salary: data.salary || data.basicSalary,
      basicSalary: data.basicSalary || data.salary,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.demoEmployees.push(newEmployee);
    return of(newEmployee).pipe(delay(100));
  }

  updateEmployee(id: number, data: Partial<Employee>): Observable<Employee> {
    const index = this.demoEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.demoEmployees[index] = {
        ...this.demoEmployees[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return of(this.demoEmployees[index]).pipe(delay(100));
    }
    throw new Error('Employee not found');
  }

  deleteEmployee(id: number): Observable<boolean> {
    const index = this.demoEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.demoEmployees.splice(index, 1);
      return of(true).pipe(delay(100));
    }
    return of(false);
  }

  getDepartments(): Observable<string[]> {
    const departments = [...new Set(this.demoEmployees.map(emp => emp.department))];
    return of(departments);
  }

  getStatistics(): Observable<{
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
  }> {
    const stats = {
      total: this.demoEmployees.length,
      active: this.demoEmployees.filter(emp => emp.status === 'ACTIVE').length,
      inactive: this.demoEmployees.filter(emp => emp.status === 'INACTIVE').length,
      onLeave: this.demoEmployees.filter(emp => emp.status === 'ON_LEAVE').length
    };
    return of(stats);
  }
}
