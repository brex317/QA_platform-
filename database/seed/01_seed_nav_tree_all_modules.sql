-- ===================================================================
-- QA-Platform ERP - Navigation Tree Seed Data
-- ===================================================================
-- Purpose: Complete navigation hierarchy for all 11 root modules
-- Version: 1.0
-- Created: 2026-09-08
-- ===================================================================

-- Clear existing data
TRUNCATE TABLE nav_nodes RESTART IDENTITY CASCADE;

-- ===================================================================
-- ROOT MODULE 1: DASHBOARD
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('dashboard', NULL, 'Dashboard', '/dashboard', 'layout-dashboard', 1, 1, TRUE);

-- ===================================================================
-- ROOT MODULE 2: PLATFORM
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('platform', NULL, 'Platform', NULL, 'boxes', 2, 1, TRUE);

-- Platform sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('platform.settings', (SELECT id FROM nav_nodes WHERE node_key = 'platform'), 'Settings', '/platform/settings', 'settings', 1, 2, TRUE),
    ('platform.configuration', (SELECT id FROM nav_nodes WHERE node_key = 'platform'), 'Configuration', '/platform/configuration', 'sliders', 2, 2, TRUE),
    ('platform.modules', (SELECT id FROM nav_nodes WHERE node_key = 'platform'), 'Modules', '/platform/modules', 'grid', 3, 2, TRUE);

-- ===================================================================
-- ROOT MODULE 3: HRMS (Human Resource Management System)
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('hrms', NULL, 'HRMS', NULL, 'users', 3, 1, TRUE);

