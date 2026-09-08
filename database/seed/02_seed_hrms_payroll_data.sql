-- ===================================================================
-- QA-Platform ERP - HRMS Payroll Sample Data
-- ===================================================================
-- Purpose: Seed data for complete payroll functionality testing
-- Version: 1.0
-- Created: 2026-09-08
-- ===================================================================

-- Clear existing data (in reverse dependency order)
TRUNCATE TABLE payslips RESTART IDENTITY CASCADE;
TRUNCATE TABLE payroll_journals RESTART IDENTITY CASCADE;
TRUNCATE TABLE payroll_runs RESTART IDENTITY CASCADE;
TRUNCATE TABLE employee_allowances RESTART IDENTITY CASCADE;
TRUNCATE TABLE allowance_types RESTART IDENTITY CASCADE;
TRUNCATE TABLE pension_rules RESTART IDENTITY CASCADE;
TRUNCATE TABLE tax_schedules RESTART IDENTITY CASCADE;
TRUNCATE TABLE payroll_periods RESTART IDENTITY CASCADE;
TRUNCATE TABLE employees RESTART IDENTITY CASCADE;

-- ===================================================================
-- EMPLOYEES (26 Sample Employees)
-- ===================================================================
INSERT INTO employees (employee_code, full_name, email, phone_number, job_title, department, employment_type, hire_date, status, is_active, created_by)
VALUES 
    ('RARAS-000009', 'Gebnet Employee Asfaw', 'gebnet.asfaw@gmail.com', '0934752834', 'Senior Accountant', 'Finance', 'Full Time', '2023-01-15', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000029', 'Berthu Easyas CEO', 'berthueasyas17@gmail.com', '0915151519', 'Frontend Developer', 'IT', 'Full Time', '2023-02-01', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000002', 'Gloria Tseme Castro', 'gloria17@khim.com', '0988776611', 'Frontend Developer', 'IT', 'Full Time', '2023-03-10', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000016', 'Alemu Kebede Desalegne', 'apolothaynessdta@gmail.com', '0901020304', 'QA', 'Quality Assurance', 'Full Time', '2023-04-05', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000010', 'Yemane Lead Desta', 'numan22cavoloackeroju.net', '0912121212', 'Software Engineer', 'IT', 'Full Time', '2023-05-20', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000008', 'Birhanu Employee Gardie', 'bire1@gmail.com', '0917345345', 'Beginner Accountant', 'Finance', 'Full Time', '2023-06-15', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000013', 'Selam Desalegn Garedew', 'selan03226@gmail.com', '2519111467701', 'Junior Accountant', 'Finance', 'Full Time', '2023-07-01', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000015', 'Azeb keena Hailu', 'keenazeb14@gmail.com', '0911414146', 'Office Administration', 'Administration', 'Full Time', '2023-08-10', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000017', 'Temesgen Meles Hailu', 'mwhdeal01@gmail.com', '0912504878', 'Chief', 'Management', 'Full Time', '2023-09-05', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000005', 'Tesfay Bsrat Hahle', 'bfox44207@gmail.com', '0943643207', 'Beginner Accountant', 'Finance', 'Full Time', '2023-10-12', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000011', 'Daniel Employee Asfaw', 'daniel.asfaw@company.com', '0934567890', 'Senior Developer', 'IT', 'Full Time', '2023-11-01', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000012', 'Hiwot Tekle Mariam', 'hiwot.tekle@company.com', '0923456789', 'HR Manager', 'Human Resources', 'Full Time', '2023-12-05', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000014', 'Meron Haile Gebre', 'meron.haile@company.com', '0945678901', 'Marketing Specialist', 'Marketing', 'Full Time', '2024-01-10', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000018', 'Kidus Abraha Wolde', 'kidus.abraha@company.com', '0956789012', 'Project Manager', 'IT', 'Full Time', '2024-02-15', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000019', 'Sara Negash Bekele', 'sara.negash@company.com', '0967890123', 'Business Analyst', 'Strategy', 'Full Time', '2024-03-01', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000020', 'Mahlet Girma Tadesse', 'mahlet.girma@company.com', '0978901234', 'Financial Analyst', 'Finance', 'Full Time', '2024-04-10', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000021', 'Dawit Mekonnen Assefa', 'dawit.mekonnen@company.com', '0989012345', 'DevOps Engineer', 'IT', 'Full Time', '2024-05-05', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000022', 'Bethlehem Getachew Molla', 'bethlehem.getachew@company.com', '0990123456', 'UX Designer', 'Design', 'Full Time', '2024-06-12', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000023', 'Amanuel Tesfaye Desta', 'amanuel.tesfaye@company.com', '0901234567', 'Sales Executive', 'Sales', 'Full Time', '2024-07-20', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000024', 'Hanna Yohannes Alemu', 'hanna.yohannes@company.com', '0912345678', 'Legal Advisor', 'Legal', 'Full Time', '2024-08-01', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000025', 'Robel Fekadu Lemma', 'robel.fekadu@company.com', '0923456780', 'Data Scientist', 'IT', 'Part Time', '2024-09-10', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000026', 'Eyob Solomon Tefera', 'eyob.solomon@company.com', '0934567891', 'System Administrator', 'IT', 'Contract', '2024-10-05', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000027', 'Rahel Mulugeta Assefa', 'rahel.mulugeta@company.com', '0945678902', 'Content Writer', 'Marketing', 'Part Time', '2024-11-15', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000028', 'Nathnael Worku Hailu', 'nathnael.worku@company.com', '0956789013', 'Network Engineer', 'IT', 'Full Time', '2024-12-01', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000030', 'Lidiya Bekele Tesfaye', 'lidiya.bekele@company.com', '0967890124', 'Customer Support', 'Support', 'Full Time', '2025-01-10', 'ACTIVE', TRUE, 'SYSTEM'),
    ('RARAS-000031', 'Yonas Tadesse Girma', 'yonas.tadesse@company.com', '0978901235', 'Security Specialist', 'Security', 'Full Time', '2025-02-01', 'ACTIVE', TRUE, 'SYSTEM');

