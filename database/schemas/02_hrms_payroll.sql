-- ===================================================================
-- QA-Platform ERP - HRMS Payroll Schema
-- ===================================================================
-- Purpose: Complete payroll processing functionality
-- Version: 1.0
-- Created: 2026-09-08
-- ===================================================================

-- Drop tables if exist (for clean re-creation, in reverse dependency order)
DROP TABLE IF EXISTS payslips CASCADE;
DROP TABLE IF EXISTS payroll_journals CASCADE;
DROP TABLE IF EXISTS payroll_runs CASCADE;
DROP TABLE IF EXISTS employee_allowances CASCADE;
DROP TABLE IF EXISTS allowance_types CASCADE;
DROP TABLE IF EXISTS pension_rules CASCADE;
DROP TABLE IF EXISTS tax_schedules CASCADE;
DROP TABLE IF EXISTS payroll_periods CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- ===================================================================
-- Table: employees
-- Purpose: Employee master data
-- ===================================================================
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'Full Time',
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT chk_employee_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE'))
);

-- Indexes
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_employment_type ON employees(employment_type);

-- Comments
COMMENT ON TABLE employees IS 'Employee master data for payroll processing';
COMMENT ON COLUMN employees.employee_code IS 'Unique employee identifier (e.g., "RARAS-000009")';
COMMENT ON COLUMN employees.employment_type IS 'Full Time, Part Time, Contract, Temporary, Internship';

-- ===================================================================
-- Table: allowance_types
-- Purpose: Defines earning and deduction components
-- ===================================================================
CREATE TABLE allowance_types (
    id BIGSERIAL PRIMARY KEY,
    system_component VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL,
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
    
    -- Constraints
    CONSTRAINT chk_allowance_type CHECK (type IN ('EARNING', 'DEDUCTION')),
    CONSTRAINT chk_allowance_dates CHECK (effective_to IS NULL OR effective_to > effective_from)
);

-- Indexes
CREATE INDEX idx_allowance_types_code ON allowance_types(code);
CREATE INDEX idx_allowance_types_type ON allowance_types(type);
CREATE INDEX idx_allowance_types_active ON allowance_types(is_active);
CREATE INDEX idx_allowance_types_effective ON allowance_types(effective_from, effective_to);

-- Comments
COMMENT ON TABLE allowance_types IS 'Defines earning and deduction components used in payroll calculations';
COMMENT ON COLUMN allowance_types.system_component IS 'Internal system identifier (e.g., "BONUS", "HOUSE", "TAX")';
COMMENT ON COLUMN allowance_types.type IS 'EARNING (increases pay) or DEDUCTION (decreases pay)';
COMMENT ON COLUMN allowance_types.is_taxable IS 'Whether this component is subject to income tax';
COMMENT ON COLUMN allowance_types.is_pensionable IS 'Whether this component is included in pension calculation';

-- ===================================================================
-- Table: employee_allowances
-- Purpose: Assigns specific allowance types to employees with amounts
-- ===================================================================
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
    
    -- Constraints
    CONSTRAINT chk_employee_allowance_amount CHECK (amount >= 0),
    CONSTRAINT chk_employee_allowance_dates CHECK (effective_to IS NULL OR effective_to > effective_from),
    CONSTRAINT uk_employee_allowance UNIQUE (employee_id, allowance_type_id, effective_from)
);

-- Indexes
CREATE INDEX idx_employee_allowances_employee ON employee_allowances(employee_id);
CREATE INDEX idx_employee_allowances_type ON employee_allowances(allowance_type_id);
CREATE INDEX idx_employee_allowances_active ON employee_allowances(is_active);
CREATE INDEX idx_employee_allowances_effective ON employee_allowances(effective_from, effective_to);

-- Comments
COMMENT ON TABLE employee_allowances IS 'Assigns specific allowance types to employees with monetary amounts';
COMMENT ON COLUMN employee_allowances.currency IS 'Currency code (default ETB - Ethiopian Birr)';

-- ===================================================================
-- Table: payroll_periods
-- Purpose: Defines payroll processing periods
-- ===================================================================
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
    
    -- Constraints
    CONSTRAINT chk_period_status CHECK (status IN ('Open', 'Closed')),
    CONSTRAINT chk_period_dates CHECK (end_date > start_date)
);

-- Indexes
CREATE INDEX idx_payroll_periods_code ON payroll_periods(code);
CREATE INDEX idx_payroll_periods_status ON payroll_periods(status);
CREATE INDEX idx_payroll_periods_dates ON payroll_periods(start_date, end_date);
CREATE INDEX idx_payroll_periods_active ON payroll_periods(is_active);

-- Comments
COMMENT ON TABLE payroll_periods IS 'Defines payroll processing periods (monthly, bi-weekly, etc.)';
COMMENT ON COLUMN payroll_periods.code IS 'Period identifier (e.g., "2025-01", "2025-Q1")';
COMMENT ON COLUMN payroll_periods.status IS 'Open (can process payroll), Closed (locked)';

-- ===================================================================
-- Table: tax_schedules
-- Purpose: Defines progressive income tax brackets and rates
-- ===================================================================
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
    
    -- Constraints
    CONSTRAINT chk_tax_rate CHECK (rate_percent >= 0 AND rate_percent <= 100),
    CONSTRAINT chk_tax_amounts CHECK (to_amount IS NULL OR to_amount > from_amount),
    CONSTRAINT chk_tax_order CHECK (order_no > 0),
    CONSTRAINT chk_tax_dates CHECK (effective_to IS NULL OR effective_to > effective_from)
);