-- HRMS Level 2: Main Categories
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('hrms.organization', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Organization Structure', '/hrms/organization', 'sitemap', 1, 2, TRUE),
    ('hrms.employees', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Employee Management', '/hrms/employees', 'users', 2, 2, TRUE),
    ('hrms.clearance', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Clearance Setting', '/hrms/clearance', 'check-circle', 3, 2, TRUE),
    ('hrms.overtime', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Overtime Setting', '/hrms/overtime', 'clock', 4, 2, TRUE),
    ('hrms.severance', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Severance Setting', '/hrms/severance', 'file-contract', 5, 2, TRUE),
    ('hrms.termination', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Termination', '/hrms/termination', 'user-times', 6, 2, TRUE),
    ('hrms.delegation', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Delegation', '/hrms/delegation', 'exchange-alt', 7, 2, TRUE),
    ('hrms.recruitment', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Recruitment Management', '/hrms/recruitment', 'user-plus', 8, 2, TRUE),
    ('hrms.promotion', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Promotion Management', '/hrms/promotion', 'arrow-up', 9, 2, TRUE),
    ('hrms.performance', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Performance Evaluation', '/hrms/performance', 'star', 10, 2, TRUE),
    ('hrms.workforce_planning', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Workforce Planning', '/hrms/workforce-planning', 'chart-line', 11, 2, TRUE),
    ('hrms.hrms_inbox', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'HRMS Inbox', '/hrms/inbox', 'inbox', 12, 2, TRUE),
    ('hrms.transfer', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Transfer Management', '/hrms/transfer', 'arrows-alt-h', 13, 2, TRUE),
    ('hrms.leave', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Leave Management', '/hrms/leave', 'calendar-alt', 14, 2, TRUE),
    ('hrms.attendance', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Attendance', '/hrms/attendance', 'calendar-check', 15, 2, TRUE),
    ('hrms.documents', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Document Management', '/hrms/documents', 'folder-open', 16, 2, TRUE),
    ('hrms.compensation', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Compensation', NULL, 'dollar-sign', 17, 2, TRUE),
    ('hrms.training', (SELECT id FROM nav_nodes WHERE node_key = 'hrms'), 'Training', '/hrms/training', 'graduation-cap', 18, 2, TRUE);

-- HRMS -> Compensation -> Payroll (Level 3)
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('hrms.compensation.payroll', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation'), 'Payroll', NULL, 'money-bill', 1, 3, TRUE);

-- HRMS -> Compensation -> Payroll -> Features (Level 4 - Leaf Nodes)
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('hrms.payroll.dashboard', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Dashboard', '/hrms/compensation/payroll/dashboard', 'chart-line', 1, 4, TRUE),
    ('hrms.payroll.allowance_types', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Allowance types', '/hrms/compensation/payroll/allowance-types', 'list', 2, 4, TRUE),
    ('hrms.payroll.employee_allowances', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Employee allowances', '/hrms/compensation/payroll/employee-allowances', 'user-tag', 3, 4, TRUE),
    ('hrms.payroll.payroll_periods', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Payroll periods', '/hrms/compensation/payroll/payroll-periods', 'calendar', 4, 4, TRUE),
    ('hrms.payroll.tax_schedules', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Tax schedules', '/hrms/compensation/payroll/tax-schedules', 'percent', 5, 4, TRUE),
    ('hrms.payroll.pension_rules', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Pension rules', '/hrms/compensation/payroll/pension-rules', 'shield', 6, 4, TRUE),
    ('hrms.payroll.payroll_runs', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Payroll runs', '/hrms/compensation/payroll/payroll-runs', 'play-circle', 7, 4, TRUE),
    ('hrms.payroll.payroll_journals', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Payroll journals', '/hrms/compensation/payroll/payroll-journals', 'book', 8, 4, TRUE),
    ('hrms.payroll.payslips', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Payslips', '/hrms/compensation/payroll/payslips', 'file-text', 9, 4, TRUE),
    ('hrms.payroll.reports', (SELECT id FROM nav_nodes WHERE node_key = 'hrms.compensation.payroll'), 'Reports', '/hrms/compensation/payroll/reports', 'file-chart', 10, 4, TRUE);

-- ===================================================================
-- ROOT MODULE 4: PLATFORM INBOX
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('platform_inbox', NULL, 'Platform inbox', '/platform-inbox', 'mail', 4, 1, TRUE);

-- ===================================================================
-- ROOT MODULE 5: FMS (Financial Management System)
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('fms', NULL, 'FMS', NULL, 'coins', 5, 1, TRUE);

-- FMS sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('fms.master_data', (SELECT id FROM nav_nodes WHERE node_key = 'fms'), 'Master Data', NULL, 'database', 1, 2, TRUE),
    ('fms.setting', (SELECT id FROM nav_nodes WHERE node_key = 'fms'), 'Setting', NULL, 'cog', 2, 2, TRUE),
    ('fms.finance', (SELECT id FROM nav_nodes WHERE node_key = 'fms'), 'Finance', NULL, 'chart-pie', 3, 2, TRUE),
    ('fms.transactions', (SELECT id FROM nav_nodes WHERE node_key = 'fms'), 'Transactions', NULL, 'exchange-alt', 4, 2, TRUE);

-- FMS -> Master Data sub-items
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('fms.master_data.account_chart', (SELECT id FROM nav_nodes WHERE node_key = 'fms.master_data'), 'Chart of Accounts', '/fms/master-data/account-chart', 'sitemap', 1, 3, TRUE),
    ('fms.master_data.cost_centers', (SELECT id FROM nav_nodes WHERE node_key = 'fms.master_data'), 'Cost Centers', '/fms/master-data/cost-centers', 'building', 2, 3, TRUE);

-- ===================================================================
-- ROOT MODULE 6: PPMS (Project & Portfolio Management System)
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('ppms', NULL, 'PPMS', NULL, 'project-diagram', 6, 1, TRUE);

-- PPMS sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('ppms.projects', (SELECT id FROM nav_nodes WHERE node_key = 'ppms'), 'Projects', '/ppms/projects', 'tasks', 1, 2, TRUE),
    ('ppms.portfolios', (SELECT id FROM nav_nodes WHERE node_key = 'ppms'), 'Portfolios', '/ppms/portfolios', 'briefcase', 2, 2, TRUE),
    ('ppms.resources', (SELECT id FROM nav_nodes WHERE node_key = 'ppms'), 'Resources', '/ppms/resources', 'users-cog', 3, 2, TRUE);

-- ===================================================================
-- ROOT MODULE 7: REPORTS & ANALYTICS
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('reports_analytics', NULL, 'Reports & Analytics', NULL, 'chart-bar', 7, 1, TRUE);

-- Reports & Analytics sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('reports.dashboards', (SELECT id FROM nav_nodes WHERE node_key = 'reports_analytics'), 'Dashboards', '/reports/dashboards', 'tachometer-alt', 1, 2, TRUE),
    ('reports.custom_reports', (SELECT id FROM nav_nodes WHERE node_key = 'reports_analytics'), 'Custom Reports', '/reports/custom-reports', 'file-alt', 2, 2, TRUE),
    ('reports.scheduled_reports', (SELECT id FROM nav_nodes WHERE node_key = 'reports_analytics'), 'Scheduled Reports', '/reports/scheduled-reports', 'clock', 3, 2, TRUE);

-- ===================================================================
-- ROOT MODULE 8: TENANT
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('tenant', NULL, 'Tenant', NULL, 'building', 8, 1, TRUE);

-- Tenant sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('tenant.organizations', (SELECT id FROM nav_nodes WHERE node_key = 'tenant'), 'Organizations', '/tenant/organizations', 'sitemap', 1, 2, TRUE),
    ('tenant.branches', (SELECT id FROM nav_nodes WHERE node_key = 'tenant'), 'Branches', '/tenant/branches', 'code-branch', 2, 2, TRUE),
    ('tenant.departments', (SELECT id FROM nav_nodes WHERE node_key = 'tenant'), 'Departments', '/tenant/departments', 'layer-group', 3, 2, TRUE);

-- ===================================================================
-- ROOT MODULE 9: WORKFLOW
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('workflow', NULL, 'Workflow', NULL, 'flow', 9, 1, TRUE);

-- Workflow sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('workflow.definitions', (SELECT id FROM nav_nodes WHERE node_key = 'workflow'), 'Workflow Definitions', '/workflow/definitions', 'project-diagram', 1, 2, TRUE),
    ('workflow.instances', (SELECT id FROM nav_nodes WHERE node_key = 'workflow'), 'Workflow Instances', '/workflow/instances', 'spinner', 2, 2, TRUE),
    ('workflow.approvals', (SELECT id FROM nav_nodes WHERE node_key = 'workflow'), 'Pending Approvals', '/workflow/approvals', 'check-circle', 3, 2, TRUE);

-- ===================================================================
-- ROOT MODULE 10: NOTIFICATION
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('notification', NULL, 'Notification', NULL, 'bell', 10, 1, TRUE);

-- Notification sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('notification.notifications', (SELECT id FROM nav_nodes WHERE node_key = 'notification'), 'All Notifications', '/notification/all', 'bell', 1, 2, TRUE),
    ('notification.templates', (SELECT id FROM nav_nodes WHERE node_key = 'notification'), 'Templates', '/notification/templates', 'file-code', 2, 2, TRUE),
    ('notification.preferences', (SELECT id FROM nav_nodes WHERE node_key = 'notification'), 'Preferences', '/notification/preferences', 'sliders', 3, 2, TRUE);

-- ===================================================================
-- ROOT MODULE 11: SYSTEM MANAGEMENT
-- ===================================================================
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES ('system_management', NULL, 'System Management', NULL, 'cogs', 11, 1, TRUE);

-- System Management sub-modules
INSERT INTO nav_nodes (node_key, parent_id, title, route_url, icon, display_order, depth, is_active)
VALUES 
    ('system.users', (SELECT id FROM nav_nodes WHERE node_key = 'system_management'), 'User Management', '/system/users', 'users', 1, 2, TRUE),
    ('system.roles', (SELECT id FROM nav_nodes WHERE node_key = 'system_management'), 'Roles & Permissions', '/system/roles', 'user-shield', 2, 2, TRUE),
    ('system.audit_logs', (SELECT id FROM nav_nodes WHERE node_key = 'system_management'), 'Audit Logs', '/system/audit-logs', 'history', 3, 2, TRUE),
    ('system.system_settings', (SELECT id FROM nav_nodes WHERE node_key = 'system_management'), 'System Settings', '/system/settings', 'tools', 4, 2, TRUE);

-- ===================================================================

-- ===================================================================
-- Verification Query
-- ===================================================================
-- Run this query to verify navigation tree:
-- 
-- SELECT 
--     REPEAT('  ', depth - 1) || title as navigation_item,
--     node_key,
--     route_url,
--     depth,
--     display_order
-- FROM nav_nodes
-- WHERE is_active = TRUE
-- ORDER BY 
--     CASE WHEN parent_id IS NULL THEN id ELSE parent_id END,
--     display_order,
--     id;
--
-- Expected count: SELECT COUNT(*) FROM nav_nodes; -- Should return 60+ nodes
-- ===================================================================

-- Add audit information
UPDATE nav_nodes SET created_by = 'SYSTEM', created_at = NOW() WHERE created_by IS NULL;

-- Display summary
DO $$
DECLARE
    total_count INTEGER;
    root_count INTEGER;
    leaf_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM nav_nodes;
    SELECT COUNT(*) INTO root_count FROM nav_nodes WHERE parent_id IS NULL;
    SELECT COUNT(*) INTO leaf_count FROM nav_nodes WHERE route_url IS NOT NULL;
    
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Navigation Tree Seed Completed Successfully';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Total Nodes: %', total_count;
    RAISE NOTICE 'Root Modules: %', root_count;
    RAISE NOTICE 'Leaf/Clickable Nodes: %', leaf_count;
    RAISE NOTICE '=================================================';
END $$;