-- ===================================================================
-- ALLOWANCE TYPES (Earnings and Deductions)
-- ===================================================================
INSERT INTO allowance_types (system_component, code, name, type, is_taxable, is_pensionable, is_recurring, effective_from, is_active, created_by)
VALUES 
    -- Earnings
    ('BONUS', 'BONUS', 'Bonus', 'EARNING', TRUE, TRUE, FALSE, '2025-01-01', TRUE, 'SYSTEM'),
    ('HOUSE', 'HOUSE', 'Housing Allowance', 'EARNING', FALSE, FALSE, TRUE, '2025-01-01', TRUE, 'SYSTEM'),
    ('LWP', 'LWP', 'Leave Without Pay', 'EARNING', FALSE, FALSE, FALSE, '2025-01-01', FALSE, 'SYSTEM'),
    ('BASIC', 'BASIC', 'Basic Salary', 'EARNING', TRUE, TRUE, TRUE, '2025-01-01', TRUE, 'SYSTEM'),
    ('TAX', 'TAX', 'Income Tax', 'DEDUCTION', FALSE, FALSE, TRUE, '2025-01-01', TRUE, 'SYSTEM'),
    ('LOAN', 'LOAN', 'Loan Deduction', 'DEDUCTION', FALSE, FALSE, TRUE, '2025-01-01', TRUE, 'SYSTEM'),
    ('OT', 'OT', 'Overtime', 'EARNING', TRUE, TRUE, FALSE, '2025-01-01', TRUE, 'SYSTEM'),
    ('TRANS', 'TRANS', 'Transport Allowance', 'EARNING', FALSE, FALSE, TRUE, '2025-01-01', TRUE, 'SYSTEM'),
    ('PENSION', 'PENSION', 'Pension Contribution', 'DEDUCTION', FALSE, FALSE, TRUE, '2025-01-01', TRUE, 'SYSTEM');

-- ===================================================================
-- EMPLOYEE ALLOWANCES (Sample Assignments)
-- ===================================================================
-- Assign Housing Allowance to all employees
INSERT INTO employee_allowances (employee_id, allowance_type_id, amount, currency, effective_from, is_active, created_by)
SELECT 
    e.id,
    (SELECT id FROM allowance_types WHERE system_component = 'HOUSE'),
    CASE 
        WHEN e.job_title LIKE '%Manager%' OR e.job_title LIKE '%Chief%' THEN 20000.00
        WHEN e.job_title LIKE '%Senior%' THEN 5000.00
        ELSE 3000.00
    END,
    'ETB',
    '2025-01-01',
    TRUE,
    'SYSTEM'
