@echo off
echo ===================================================================
echo QA Platform ERP - Database Setup Script
echo ===================================================================

if "%PGPASSWORD%"=="" SET PGPASSWORD=postgres
if "%DB_NAME%"=="" SET DB_NAME=qa_platform
if "%DB_USER%"=="" SET DB_USER=postgres
if "%DB_HOST%"=="" SET DB_HOST=localhost

echo Creating database %DB_NAME% if it does not exist...
psql -h %DB_HOST% -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;" 2>NUL

echo Applying Schemas...
psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -f database/schemas/01_nav_nodes.sql
if %errorlevel% neq 0 (
    echo FAILED: database/schemas/01_nav_nodes.sql
    exit /b %errorlevel%
)

psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -f database/schemas/02_hrms_payroll.sql
if %errorlevel% neq 0 (
    echo FAILED: database/schemas/02_hrms_payroll.sql
    exit /b %errorlevel%
)

psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -f database/schemas/03_help_content.sql
if %errorlevel% neq 0 (
    echo FAILED: database/schemas/03_help_content.sql
    exit /b %errorlevel%
)

echo Applying Seed Data...
psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -f database/seed/01_seed_nav_tree_all_modules.sql
if %errorlevel% neq 0 (
    echo FAILED: database/seed/01_seed_nav_tree_all_modules.sql
    exit /b %errorlevel%
)

psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -f database/seed/02_seed_hrms_payroll_data.sql
if %errorlevel% neq 0 (
    echo FAILED: database/seed/02_seed_hrms_payroll_data.sql
    exit /b %errorlevel%
)

psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -f database/seed/03_seed_help_content.sql
if %errorlevel% neq 0 (
    echo FAILED: database/seed/03_seed_help_content.sql
    exit /b %errorlevel%
)

echo ===================================================================
echo Database Setup Completed Successfully!
echo ===================================================================
