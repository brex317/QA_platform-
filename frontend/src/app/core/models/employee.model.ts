export interface Employee {
  id: number;
  code: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  hireDate: string;
  salary?: number;
  basicSalary?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeFilters {
  search: string;
  status: string;
  department: string;
}