FROM employees e;

-- Assign Basic Salary to all employees
INSERT INTO employee_allowances (employee_id, allowance_type_id, amount, currency, effective_from, is_active, created_by)
SELECT 
    e.id,
    (SELECT id FROM allowance_types WHERE system_component = 'BASIC'),
    CASE 
        WHEN e.job_title LIKE '%Chief%' THEN 45000.00
        WHEN e.job_title LIKE '%Manager%' THEN 35000.00
        WHEN e.job_title LIKE '%Senior%' THEN 25000.00
        WHEN e.job_title LIKE '%Lead%' THEN 22000.00
        WHEN e.job_title LIKE '%Developer%' OR e.job_title LIKE '%Engineer%' THEN 18000.00
        WHEN e.job_title LIKE '%Analyst%' THEN 16000.00
        WHEN e.job_title LIKE '%Junior%' THEN 12000.00
        ELSE 10000.00
    END,
    'ETB',
    '2025-01-01',
    TRUE,
    'SYSTEM'
FROM employees e;

-- Assign Transport Allowance to Full Time employees
INSERT INTO employee_allowances (employee_id, allowance_type_id, amount, currency, effective_from, is_active, created_by)
SELECT 
    e.id,
    (SELECT id FROM allowance_types WHERE system_component = 'TRANS'),
    CASE 
        WHEN e.job_title LIKE '%Manager%' OR e.job_title LIKE '%Chief%' THEN 10000.00
        ELSE 3000.00
    END,
    'ETB',
    '2025-01-01',
    TRUE,
    'SYSTEM'
FROM employees e
WHERE e.employment_type = 'Full Time';

-- Assign some loan deductions
INSERT INTO employee_allowances (employee_id, allowance_type_id, amount, currency, effective_from, is_active, created_by)
VALUES 
    ((SELECT id FROM employees WHERE employee_code = 'RARAS-000009'), (SELECT id FROM allowance_types WHERE system_component = 'LOAN'), 5000.00, 'ETB', '2025-01-01', TRUE, 'SYSTEM'),
    ((SELECT id FROM employees WHERE employee_code = 'RARAS-000029'), (SELECT id FROM allowance_types WHERE system_component = 'LOAN'), 15000.00, 'ETB', '2025-01-01', TRUE, 'SYSTEM'),
    ((SELECT id FROM employees WHERE employee_code = 'RARAS-000008'), (SELECT id FROM allowance_types WHERE system_component = 'LOAN'), 12000.00, 'ETB', '2025-01-01', TRUE, 'SYSTEM');

-- ===================================================================
-- PAYROLL PERIODS
-- ===================================================================
INSERT INTO payroll_periods (code, start_date, end_date, status, is_active, created_by)
VALUES 
    ('2025-01', '2025-01-01', '2025-01-31', 'Open', TRUE, 'SYSTEM'),
    ('2025-02', '2025-02-01', '2025-02-28', 'Open', TRUE, 'SYSTEM'),
    ('2024-12', '2024-12-01', '2024-12-31', 'Closed', TRUE, 'SYSTEM'),
    ('2024-11', '2024-11-01', '2024-11-30', 'Closed', TRUE, 'SYSTEM');

-- ===================================================================
-- TAX SCHEDULES (Ethiopia 2025 Progressive Tax Brackets)
-- ===================================================================
INSERT INTO tax_schedules (order_no, from_amount, to_amount, rate_percent, gov_deduction, effective_from, is_active, created_by)
VALUES 
    (1, 0, 600, 0, 0, '2025-01-01', TRUE, 'SYSTEM'),
    (2, 600, 1650, 10, 60, '2025-01-01', TRUE, 'SYSTEM'),
    (3, 1650, 3200, 15, 142.50, '2025-01-01', TRUE, 'SYSTEM'),
    (4, 3200, 5250, 20, 302.50, '2025-01-01', TRUE, 'SYSTEM'),
    (5, 5250, 7800, 25, 565, '2025-01-01', TRUE, 'SYSTEM'),
    (6, 7800, 10900, 30, 955, '2025-01-01', TRUE, 'SYSTEM'),
    (7, 10900, NULL, 35, 1500, '2025-01-01', TRUE, 'SYSTEM');

