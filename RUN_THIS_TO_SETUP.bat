@echo off
echo ========================================
echo QA Platform - Database Setup Script
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Creating Database...
echo ----------------------------------------
psql -U postgres -c "CREATE DATABASE qa_platform;"
if %ERRORLEVEL% NEQ 0 (
    echo Database might already exist - continuing...
)
echo.

echo Step 2: Creating Tables...
echo ----------------------------------------
psql -U postgres -d qa_platform -f database/schemas/01_nav_nodes.sql
psql -U postgres -d qa_platform -f database/schemas/02_hrms_payroll.sql
echo.

echo Step 3: Loading Navigation Data (includes HRMS!)...
echo ----------------------------------------
psql -U postgres -d qa_platform -f database/seed/01_seed_nav_tree_all_modules.sql
echo.

echo Step 4: Loading Sample Payroll Data...
echo ----------------------------------------
psql -U postgres -d qa_platform -f database/seed/02_seed_hrms_payroll_data.sql
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Update password in: backend\src\API\appsettings.json
echo 2. Start Backend: cd backend\src\API; dotnet run
echo 3. Frontend should already be running at http://localhost:4400
echo 4. Refresh browser - HRMS will now appear!
echo.
echo ========================================
pause
