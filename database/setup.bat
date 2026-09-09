@echo off
echo ===================================================================
echo QA Platform ERP - Database Setup Script
echo ===================================================================

SET PGPASSWORD=postgres
SET DB_NAME=qa_platform
SET DB_USER=postgres

echo Creating database %DB_NAME% if it does not exist...
psql -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;" 2>NUL

echo Applying Schemas...
psql -U %DB_USER% -d %DB_NAME% -f database/schemas/01_nav_nodes.sql
psql -U %DB_USER% -d %DB_NAME% -f database/schemas/02_hrms_payroll.sql
psql -U %DB_USER% -d %DB_NAME% -f database/schemas/03_help_content.sql

echo Applying Seed Data...
psql -U %DB_USER% -d %DB_NAME% -f database/seed/01_seed_nav_tree_all_modules.sql
psql -U %DB_USER% -d %DB_NAME% -f database/seed/02_seed_hrms_payroll_data.sql
psql -U %DB_USER% -d %DB_NAME% -f database/seed/03_seed_help_content.sql

echo ===================================================================
echo Database Setup Completed Successfully!
echo ===================================================================