-- ===================================================================
-- PENSION RULES (By Employment Type)
-- ===================================================================
INSERT INTO pension_rules (employment_type, employee_rate, employer_rate, effective_from, is_active, created_by)
VALUES 
    ('Full Time', 7.00, 11.00, '2025-01-01', TRUE, 'SYSTEM'),
    ('Part Time', 0.00, 0.00, '2025-01-01', TRUE, 'SYSTEM'),
    ('Contract', 0.00, 0.00, '2025-01-01', TRUE, 'SYSTEM'),
    ('Temporary', 0.00, 0.00, '2025-01-01', TRUE, 'SYSTEM'),
    ('Internship', 0.00, 0.00, '2025-01-01', TRUE, 'SYSTEM');

-- ===================================================================
-- PAYROLL RUNS (No runs yet - empty for user to create)
-- ===================================================================
-- Intentionally empty - users will create payroll runs through the UI

-- ===================================================================
-- PAYROLL JOURNALS (Empty - generated from payroll runs)
-- ===================================================================
-- Intentionally empty - journals are created when payroll runs are approved

-- ===================================================================
-- PAYSLIPS (Empty - generated from payroll runs)
-- ===================================================================
-- Intentionally empty - payslips are generated when payroll runs are processed

-- ===================================================================
-- Update audit timestamps
-- ===================================================================
UPDATE employees SET created_at = NOW() WHERE created_at IS NULL;
UPDATE allowance_types SET created_at = NOW() WHERE created_at IS NULL;
UPDATE employee_allowances SET created_at = NOW() WHERE created_at IS NULL;
UPDATE payroll_periods SET created_at = NOW() WHERE created_at IS NULL;
UPDATE tax_schedules SET created_at = NOW() WHERE created_at IS NULL;
UPDATE pension_rules SET created_at = NOW() WHERE created_at IS NULL;

-- ===================================================================
-- Display summary
-- ===================================================================
DO $$
DECLARE
    emp_count INTEGER;
    allowance_type_count INTEGER;
    emp_allowance_count INTEGER;
    period_count INTEGER;
    tax_count INTEGER;
    pension_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO emp_count FROM employees;
    SELECT COUNT(*) INTO allowance_type_count FROM allowance_types;
    SELECT COUNT(*) INTO emp_allowance_count FROM employee_allowances;
    SELECT COUNT(*) INTO period_count FROM payroll_periods;
    SELECT COUNT(*) INTO tax_count FROM tax_schedules;
    SELECT COUNT(*) INTO pension_count FROM pension_rules;
    
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'HRMS Payroll Seed Data Completed Successfully';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Employees: %', emp_count;
    RAISE NOTICE 'Allowance Types: %', allowance_type_count;
    RAISE NOTICE 'Employee Allowances: %', emp_allowance_count;
    RAISE NOTICE 'Payroll Periods: %', period_count;
    RAISE NOTICE 'Tax Schedules: %', tax_count;
    RAISE NOTICE 'Pension Rules: %', pension_count;
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Ready for payroll processing!';
    RAISE NOTICE '=================================================';
END $$;

-- ===================================================================
-- Verification Queries
-- ===================================================================
-- 1. View all employees with their allowances:
-- SELECT e.employee_code, e.full_name, e.department, 
--        at.name as allowance, ea.amount
-- FROM employees e
-- JOIN employee_allowances ea ON e.id = ea.employee_id
-- JOIN allowance_types at ON ea.allowance_type_id = at.id
-- WHERE e.is_active = TRUE AND ea.is_active = TRUE
-- ORDER BY e.employee_code, at.type, at.name;
--
-- 2. Calculate gross pay by employee:
-- SELECT e.employee_code, e.full_name, e.department,
--        SUM(CASE WHEN at.type = 'EARNING' THEN ea.amount ELSE 0 END) as gross_pay
-- FROM employees e
-- JOIN employee_allowances ea ON e.id = ea.employee_id
-- JOIN allowance_types at ON ea.allowance_type_id = at.id
-- WHERE e.is_active = TRUE AND ea.is_active = TRUE
-- GROUP BY e.id, e.employee_code, e.full_name, e.department
-- ORDER BY gross_pay DESC;
-- ===================================================================
