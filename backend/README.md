# QA-Platform ERP - Backend API

.NET 8 Web API following Clean Architecture principles.

## Prerequisites

- .NET 8 SDK
- PostgreSQL 14+
- Your favorite IDE (Visual Studio 2022, VS Code, or Rider)

## Project Structure

```
src/
├── Domain/              # Core business entities and enums (no dependencies)
├── Application/         # DTOs, interfaces, and business logic
├── Infrastructure/      # Data access, EF Core, external services
└── API/                 # REST API controllers and middleware
```

## Getting Started

### 1. Database Setup

Create the PostgreSQL database:

```bash
createdb qa_platform
```

Run the schema scripts:

```bash
psql -U postgres -d qa_platform -f ../database/schemas/01_nav_nodes.sql
psql -U postgres -d qa_platform -f ../database/schemas/02_hrms_payroll.sql
```

Seed the database:

```bash
psql -U postgres -d qa_platform -f ../database/seed/01_seed_nav_tree_all_modules.sql
psql -U postgres -d qa_platform -f ../database/seed/02_seed_hrms_payroll_data.sql
```

### 2. Configure Connection String

Update `src/API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=qa_platform;Username=postgres;Password=yourpassword"
  }
}
```

### 3. Restore Dependencies

```bash
dotnet restore
```

### 4. Build the Solution

```bash
dotnet build
```

### 5. Run the API

```bash
cd src/API
dotnet run
```

The API will start at:
- HTTPS: `https://localhost:7000`
- HTTP: `http://localhost:5000`

### 6. Access Swagger Documentation

Open your browser and navigate to:
```
https://localhost:7000/swagger
```

## Available Endpoints

### Navigation
- `GET /api/nav/tree` - Get complete navigation hierarchy
- `GET /api/nav/{id}` - Get node by ID
- `GET /api/nav/key/{nodeKey}` - Get node by key

### HRMS Payroll Dashboard
- `GET /api/hrms/payroll/dashboard/summary` - Get dashboard KPIs

### Allowance Types
- `GET /api/hrms/payroll/allowance-types` - Get all allowance types
- `GET /api/hrms/payroll/allowance-types/{id}` - Get by ID
- `POST /api/hrms/payroll/allowance-types` - Create new
- `PUT /api/hrms/payroll/allowance-types/{id}` - Update
- `DELETE /api/hrms/payroll/allowance-types/{id}` - Delete

### Employee Allowances
- `GET /api/hrms/payroll/employee-allowances` - Get all
- `GET /api/hrms/payroll/employee-allowances/{id}` - Get by ID
- `POST /api/hrms/payroll/employee-allowances` - Create
- `PUT /api/hrms/payroll/employee-allowances/{id}` - Update
- `DELETE /api/hrms/payroll/employee-allowances/{id}` - Delete

### Payroll Periods
- `GET /api/hrms/payroll/payroll-periods` - Get all periods
- `GET /api/hrms/payroll/payroll-periods/{id}` - Get by ID
- `POST /api/hrms/payroll/payroll-periods` - Create period
- `PUT /api/hrms/payroll/payroll-periods/{id}` - Update
- `DELETE /api/hrms/payroll/payroll-periods/{id}` - Delete

### Tax Schedules
- `GET /api/hrms/payroll/tax-schedules` - Get all schedules
- `GET /api/hrms/payroll/tax-schedules/active` - Get active schedules
- `GET /api/hrms/payroll/tax-schedules/{id}` - Get by ID
- `POST /api/hrms/payroll/tax-schedules` - Create
- `PUT /api/hrms/payroll/tax-schedules/{id}` - Update
- `DELETE /api/hrms/payroll/tax-schedules/{id}` - Delete

### Pension Rules
- `GET /api/hrms/payroll/pension-rules` - Get all rules
- `GET /api/hrms/payroll/pension-rules/{id}` - Get by ID
- `GET /api/hrms/payroll/pension-rules/employment-type/{type}` - Get by employment type
- `POST /api/hrms/payroll/pension-rules` - Create
- `PUT /api/hrms/payroll/pension-rules/{id}` - Update
- `DELETE /api/hrms/payroll/pension-rules/{id}` - Delete