-- Indexes
CREATE INDEX idx_tax_schedules_effective ON tax_schedules(effective_from, effective_to);
CREATE INDEX idx_tax_schedules_order ON tax_schedules(order_no);
CREATE INDEX idx_tax_schedules_active ON tax_schedules(is_active);

-- Comments
COMMENT ON TABLE tax_schedules IS 'Defines progressive income tax brackets and rates';
COMMENT ON COLUMN tax_schedules.order_no IS 'Bracket order (1, 2, 3, ...)';
COMMENT ON COLUMN tax_schedules.to_amount IS 'Upper bound (NULL for highest bracket)';
COMMENT ON COLUMN tax_schedules.gov_deduction IS 'Fixed deduction amount for this bracket';

-- ===================================================================
-- Table: pension_rules
-- Purpose: Defines pension contribution rates by employment type
-- ===================================================================
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
    
    -- Constraints
    CONSTRAINT chk_pension_employee_rate CHECK (employee_rate >= 0 AND employee_rate <= 100),
    CONSTRAINT chk_pension_employer_rate CHECK (employer_rate >= 0 AND employer_rate <= 100),
    CONSTRAINT chk_pension_dates CHECK (effective_to IS NULL OR effective_to > effective_from),
    CONSTRAINT uk_pension_employment_type UNIQUE (employment_type, effective_from)
);

-- Indexes
CREATE INDEX idx_pension_rules_type ON pension_rules(employment_type);
CREATE INDEX idx_pension_rules_effective ON pension_rules(effective_from, effective_to);
CREATE INDEX idx_pension_rules_active ON pension_rules(is_active);

-- Comments
COMMENT ON TABLE pension_rules IS 'Defines pension contribution rates by employment type';
COMMENT ON COLUMN pension_rules.employee_rate IS 'Employee contribution percentage (e.g., 7%)';
COMMENT ON COLUMN pension_rules.employer_rate IS 'Employer contribution percentage (e.g., 11%)';

-- ===================================================================
-- Table: payroll_runs
-- Purpose: Records payroll execution instances
-- ===================================================================
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
    reversed_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT chk_run_status CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Paid', 'Reversed')),
    CONSTRAINT chk_run_employees CHECK (total_employees >= 0),
    CONSTRAINT chk_run_gross CHECK (gross_amount >= 0),
    CONSTRAINT chk_run_net CHECK (net_amount >= 0)
);

-- Indexes
CREATE INDEX idx_payroll_runs_number ON payroll_runs(run_number);
CREATE INDEX idx_payroll_runs_period ON payroll_runs(period_id);
CREATE INDEX idx_payroll_runs_status ON payroll_runs(status);
CREATE INDEX idx_payroll_runs_active ON payroll_runs(is_active);

-- Comments
COMMENT ON TABLE payroll_runs IS 'Records payroll execution instances';
COMMENT ON COLUMN payroll_runs.run_number IS 'Unique run identifier (e.g., "PR-2025-01-001")';
COMMENT ON COLUMN payroll_runs.status IS 'Draft → Submitted → Approved → Paid → Reversed';

-- ===================================================================
-- Table: payroll_journals
-- Purpose: Accounting journal entries for payroll transactions
-- ===================================================================
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
    
    -- Constraints
    CONSTRAINT chk_journal_status CHECK (status IN ('Draft', 'Posted', 'Reversed')),
    CONSTRAINT chk_journal_debit CHECK (debit_amount >= 0),
    CONSTRAINT chk_journal_credit CHECK (credit_amount >= 0)
);

-- Indexes
CREATE INDEX idx_payroll_journals_number ON payroll_journals(journal_number);
CREATE INDEX idx_payroll_journals_run ON payroll_journals(run_id);
CREATE INDEX idx_payroll_journals_status ON payroll_journals(status);
CREATE INDEX idx_payroll_journals_date ON payroll_journals(journal_date);
CREATE INDEX idx_payroll_journals_active ON payroll_journals(is_active);

-- Comments
COMMENT ON TABLE payroll_journals IS 'Accounting journal entries for payroll transactions';
COMMENT ON COLUMN payroll_journals.journal_number IS 'Unique journal identifier (e.g., "JE-2025-01-001")';

-- ===================================================================
-- Table: payslips
-- Purpose: Individual employee payslips for each payroll run
-- ===================================================================
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
    
    -- Constraints
    CONSTRAINT chk_payslip_gross CHECK (gross_pay >= 0),
    CONSTRAINT chk_payslip_tax CHECK (tax_deduction >= 0),
    CONSTRAINT chk_payslip_pension CHECK (pension_deduction >= 0),
    CONSTRAINT chk_payslip_other CHECK (other_deductions >= 0),
    CONSTRAINT chk_payslip_net CHECK (net_pay >= 0),
    CONSTRAINT uk_payslip UNIQUE (payroll_run_id, employee_id)
);

-- Indexes
CREATE INDEX idx_payslips_run ON payslips(payroll_run_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_payslips_active ON payslips(is_active);

-- Comments
COMMENT ON TABLE payslips IS 'Individual employee payslips for each payroll run';
COMMENT ON COLUMN payslips.net_pay IS 'Take-home pay (gross - all deductions)';

-- ===================================================================
-- Verification Queries
-- ===================================================================
-- Run these queries to verify table creation:
--
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
-- ORDER BY table_name;
--
-- SELECT COUNT(*) as table_count FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- ===================================================================
