# QA-Platform ERP - Frontend

Angular 17 application with Tailwind CSS and standalone components.

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+

## Installation

Install dependencies:

```bash
npm install
```

## Development Server

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4400`. The application will automatically reload if you change any source files.

## Build

Build the project:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── core/              # Core services, guards, interceptors
│   ├── shared/            # Reusable components, pipes, directives
│   ├── layout/            # Shell, topbar, sidebar, breadcrumb
│   └── features/          # Feature modules
│       ├── dashboard/
│       └── hrms/
│           └── compensation/
│               └── payroll/
├── assets/                # Static assets
├── environments/          # Environment configurations
└── styles.scss           # Global styles

```

## Configuration

### Environment Variables

Update `src/environments/environment.ts` for development:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api'
};
```

### Port Configuration

The app runs on port **4400** by default. To change it, update `angular.json`:

```json
"serve": {
  "options": {
    "port": 4400
  }
}
```

## Tailwind CSS

The project uses Tailwind CSS with custom configuration for light and dark modes.

### Dark Mode

Dark mode is controlled by the `class` strategy. Add the `dark` class to the `<html>` element:

```typescript
document.documentElement.classList.add('dark');
```

### Custom Colors

- **Primary**: Blue shades (50-900)
- **Dark Background**: `#0B0F19`
- **Dark Surface**: `#1E293B`
- **Dark Border**: `#334155`
- **Dark Text**: `#F1F5F9`

## Key Features

### Standalone Components

All components use the standalone API:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `...`
})
```

### Lazy Loading

Routes use lazy loading for optimal performance:

```typescript
{
  path: 'hrms/payroll',
  loadChildren: () => import('./features/hrms/payroll/payroll.routes')
}
```

### Reactive Forms

Forms use reactive approach with FormBuilder and validators.

## Available Routes

- `/dashboard` - Main dashboard
- `/hrms/payroll/dashboard` - Payroll dashboard
- `/hrms/payroll/allowance-types` - Allowance types management
- `/hrms/payroll/employee-allowances` - Employee allowances
- `/hrms/payroll/payroll-periods` - Payroll periods
- `/hrms/payroll/tax-schedules` - Tax schedules
- `/hrms/payroll/pension-rules` - Pension rules
- `/hrms/payroll/payroll-runs` - Payroll runs
- `/hrms/payroll/payroll-journals` - Payroll journals
- `/hrms/payroll/payslips` - Employee payslips
- `/hrms/payroll/reports` - Payroll reports

## Troubleshooting

### Port already in use

If port 4400 is in use, either:

1. Kill the process using the port
2. Change the port in `angular.json`
3. Run with a different port:
   ```bash
   ng serve --port 4401
   ```

### API connection issues

Ensure the backend API is running on `https://localhost:7000` and CORS is properly configured.

## Next Steps

1. Implement navigation service
2. Build theme service with dark mode toggle
3. Create reusable UI components
4. Implement payroll feature pages
5. Add authentication and guards

## License

MIT License
