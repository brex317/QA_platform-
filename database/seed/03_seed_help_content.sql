-- ===================================================================
-- QA-Platform ERP - Contextual Help Seed Data
-- ===================================================================
-- Purpose: Seeds nav_nodes form-field children and rich help content
-- Version: 1.1
-- Created: 2026-09-09
-- ===================================================================

-- 1. Insert Form Field Level nav_nodes (depth = 5, route_url = NULL)
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES
  -- Allowance Types form fields
  ('hrms.payroll.allowance_types.system_component', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'System Component', NULL, NULL, 1, 5, TRUE),
  ('hrms.payroll.allowance_types.code', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Code', NULL, NULL, 2, 5, TRUE),
  ('hrms.payroll.allowance_types.name', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Name', NULL, NULL, 3, 5, TRUE),
  ('hrms.payroll.allowance_types.type', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Component Type', NULL, NULL, 4, 5, TRUE),
  ('hrms.payroll.allowance_types.is_taxable', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Taxable', NULL, NULL, 5, 5, TRUE),
  ('hrms.payroll.allowance_types.is_pensionable', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Pensionable', NULL, NULL, 6, 5, TRUE),
  ('hrms.payroll.allowance_types.is_recurring', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Recurring', NULL, NULL, 7, 5, TRUE),
  ('hrms.payroll.allowance_types.effective_from', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types'), 'Effective From', NULL, NULL, 8, 5, TRUE),

  -- Employee Allowances form fields
  ('hrms.payroll.employee_allowances.employee_id', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances'), 'Employee', NULL, NULL, 1, 5, TRUE),
  ('hrms.payroll.employee_allowances.allowance_type_id', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances'), 'Allowance Type', NULL, NULL, 2, 5, TRUE),
  ('hrms.payroll.employee_allowances.amount', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances'), 'Amount', NULL, NULL, 3, 5, TRUE),
  ('hrms.payroll.employee_allowances.currency', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances'), 'Currency', NULL, NULL, 4, 5, TRUE),
  ('hrms.payroll.employee_allowances.effective_from', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances'), 'Effective From', NULL, NULL, 5, 5, TRUE),

  -- Payroll Periods form fields
  ('hrms.payroll.payroll_periods.code', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_periods'), 'Period Code', NULL, NULL, 1, 5, TRUE),
  ('hrms.payroll.payroll_periods.start_date', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_periods'), 'Start Date', NULL, NULL, 2, 5, TRUE),
  ('hrms.payroll.payroll_periods.end_date', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_periods'), 'End Date', NULL, NULL, 3, 5, TRUE),

  -- Tax Schedules form fields
  ('hrms.payroll.tax_schedules.order_no', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules'), 'Order No', NULL, NULL, 1, 5, TRUE),
  ('hrms.payroll.tax_schedules.from_amount', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules'), 'From Amount', NULL, NULL, 2, 5, TRUE),
  ('hrms.payroll.tax_schedules.to_amount', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules'), 'To Amount', NULL, NULL, 3, 5, TRUE),
  ('hrms.payroll.tax_schedules.rate_percent', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules'), 'Tax Rate (%)', NULL, NULL, 4, 5, TRUE),
  ('hrms.payroll.tax_schedules.gov_deduction', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules'), 'Govt Deduction', NULL, NULL, 5, 5, TRUE),
  ('hrms.payroll.tax_schedules.effective_from', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules'), 'Effective From', NULL, NULL, 6, 5, TRUE),

  -- Pension Rules form fields
  ('hrms.payroll.pension_rules.employment_type', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.pension_rules'), 'Employment Type', NULL, NULL, 1, 5, TRUE),
  ('hrms.payroll.pension_rules.employee_rate', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.pension_rules'), 'Employee Rate (%)', NULL, NULL, 2, 5, TRUE),
  ('hrms.payroll.pension_rules.employer_rate', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.pension_rules'), 'Employer Rate (%)', NULL, NULL, 3, 5, TRUE),
  ('hrms.payroll.pension_rules.effective_from', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.pension_rules'), 'Effective From', NULL, NULL, 4, 5, TRUE),

  -- Payroll Runs form fields
  ('hrms.payroll.payroll_runs.period_id', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_runs'), 'Payroll Period', NULL, NULL, 1, 5, TRUE)
ON CONFLICT (node_key) DO NOTHING;

-- Helper function / transaction block for inserting help headers and details
DO $$
DECLARE
    v_header_id BIGINT;
    v_node_id BIGINT;
BEGIN

    -- -------------------------------------------------------------
    -- 1. Main Root Dashboard (dashboard)
    -- -------------------------------------------------------------
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'dashboard';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Main Dashboard Guide', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Provides a high-level overview of key organization performance indicators, pending approvals, and active workforce metrics.'),
            (v_header_id, 2, 'Use quick action links to access major ERP modules including HRMS, Payroll, Financial Management, and System Settings.'),
            (v_header_id, 3, 'Monitor real-time system alerts, upcoming payroll cutoff dates, and administrative tasks.');
    END IF;

    -- -------------------------------------------------------------
    -- 2. Payroll Submodule (hrms.compensation.payroll)
    -- -------------------------------------------------------------
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Payroll System Operations', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Centralized payroll control center for configuring pay structures, tax rules, and executing period disbursements.'),
            (v_header_id, 2, 'Maintain setup tables (Allowance Types, Tax Schedules, Pension Rules) before processing monthly payroll runs.'),
            (v_header_id, 3, 'Execute monthly payroll calculations, review generated accounting journal entries, and issue itemized payslips.');
    END IF;

    -- -------------------------------------------------------------
    -- 3. Payroll Features (All 10 Pages)
    -- -------------------------------------------------------------

    -- Feature 1: Payroll Dashboard (hrms.payroll.dashboard)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.dashboard';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Payroll Dashboard Overview', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Displays active payroll cycle metrics, total gross payroll cost, net payouts, and total tax liabilities.'),
            (v_header_id, 2, 'Monitor active employee count, pending recurring allowances, and period close status in real time.'),
            (v_header_id, 3, 'Use action buttons to initiate a new payroll run or navigate directly to period management.');
    END IF;

    -- Feature 2: Allowance Types (hrms.payroll.allowance_types)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Allowance Types Setup', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Defines earning and deduction rules used across the organization.'),
            (v_header_id, 2, 'Specify taxability and pensionability flags to determine how components affect statutory calculations.'),
            (v_header_id, 3, 'Mark components as recurring for automatic inclusion in every monthly pay period.');
    END IF;

    -- Feature 3: Employee Allowances (hrms.payroll.employee_allowances)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Assigning Employee Allowances', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Assigns specific recurring or one-off allowance amounts to individual employees.'),
            (v_header_id, 2, 'Filter by department or employee code to review current active compensation assignments.'),
            (v_header_id, 3, 'Set effective start and end dates for temporary or project-based allowances.');
    END IF;

    -- Feature 4: Payroll Periods (hrms.payroll.payroll_periods)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_periods';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Managing Payroll Cycles', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Defines pay cycle date boundaries, cutoff deadlines, and payment release dates.'),
            (v_header_id, 2, 'Periods must be in Open status before a payroll run can be initiated.'),
            (v_header_id, 3, 'Close completed periods to finalize accounting records and prevent retroactive edits.');
    END IF;

    -- Feature 5: Tax Schedules (hrms.payroll.tax_schedules)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Tax Brackets & Rules', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Configures progressive tax brackets in accordance with Ethiopian income tax regulations.'),
            (v_header_id, 2, 'Define minimum and maximum taxable income thresholds, tax rates (%), and statutory deduction offsets.'),
            (v_header_id, 3, 'Ensure bracket ranges are contiguous with no gaps or overlapping income bands.');
    END IF;

    -- Feature 6: Pension Rules (hrms.payroll.pension_rules)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.pension_rules';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Pension Rate Configuration', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Configures statutory pension contribution rates based on employment classification.'),
            (v_header_id, 2, 'Set employee contribution percentages (e.g., 7% for permanent staff) and employer matching rates (e.g., 11%).'),
            (v_header_id, 3, 'Changes apply automatically to gross taxable earnings during payroll calculation.');
    END IF;

    -- Feature 7: Payroll Runs (hrms.payroll.payroll_runs)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_runs';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Executing Payroll Runs', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Calculates gross pay, tax deductions, pension contributions, and net pay for all active employees.'),
            (v_header_id, 2, 'Review draft calculations, total disbursements, and summary totals before final approval.'),
            (v_header_id, 3, 'Approved payroll runs lock period values and generate journal vouchers and payslips.');
    END IF;

    -- Feature 8: Payroll Journals (hrms.payroll.payroll_journals)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_journals';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Accounting Journals', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Generates automated debit and credit double-entry accounting records for approved payroll runs.'),
            (v_header_id, 2, 'Maps salary expenses, tax payables, pension liabilities, and net salary bank clearing accounts.'),
            (v_header_id, 3, 'Export journal entries to the Financial Management System (FMS) for general ledger posting.');
    END IF;

    -- Feature 9: Payslips (hrms.payroll.payslips)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payslips';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Employee Payslip Search', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Access detailed itemized payment advice statements for all employees across historical periods.'),
            (v_header_id, 2, 'Displays basic salary, itemized earnings, tax deductions, pension contributions, and final net pay.'),
            (v_header_id, 3, 'Print or export digital PDF payslips for employee distribution.');
    END IF;

    -- Feature 10: Reports (hrms.payroll.reports)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.reports';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Payroll Summary & Analytics Reports', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Generates statutory compliance reports including Tax Summary, Pension Contribution Schedule, and Bank Transfer advice.'),
            (v_header_id, 2, 'Filter reports by payroll period, department, cost center, or employment type.'),
            (v_header_id, 3, 'Export generated reports to Excel or PDF format for audit and reporting.');
    END IF;

    -- -------------------------------------------------------------
    -- 4. Feature Form Field Help (Allowance Types Fields)
    -- -------------------------------------------------------------
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.system_component';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'System Component Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Identifies standard system component classification (e.g., HOUSING, TRANSPORT, BASIC).');
    END IF;

    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.code';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'Allowance Code Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Enter a unique short code for the allowance (e.g., ALW-HSG).');
    END IF;

    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.name';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'Allowance Name Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Enter the clear descriptive title shown on payslips and reports.');
    END IF;

    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.type';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'Component Type Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Select whether this component adds income (Earning) or reduces gross pay (Deduction).');
    END IF;

    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.is_taxable';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'Taxable Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Check this option if this allowance must be included in taxable income calculation.');
    END IF;

    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.is_pensionable';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'Pensionable Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Check this option if this component counts toward employee/employer pension basis.');
    END IF;

    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types.is_recurring';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active) VALUES (v_node_id, 'Recurring Field', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;
        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Check if this allowance is automatically repeated every month.');
    END IF;

END $$;
