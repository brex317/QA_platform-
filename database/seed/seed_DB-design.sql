

DO $$
DECLARE
    v_hrms_id        BIGINT;
    v_payroll_id     BIGINT;
     v_node_id    BIGINT;
    v_header_id      BIGINT;
BEGIN

    --   MODULE - HRMS
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms', NULL, 'MODULE', 'HRMS', 1)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_hrms_id;

    INSERT INTO help_headers (node_id, context_key)
    VALUES (v_hrms_id, 'page')
    ON CONFLICT (node_id, context_key) DO NOTHING;

    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_hrms_id AND context_key = 'page';

    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'This is the Human Resource Management System module.'),
        (v_header_id, 2, 'Use it to manage employees, payroll, attendance, leave, and recruitment.'),
        (v_header_id, 3, 'Select a submodule from the menu to get started.');

    


    --   SUBMODULE - Payroll (under HRMS)
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.compensation.payroll', v_hrms_id, 'SUBMODULE', 'Payroll', 2)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_payroll_id;

    INSERT INTO help_headers (node_id, context_key)
    VALUES (v_payroll_id, 'page')
    ON CONFLICT (node_id, context_key) DO NOTHING;

    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_payroll_id AND context_key = 'page';

    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'This section manages employee compensation and pay processing.'),
        (v_header_id, 2, 'Use Allowance Types to define earning and deduction rules.'),
        (v_header_id, 3, 'Use Employee Allowances to assign amounts to employees.'),
        (v_header_id, 4, 'Use Payroll Periods to define pay cycle dates.'),
        (v_header_id, 5, 'Use Payroll Runs to calculate and process pay for the period.');


    --   FEATURE - Allowance Types (under Payroll)
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.allowance_types', v_payroll_id, 'FEATURE', 'Allowance Types', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO  v_node_id ;

    INSERT INTO help_headers (node_id, context_key)
    VALUES ( v_node_id , 'page')
    ON CONFLICT (node_id, context_key) DO NOTHING;

    SELECT id INTO v_header_id FROM help_headers WHERE node_id =  v_node_id  AND context_key = 'page';

    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'This page lists all allowance types available in the organization.'),
        (v_header_id, 2, 'Use Search to find a specific allowance type.'),
        (v_header_id, 3, 'Click Add to create a new allowance type.'),
        (v_header_id, 4, 'Click Edit on any row to modify it.'),
        (v_header_id, 5, 'Click Deactivate to disable an allowance type without deleting it.');


     
    INSERT INTO help_headers (node_id, context_key)
    VALUES ( v_node_id , 'add_form')
    ON CONFLICT (node_id, context_key) DO NOTHING;

    SELECT id INTO v_header_id FROM help_headers WHERE node_id =  v_node_id  AND context_key = 'add_form';

    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Enter the code.'),
        (v_header_id, 2, 'Enter the name.'),
        (v_header_id, 3, 'Select the component type.'),
        (v_header_id, 4, 'Check Taxable if applicable.'),
        (v_header_id, 5, 'Check Pensionable if applicable.'),
        (v_header_id, 6, 'Check Recurring if applicable.'),
        (v_header_id, 7, 'Click Save.');



    -- FEATURE: Employee Allowances (under Payroll) - page + add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.employee_allowances', v_payroll_id, 'FEATURE', 'Employee Allowances', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'View the total number of allowance assignments.'),
        (v_header_id, 2, 'View active allowance assignments.'),
        (v_header_id, 3, 'View inactive allowance assignments.'),
        (v_header_id, 4, 'Use Search to find a specific employee allowance.'),
        (v_header_id, 5, 'Click Edit to modify an existing assignment.');

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'add_form') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'add_form';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Select the Employee to assign the allowance to.'),
        (v_header_id, 2, 'Select the Allowance Type to assign.'),
        (v_header_id, 3, 'Enter the Amount for this allowance.'),
        (v_header_id, 4, 'Select the Effective From date.'),
        (v_header_id, 5, 'Click Save.');


    -- FEATURE: Payroll Periods (under Payroll) - page + add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.payroll_periods', v_payroll_id, 'FEATURE', 'Payroll Periods', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'View all payroll periods.'),
        (v_header_id, 2, 'View open periods that are ready for a payroll run.'),
        (v_header_id, 3, 'View closed periods that are finalized.'),
        (v_header_id, 4, 'Use Search to find a specific period.'),
        (v_header_id, 5, 'Click Edit to modify an existing period.');

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'add_form') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'add_form';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Enter the period Code.'),
        (v_header_id, 2, 'Select the Start Date.'),
        (v_header_id, 3, 'Select the End Date.'),
        (v_header_id, 4, 'Set the Status (Open or Closed).'),
        (v_header_id, 5, 'Click Save.');


    -- FEATURE: Tax Schedules (under Payroll) - page + add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.tax_schedules', v_payroll_id, 'FEATURE', 'Tax Schedules', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Lists progressive tax brackets used to calculate employee income tax.'),
        (v_header_id, 2, 'Use Search to find a specific bracket.'),
        (v_header_id, 3, 'Click Add to create a new tax bracket.'),
        (v_header_id, 4, 'Click Edit to modify an existing bracket.');

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'add_form') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'add_form';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Enter the Order No to set this bracket''s position in the sequence.'),
        (v_header_id, 2, 'Enter the From Amount (lower bound of this bracket).'),
        (v_header_id, 3, 'Enter the To Amount (upper bound), or leave blank for the top bracket.'),
        (v_header_id, 4, 'Enter the tax Rate Percent for this bracket.'),
        (v_header_id, 5, 'Enter the Gov Deduction amount for this bracket.'),
        (v_header_id, 6, 'Select the Effective From date.'),
        (v_header_id, 7, 'Click Save.');


    -- FEATURE: Pension Rules (under Payroll) - page + add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.pension_rules', v_payroll_id, 'FEATURE', 'Pension Rules', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Lists pension contribution rates by employment type.'),
        (v_header_id, 2, 'Click Add to create a new pension rule.'),
        (v_header_id, 3, 'Click Edit to modify an existing rule.');

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'add_form') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'add_form';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Select the Employment Type this rule applies to.'),
        (v_header_id, 2, 'Enter the Employee contribution rate (%).'),
        (v_header_id, 3, 'Enter the Employer contribution rate (%).'),
        (v_header_id, 4, 'Select the Effective From date.'),
        (v_header_id, 5, 'Click Save.');


    -- FEATURE: Payroll Runs (under Payroll) - page only, no add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.payroll_runs', v_payroll_id, 'FEATURE', 'Payroll Runs', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Lists all payroll runs with their status (Draft, Processed, Approved, Paid, Reversed).'),
        (v_header_id, 2, 'Click Process on an open period to calculate gross pay, deductions, and net pay for all employees.'),
        (v_header_id, 3, 'Review the totals, then Approve to lock the run and generate journals and payslips.');


    -- FEATURE: Payroll Journals (under Payroll) - page only, no add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.payroll_journals', v_payroll_id, 'FEATURE', 'Payroll Journals', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Lists accounting journal entries generated from approved payroll runs.'),
        (v_header_id, 2, 'Shows debit and credit amounts and posting status for each journal.'),
        (v_header_id, 3, 'Click Post to send a journal to the general ledger.');


    -- FEATURE: Payslips (under Payroll) - page only, no add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.payslips', v_payroll_id, 'FEATURE', 'Payslips', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Search employee payslips by payroll run or employee.'),
        (v_header_id, 2, 'Shows gross pay, tax deduction, pension deduction, other deductions, and net pay.'),
        (v_header_id, 3, 'Click Export to download a payslip as PDF.');


    -- FEATURE: Reports (under Payroll) - page only, no add_form
    INSERT INTO nav_nodes (key, parent_id, node_type, name, depth)
    VALUES ('hrms.payroll.reports', v_payroll_id, 'FEATURE', 'Reports', 3)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_node_id;

    INSERT INTO help_headers (node_id, context_key) VALUES (v_node_id, 'page') ON CONFLICT (node_id, context_key) DO NOTHING;
    SELECT id INTO v_header_id FROM help_headers WHERE node_id = v_node_id AND context_key = 'page';
    DELETE FROM help_steps WHERE help_header_id = v_header_id;
    INSERT INTO help_steps (help_header_id, step_number, step_text) VALUES
        (v_header_id, 1, 'Choose a report type: Payroll Register, Tax Report, Pension Report, or Department Report.'),
        (v_header_id, 2, 'Filter by payroll period if needed.'),
        (v_header_id, 3, 'Click Export to download the report.');

    RAISE NOTICE 'Seed complete. hrms_id=%, payroll_id=%, last_feature_id=%', v_hrms_id, v_payroll_id, v_node_id;

END $$;