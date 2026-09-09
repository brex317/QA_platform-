-- ===================================================================
-- QA-Platform ERP - Contextual Help Seed Data
-- ===================================================================
-- Purpose: Seeds nav_nodes form-field children and help content
-- Version: 1.0
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
    -- 1. Dashboard Module (dashboard)
    -- -------------------------------------------------------------
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'dashboard';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Overview Dashboard Guide', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Review high-level system metrics and key performance indicators.'),
            (v_header_id, 2, 'Use quick action navigation to jump to module management panels.'),
            (v_header_id, 3, 'Monitor pending approval workflows and system notifications.');
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
            (v_header_id, 1, 'Configure payroll setup tables (Allowance Types, Tax Schedules, Pension Rules).'),
            (v_header_id, 2, 'Define active payroll periods and assign recurring employee allowances.'),
            (v_header_id, 3, 'Execute payroll runs to calculate net pay, generate journals, and issue payslips.');
    END IF;

    -- -------------------------------------------------------------
    -- 3. Payroll Features     -- -------------------------------------------------------------

    -- Feature 1: Payroll Dashboard (hrms.payroll.dashboard)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.dashboard';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Payroll Dashboard Overview', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'View current period status, total gross pay, and total net disbursements.'),
            (v_header_id, 2, 'Check recent payroll run activity and pending period close actions.');
    END IF;

    -- Feature 2: Allowance Types (hrms.payroll.allowance_types)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.allowance_types';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Allowance Types Setup', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Click "+ Add Allowance Type" to open the creation dialog.'),
            (v_header_id, 2, 'Specify the code, name, category (Earning or Deduction), and taxability settings.'),
            (v_header_id, 3, 'Save component definition to allow assignment to employees.');
    END IF;

    -- Feature 3: Employee Allowances (hrms.payroll.employee_allowances)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.employee_allowances';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Assigning Employee Allowances', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Select an active employee and an allowance type.'),
            (v_header_id, 2, 'Input the specific amount and effective start date for the recurring payout.'),
            (v_header_id, 3, 'Save to automatically include in future payroll run calculations.');
    END IF;

    -- Feature 4: Payroll Periods (hrms.payroll.payroll_periods)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_periods';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Managing Payroll Cycles', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Create monthly or bi-weekly payroll periods with distinct start and end dates.'),
            (v_header_id, 2, 'Ensure periods are set to Open status before processing payroll runs.'),
            (v_header_id, 3, 'Close completed periods to freeze adjustments and archive records.');
    END IF;

    -- Feature 5: Tax Schedules (hrms.payroll.tax_schedules)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.tax_schedules';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Tax Brackets & Rules', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Configure income brackets with statutory tax percentage rates.'),
            (v_header_id, 2, 'Set statutory deduction offsets according to government tax law.'),
            (v_header_id, 3, 'Verify bracket order sequence to ensure accurate progressive taxation.');
    END IF;

    -- Feature 6: Pension Rules (hrms.payroll.pension_rules)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.pension_rules';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Pension Rate Configuration', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Define pension contribution rules by employment category.'),
            (v_header_id, 2, 'Specify the employee deduction percentage rate.'),
            (v_header_id, 3, 'Specify the employer match percentage rate.');
    END IF;

    -- Feature 7: Payroll Runs (hrms.payroll.payroll_runs)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_runs';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Executing Payroll Runs', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Click "New Payroll Run" and select an open payroll period.'),
            (v_header_id, 2, 'Trigger payroll processing to calculate gross, tax, pension, and net pay.'),
            (v_header_id, 3, 'Review totals and submit for management approval.');
    END IF;

    -- Feature 8: Payroll Journals (hrms.payroll.payroll_journals)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payroll_journals';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Accounting Journals', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Review general ledger debit and credit entries generated from payroll runs.'),
            (v_header_id, 2, 'Verify account code mapping for salary expense, tax payable, and net cash.');
    END IF;

    -- Feature 9: Payslips (hrms.payroll.payslips)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.payslips';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Employee Payslip Search', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Search for employee payslips by period or employee name.'),
            (v_header_id, 2, 'Download or print individual itemized payment advice statements.');
    END IF;

    -- Feature 10: Reports (hrms.payroll.reports)
    SELECT id INTO v_node_id FROM nav_nodes WHERE node_key = 'hrms.payroll.reports';
    IF v_node_id IS NOT NULL THEN
        INSERT INTO help_headers (node_id, title, is_active)
        VALUES (v_node_id, 'Payroll Summary & Analytics Reports', TRUE)
        ON CONFLICT (node_id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO v_header_id;

        DELETE FROM help_details WHERE help_header_id = v_header_id;
        INSERT INTO help_details (help_header_id, step_number, step_text) VALUES
            (v_header_id, 1, 'Select a report category (Tax Summary, Pension Contributions, Bank Disbursement).'),
            (v_header_id, 2, 'Filter by date range or department and click Generate Report.');
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
            (v_header_id, 1, 'Enter a unique short code for the allowance (e.g. ALW-HSG).');
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
