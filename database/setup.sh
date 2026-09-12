#!/bin/bash
set -e

echo "==================================================================="
echo "QA Platform ERP - Database Setup Script"
echo "==================================================================="

export PGPASSWORD="${PGPASSWORD:-postgres}"
DB_NAME="${DB_NAME:-qa_platform}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"

echo "Creating database $DB_NAME if it does not exist..."
psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true

run_sql() {
    local file="$1"
    echo "Executing $file..."
    if ! psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$file"; then
        echo "FAILED: $file"
        exit 1
    fi
}

echo "Applying Schemas..."
run_sql "database/schemas/01_nav_nodes.sql"
run_sql "database/schemas/02_hrms_payroll.sql"
run_sql "database/schemas/03_help_content.sql"

echo "Applying Seed Data..."
run_sql "database/seed/01_seed_nav_tree_all_modules.sql"
run_sql "database/seed/02_seed_hrms_payroll_data.sql"
run_sql "database/seed/03_seed_help_content.sql"

echo "==================================================================="
echo "Database Setup Completed Successfully!"
echo "==================================================================="