### Payroll Runs
- `GET /api/hrms/payroll/runs` - Get all runs
- `GET /api/hrms/payroll/runs/{id}` - Get by ID
- `POST /api/hrms/payroll/runs` - Create run
- `PUT /api/hrms/payroll/runs/{id}/status` - Update status
- `POST /api/hrms/payroll/runs/{id}/process` - Process payroll

### Payroll Journals
- `GET /api/hrms/payroll/journals` - Get all journals
- `GET /api/hrms/payroll/journals/{id}` - Get by ID
- `POST /api/hrms/payroll/journals` - Create journal
- `PUT /api/hrms/payroll/journals/{id}/status` - Update status

### Payslips
- `GET /api/hrms/payroll/payslips` - Get all payslips
- `GET /api/hrms/payroll/payslips/{id}` - Get by ID
- `GET /api/hrms/payroll/payslips/run/{payrollRunId}` - Get by run

### Payroll Reports
- `GET /api/hrms/payroll/reports/register` - Payroll register report
- `GET /api/hrms/payroll/reports/tax` - Tax report
- `GET /api/hrms/payroll/reports/pension` - Pension report
- `GET /api/hrms/payroll/reports/department` - Department report

### System
- `GET /health` - Health check endpoint
- `GET /` - API information endpoint

## Configuration

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=qa_platform;Username=postgres;Password=yourpassword"
  }
}
```

### CORS Configuration

The API is configured to accept requests from:
- `http://localhost:4400` (Angular app - primary)
- `http://localhost:4200` (Angular app - alternative)

To add more origins, update `Program.cs`:

```csharp
policy.WithOrigins("http://localhost:4400", "https://your-domain.com")
```

## Database Migrations

### Create a new migration

```bash
cd src/API
dotnet ef migrations add MigrationName --project ../Infrastructure --startup-project .
```

### Apply migrations

```bash
dotnet ef database update --project ../Infrastructure --startup-project .
```

### Remove last migration

```bash
dotnet ef migrations remove --project ../Infrastructure --startup-project .
```

## Testing

### Test the API with curl

```bash
# Get navigation tree
curl -X GET "https://localhost:7000/api/nav/tree" -k

# Get dashboard summary
curl -X GET "https://localhost:7000/api/hrms/payroll/dashboard/summary" -k

# Health check
curl -X GET "https://localhost:7000/health" -k
```

### Test with Postman or Thunder Client

Import the Swagger definition from:
```
https://localhost:7000/swagger/v1/swagger.json
```

## Architecture

### Clean Architecture Layers

1. **Domain** - Core business entities (no dependencies)
2. **Application** - Use cases, DTOs, interfaces
3. **Infrastructure** - Data access, external services
4. **API** - REST controllers, middleware

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling
- **CQRS** - Separate read and write models
- **Service Layer** - Business logic encapsulation

### Key Technologies

- .NET 8
- Entity Framework Core 8
- PostgreSQL with Npgsql
- Swagger/OpenAPI
- ASP.NET Core Web API
- Memory Caching

## Troubleshooting

### Database connection fails

Check PostgreSQL is running:
```bash
pg_isready
```

Verify connection string in `appsettings.json`.

### Port already in use

Change ports in `Properties/launchSettings.json` or use:
```bash
dotnet run --urls "https://localhost:7001;http://localhost:5001"
```

### EF Core commands not found

Install the tools:
```bash
dotnet tool install --global dotnet-ef
```

## Next Steps

1. Implement remaining payroll service implementations
2. Add authentication and authorization
3. Implement comprehensive logging
4. Add unit and integration tests
5. Set up CI/CD pipeline

## Contributing

Please follow the existing code structure and patterns when adding new features.

## License

MIT License
