# QA-Platform ERP - Database Design

## Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Navigation Schema](#navigation-schema)
4. [HRMS Payroll Schema](#hrms-payroll-schema)
5. [Relationships & Constraints](#relationships--constraints)
6. [Indexing Strategy](#indexing-strategy)
7. [Data Types & Conventions](#data-types--conventions)

---

## Overview

The QA-Platform ERP database is designed using PostgreSQL with a focus on:
- **Normalization**: Minimize data redundancy
- **Integrity**: Foreign key constraints and referential integrity
- **Performance**: Strategic indexing for common queries
- **Audit Trail**: Timestamp tracking on all tables
- **Flexibility**: Support for configuration-driven features

### Database Information
- **Database System**: PostgreSQL 14+
- **Character Set**: UTF-8
- **Collation**: Default (en_US.UTF-8)
- **Time Zone**: UTC

---

## Database Schema

### Schema Organization

```
qa_platform (database)
├── public (schema)
│   ├── Navigation Tables
│   │   └── nav_nodes
│   └── HRMS Tables
│       ├── employees
│       ├── allowance_types
│       ├── employee_allowances
│       ├── payroll_periods
│       ├── tax_schedules
│       ├── pension_rules
│       ├── payroll_runs
│       ├── payroll_journals
│       └── payslips
```

---

## Navigation Schema

### Table: `nav_nodes`

**Purpose**: Stores hierarchical navigation menu structure for the entire application.

**Schema**:
```sql
CREATE TABLE nav_nodes (
    id BIGSERIAL PRIMARY KEY,
    node_key VARCHAR(150) NOT NULL UNIQUE,
    parent_id BIGINT REFERENCES nav_nodes(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    route_url VARCHAR(255),
    icon VARCHAR(80),
    display_order INT DEFAULT 0,
    depth INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_nav_nodes_parent ON nav_nodes(parent_id);
CREATE INDEX idx_nav_nodes_key ON nav_nodes(node_key);
CREATE INDEX idx_nav_nodes_active ON nav_nodes(is_active);
```

**Columns**:
- `id`: Primary key, auto-incrementing
- `node_key`: Unique identifier for the node (e.g., "hrms.payroll.dashboard")
- `parent_id`: Self-referencing foreign key for hierarchical structure
- `title`: Display name in the navigation menu
- `route_url`: Angular route path (null for parent nodes)
- `icon`: Icon identifier/class name
- `display_order`: Sort order within parent group
- `depth`: Level in hierarchy (1 = root, 2 = child, etc.)
- `is_active`: Soft delete flag
- `created_at`, `updated_at`: Audit timestamps
- `created_by`, `updated_by`: Audit user tracking

**Sample Data**:
```sql
-- Root node
INSERT INTO nav_nodes (node_key, parent_id, title, icon, display_order, depth)
VALUES ('hrms', NULL, 'HRMS', 'users', 3, 1);

-- Child node
INSERT INTO nav_nodes (node_key, parent_id, title, icon, display_order, depth)
VALUES ('hrms.compensation', 1, 'Compensation', 'dollar-sign', 2, 2);

-- Leaf node with route
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth)
VALUES ('hrms.payroll.dashboard', 2, 'Dashboard', '/hrms/payroll/dashboard', 'chart-line', 1, 3);
```

**Key Features**:
- Self-referencing relationship enables unlimited depth
- Cascade delete ensures orphan nodes are removed
- `node_key` provides stable identifier for code references
- `display_order` controls menu item ordering
- `route_url` NULL for parent/group nodes, populated for leaf/clickable nodes

---

## HRMS Payroll Schema

### Table: `employees`

**Purpose**: Stores employee master data.

**Schema**:
```sql
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    employment_type VARCHAR(50),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_department ON employees(department);
```

**Columns**:
- `employee_code`: Unique employee identifier (e.g., "RARAS-000009")
- `full_name`: Employee's full name
- `email`: Unique email address
- `phone_number`: Contact number
- `job_title`: Position/role
- `department`: Department name
- `employment_type`: Full Time, Part Time, Contract, Temporary, Internship
- `hire_date`: Employment start date
- `status`: ACTIVE, INACTIVE, TERMINATED, ON_LEAVE

---

### Table: `allowance_types`

**Purpose**: Defines earning and deduction components used in payroll calculations.

**Schema**:
```sql
CREATE TABLE allowance_types (
    id BIGSERIAL PRIMARY KEY,
    system_component VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL, -- EARNING or DEDUCTION
    is_taxable BOOLEAN DEFAULT FALSE,
    is_pensionable BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT chk_allowance_type CHECK (type IN ('EARNING', 'DEDUCTION'))
);

CREATE INDEX idx_allowance_types_code ON allowance_types(code);
CREATE INDEX idx_allowance_types_type ON allowance_types(type);
CREATE INDEX idx_allowance_types_active ON allowance_types(is_active);
```

**Columns**:
- `system_component`: Internal system identifier (e.g., "BONUS", "HOUSE", "TAX")
- `code`: Short code for display
- `name`: Display name
- `type`: EARNING (increases pay) or DEDUCTION (decreases pay)
- `is_taxable`: Whether this component is subject to income tax
- `is_pensionable`: Whether this component is included in pension calculation
- `is_recurring`: True for monthly allowances, false for one-time payments
- `effective_from/to`: Date range for allowance validity

**Sample Allowance Types**:
- **Earnings**: Basic Salary, Housing Allowance, Transport Allowance, Bonus, Overtime
- **Deductions**: Income Tax, Pension Contribution, Loan Deduction, Advance Deduction

---

### Table: `employee_allowances`

**Purpose**: Assigns specific allowance types to employees with amounts.

**Schema**:
```sql
CREATE TABLE employee_allowances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    allowance_type_id BIGINT NOT NULL REFERENCES allowance_types(id) ON DELETE RESTRICT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ETB',
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT uk_employee_allowance UNIQUE (employee_id, allowance_type_id, effective_from)
);

CREATE INDEX idx_employee_allowances_employee ON employee_allowances(employee_id);
CREATE INDEX idx_employee_allowances_type ON employee_allowances(allowance_type_id);
CREATE INDEX idx_employee_allowances_active ON employee_allowances(is_active);
```

**Columns**:
- `employee_id`: Reference to employee
- `allowance_type_id`: Reference to allowance type
- `amount`: Monetary amount
- `currency`: Currency code (default ETB - Ethiopian Birr)
- `effective_from/to`: Date range for allowance validity
- `is_active`: Active status

**Constraints**:
- Unique combination of employee, allowance type, and effective date
- Prevents duplicate allowance assignments

---

### Table: `payroll_periods`

**Purpose**: Defines payroll processing periods (monthly, bi-weekly, etc.).

**Schema**:
```sql
CREATE TABLE payroll_periods (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Open',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT chk_period_status CHECK (status IN ('Open', 'Closed')),
    CONSTRAINT chk_period_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_payroll_periods_status ON payroll_periods(status);
CREATE INDEX idx_payroll_periods_dates ON payroll_periods(start_date, end_date);
```

**Columns**:
- `code`: Period identifier (e.g., "2025-01", "2025-Q1")
- `start_date`: Period start date
- `end_date`: Period end date (inclusive)
- `status`: Open (can process payroll), Closed (locked)

**Business Rules**:
- Only one period should be Open at a time
- Cannot process payroll for Closed periods
- Periods should not overlap

---

### Table: `tax_schedules`

**Purpose**: Defines progressive income tax brackets and rates.

**Schema**:
```sql
CREATE TABLE tax_schedules (
    id BIGSERIAL PRIMARY KEY,
    order_no INT NOT NULL,
    from_amount DECIMAL(15,2) NOT NULL,
    to_amount DECIMAL(15,2),
    rate_percent DECIMAL(5,2) NOT NULL,
    gov_deduction DECIMAL(15,2) DEFAULT 0,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT chk_tax_rate CHECK (rate_percent >= 0 AND rate_percent <= 100)
);

CREATE INDEX idx_tax_schedules_effective ON tax_schedules(effective_from, effective_to);
CREATE INDEX idx_tax_schedules_order ON tax_schedules(order_no);
```

**Columns**:
- `order_no`: Bracket order (1, 2, 3, ...)
- `from_amount`: Lower bound of income range
- `to_amount`: Upper bound (NULL for highest bracket)
- `rate_percent`: Tax rate (0-35%)
- `gov_deduction`: Fixed deduction amount for this bracket
- `effective_from/to`: Date range for tax schedule validity

**Sample Tax Schedule** (Ethiopia 2025):
```
Order | From      | To        | Rate | Gov Deduction
------|-----------|-----------|------|---------------
1     | 0         | 600       | 0%   | 0
2     | 600       | 1,650     | 10%  | 60
3     | 1,650     | 3,200     | 15%  | 142.50
4     | 3,200     | 5,250     | 20%  | 302.50
5     | 5,250     | 7,800     | 25%  | 565
6     | 7,800     | 10,900    | 30%  | 955
7     | 10,900    | NULL      | 35%  | 1,500
```

---

### Table: `pension_rules`

**Purpose**: Defines pension contribution rates by employment type.

**Schema**:
```sql
CREATE TABLE pension_rules (
    id BIGSERIAL PRIMARY KEY,
    employment_type VARCHAR(50) NOT NULL,
    employee_rate DECIMAL(5,2) NOT NULL,
    employer_rate DECIMAL(5,2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT uk_pension_employment_type UNIQUE (employment_type, effective_from)
);

CREATE INDEX idx_pension_rules_type ON pension_rules(employment_type);
CREATE INDEX idx_pension_rules_effective ON pension_rules(effective_from);
```

**Columns**:
- `employment_type`: Full Time, Part Time, Contract, etc.
- `employee_rate`: Employee contribution percentage (e.g., 7%)
- `employer_rate`: Employer contribution percentage (e.g., 11%)
- `effective_from/to`: Date range for rule validity

**Sample Pension Rules**:
```
Employment Type | Employee Rate | Employer Rate
----------------|---------------|---------------
Full Time       | 7%            | 11%
Part Time       | 0%            | 0%
Contract        | 0%            | 0%
```

---

### Table: `payroll_runs`

**Purpose**: Records payroll execution instances.

**Schema**:
```sql
CREATE TABLE payroll_runs (
    id BIGSERIAL PRIMARY KEY,
    run_number VARCHAR(50) NOT NULL UNIQUE,
    period_id BIGINT NOT NULL REFERENCES payroll_periods(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'Draft',
    total_employees INT DEFAULT 0,
    gross_amount DECIMAL(18,2) DEFAULT 0,
    net_amount DECIMAL(18,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'ETB',
    processed_date TIMESTAMPTZ,
    approved_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT chk_run_status CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Paid', 'Reversed'))
);

CREATE INDEX idx_payroll_runs_period ON payroll_runs(period_id);
CREATE INDEX idx_payroll_runs_status ON payroll_runs(status);
```

**Columns**:
- `run_number`: Unique run identifier (e.g., "PR-2025-01-001")
- `period_id`: Reference to payroll period
- `status`: Draft → Submitted → Approved → Paid → Reversed
- `total_employees`: Number of employees in this run
- `gross_amount`: Total gross pay
- `net_amount`: Total net pay
- `processed_date`: When run was calculated
- `approved_date`: When run was approved
- `paid_date`: When payments were made

**Status Workflow**:
1. **Draft**: Being prepared, can be edited
2. **Submitted**: Submitted for approval, locked for editing
3. **Approved**: Approved by manager, ready for payment
4. **Paid**: Payments have been processed
5. **Reversed**: Cancelled/reversed (error correction)

---

### Table: `payroll_journals`

**Purpose**: Accounting journal entries for payroll transactions.

**Schema**:
```sql
CREATE TABLE payroll_journals (
    id BIGSERIAL PRIMARY KEY,
    run_id BIGINT NOT NULL REFERENCES payroll_runs(id) ON DELETE RESTRICT,
    journal_number VARCHAR(50) NOT NULL UNIQUE,
    journal_date DATE NOT NULL,
    debit_amount DECIMAL(18,2) DEFAULT 0,
    credit_amount DECIMAL(18,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'ETB',
    status VARCHAR(20) DEFAULT 'Draft',
    posted_date TIMESTAMPTZ,
    reversed_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT chk_journal_status CHECK (status IN ('Draft', 'Posted', 'Reversed'))
);

CREATE INDEX idx_payroll_journals_run ON payroll_journals(run_id);
CREATE INDEX idx_payroll_journals_status ON payroll_journals(status);
CREATE INDEX idx_payroll_journals_date ON payroll_journals(journal_date);
```

**Columns**:
- `run_id`: Reference to payroll run
- `journal_number`: Unique journal identifier (e.g., "JE-2025-01-001")
- `journal_date`: Effective date of journal entry
- `debit_amount`: Total debit amount
- `credit_amount`: Total credit amount
- `status`: Draft, Posted, Reversed
- `posted_date`: When posted to accounting system

---

### Table: `payslips`

**Purpose**: Individual employee payslips for each payroll run.

**Schema**:
```sql
CREATE TABLE payslips (
    id BIGSERIAL PRIMARY KEY,
    payroll_run_id BIGINT NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    gross_pay DECIMAL(15,2) DEFAULT 0,
    tax_deduction DECIMAL(15,2) DEFAULT 0,
    pension_deduction DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    net_pay DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'ETB',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT uk_payslip UNIQUE (payroll_run_id, employee_id)
);

CREATE INDEX idx_payslips_run ON payslips(payroll_run_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
```

**Columns**:
- `payroll_run_id`: Reference to payroll run
- `employee_id`: Reference to employee
- `gross_pay`: Total earnings before deductions
- `tax_deduction`: Income tax amount
- `pension_deduction`: Pension contribution
- `other_deductions`: Loans, advances, etc.
- `net_pay`: Take-home pay (gross - all deductions)

**Constraints**:
- One payslip per employee per payroll run

---

## Relationships & Constraints

### Foreign Key Relationships

```
nav_nodes.parent_id → nav_nodes.id (self-referencing)
employee_allowances.employee_id → employees.id
employee_allowances.allowance_type_id → allowance_types.id
payroll_runs.period_id → payroll_periods.id
payroll_journals.run_id → payroll_runs.id
payslips.payroll_run_id → payroll_runs.id
payslips.employee_id → employees.id
```

### Cascading Rules

- **CASCADE**: `nav_nodes` (delete parent deletes children)
- **RESTRICT**: Most foreign keys (prevent deletion if referenced)
- **SET NULL**: Not used in this schema

---

## Indexing Strategy

### Primary Indexes
- All tables have `id BIGSERIAL PRIMARY KEY`
- Auto-indexed on primary key

### Foreign Key Indexes
- All foreign key columns are indexed
- Improves JOIN performance
- Speeds up referential integrity checks

### Query-Specific Indexes
- `employees.status, department` - Filter/group queries
- `allowance_types.type, is_active` - Type filtering
- `payroll_runs.status` - Status-based queries
- `payroll_periods.start_date, end_date` - Date range queries

### Unique Indexes
- `employees.employee_code, email`
- `allowance_types.system_component, code`
- `nav_nodes.node_key`
- Enforces business uniqueness constraints

---

## Data Types & Conventions

### Naming Conventions
- **Tables**: Lowercase with underscores (snake_case)
- **Columns**: Lowercase with underscores
- **Primary Keys**: Always `id`
- **Foreign Keys**: `{table_name}_id`
- **Boolean Flags**: Prefix with `is_` or `has_`

### Data Types
- **IDs**: `BIGSERIAL` (handles billions of records)
- **Money**: `DECIMAL(15,2)` or `DECIMAL(18,2)` for totals
- **Percentages**: `DECIMAL(5,2)` (up to 999.99%)
- **Dates**: `DATE` for dates, `TIMESTAMPTZ` for timestamps
- **Text**: `VARCHAR` with appropriate limits
- **Flags**: `BOOLEAN`

### Audit Columns (Standard on All Tables)
```sql
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ,
created_by VARCHAR(100),
updated_by VARCHAR(100)
```

### Soft Delete Pattern
```sql
is_active BOOLEAN DEFAULT TRUE
```
- Never physically delete records
- Set `is_active = FALSE` instead
- Queries should filter by `is_active = TRUE`

---

## Query Examples

### Get Navigation Tree
```sql
WITH RECURSIVE nav_tree AS (
    -- Base case: root nodes
    SELECT id, node_key, parent_id, title, route_url, icon, 
           display_order, depth, 1 as level
    FROM nav_nodes
    WHERE parent_id IS NULL AND is_active = TRUE
    
    UNION ALL
    
    -- Recursive case: children
    SELECT n.id, n.node_key, n.parent_id, n.title, n.route_url, 
           n.icon, n.display_order, n.depth, nt.level + 1
    FROM nav_nodes n
    INNER JOIN nav_tree nt ON n.parent_id = nt.id
    WHERE n.is_active = TRUE
)
SELECT * FROM nav_tree ORDER BY level, display_order;
```

### Calculate Employee Gross Pay
```sql
SELECT e.id, e.full_name,
       SUM(CASE WHEN at.type = 'EARNING' THEN ea.amount ELSE 0 END) as gross_pay
FROM employees e
INNER JOIN employee_allowances ea ON e.id = ea.employee_id
INNER JOIN allowance_types at ON ea.allowance_type_id = at.id
WHERE e.is_active = TRUE 
  AND ea.is_active = TRUE 
  AND at.is_active = TRUE
GROUP BY e.id, e.full_name;
```

### Get Active Tax Schedule
```sql
SELECT * FROM tax_schedules
WHERE is_active = TRUE
  AND effective_from <= CURRENT_DATE
  AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
ORDER BY order_no;
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-08  
**Author**: QA-Platform Development Team
