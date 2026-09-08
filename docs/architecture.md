# QA-Platform ERP - System Architecture

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Architecture](#database-architecture)
6. [API Design](#api-design)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)

---

## Overview

QA-Platform ERP is designed as a modern, scalable enterprise application following industry best practices and proven architectural patterns.

### Key Architectural Principles
- **Separation of Concerns** - Clear boundaries between layers
- **Dependency Inversion** - Dependencies point inward toward the domain
- **Single Responsibility** - Each component has one reason to change
- **Open/Closed Principle** - Open for extension, closed for modification
- **DRY (Don't Repeat Yourself)** - Eliminate code duplication
- **KISS (Keep It Simple, Stupid)** - Favor simplicity over complexity

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Angular 17 SPA (Standalone Components)         │ │
│  │  - TypeScript  - Tailwind CSS  - RxJS  - Routing      │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS/JSON
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         .NET 8 Web API (RESTful Services)              │ │
│  │  - Controllers  - Middleware  - Authentication         │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Application Layer                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    Business Logic & Use Cases (CQRS Pattern)           │ │
│  │  - Commands  - Queries  - DTOs  - Validators           │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      Domain Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Core Business Entities & Rules                 │ │
│  │  - Entities  - Enums  - Value Objects  - Interfaces    │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Infrastructure Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    External Dependencies & Data Access                 │ │
│  │  - EF Core  - PostgreSQL  - Repositories  - Services   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                       Data Layer                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                       │ │
│  │  - Tables  - Views  - Stored Procedures  - Indexes     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Clean Architecture Layers

#### 1. Domain Layer (Core)
- **Responsibility**: Contains enterprise business logic and entities
- **Dependencies**: None (innermost layer)
- **Components**:
  - Entities (NavNode, Employee, AllowanceType, etc.)
  - Enums (AllowanceTypeEnum, PayrollStatus, etc.)
  - Value Objects
  - Domain Events
  - Interfaces (repository contracts)

**Key Principle**: No dependencies on external frameworks or libraries.

```
Domain/
├── Common/
│   └── BaseAuditableEntity.cs
├── Entities/
│   ├── Navigation/
│   │   └── NavNode.cs
│   └── HRMS/
│       ├── Employee.cs
│       ├── AllowanceType.cs
│       ├── EmployeeAllowance.cs
│       ├── PayrollPeriod.cs
│       ├── TaxSchedule.cs
│       ├── PensionRule.cs
│       ├── PayrollRun.cs
│       ├── PayrollJournal.cs
│       └── Payslip.cs
└── Enums/
    ├── AllowanceTypeEnum.cs
    ├── PayrollStatus.cs
    └── EmploymentType.cs
```

#### 2. Application Layer
- **Responsibility**: Application business logic, use cases, and orchestration
- **Dependencies**: Domain layer only
- **Components**:
  - Commands (Create, Update, Delete operations)
  - Queries (Read operations)
  - DTOs (Data Transfer Objects)
  - Validators (FluentValidation)
  - Interfaces (service contracts)
  - Mappers (AutoMapper profiles)

**Pattern**: CQRS (Command Query Responsibility Segregation)

```
Application/
├── Common/
│   ├── Interfaces/
│   └── Mappings/
├── Navigation/
│   ├── DTOs/
│   │   └── NavNodeDto.cs
│   ├── Queries/
│   │   └── GetNavigationTreeQuery.cs
│   └── Services/
│       └── INavigationService.cs
└── HRMS/
    └── Payroll/
        ├── DTOs/
        ├── Commands/
        ├── Queries/
        └── Validators/
```

#### 3. Infrastructure Layer
- **Responsibility**: External concerns (database, file system, external APIs)
- **Dependencies**: Application and Domain layers
- **Components**:
  - DbContext (Entity Framework Core)
  - Repository implementations
  - External service implementations
  - Migrations
  - Configuration classes

```
Infrastructure/
├── Data/
│   ├── QAPlatformDbContext.cs
│   ├── Configurations/
│   │   ├── NavNodeConfiguration.cs
│   │   └── EmployeeConfiguration.cs
│   └── Migrations/
├── Repositories/
│   ├── NavigationRepository.cs
│   └── PayrollRepository.cs
└── Services/
```

#### 4. API Layer (Presentation)
- **Responsibility**: HTTP endpoints, request/response handling
- **Dependencies**: Application and Infrastructure layers
- **Components**:
  - Controllers (RESTful endpoints)
  - Middleware (exception handling, logging)
  - Filters (validation, authorization)
  - Configuration (DI, CORS, Swagger)

```
API/
├── Controllers/
│   ├── NavController.cs
│   └── HRMS/
│       └── Payroll/
│           ├── PayrollDashboardController.cs
│           ├── AllowanceTypesController.cs
│           └── ...
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Program.cs
└── appsettings.json
```

### CQRS Pattern Implementation

**Commands** (Write Operations):
- Create new records
- Update existing records
- Delete records
- Change entity state

**Queries** (Read Operations):
- Get single entity
- Get list of entities
- Get filtered/sorted data
- Get aggregated data

**Benefits**:
- Clear separation of read and write operations
- Optimized query performance
- Easier testing and maintenance
- Scalability (can scale reads and writes independently)

---

## Frontend Architecture

### Angular 17 Architecture

#### Component Structure

```
app/
├── core/
│   ├── services/
│   │   ├── navigation.service.ts
│   │   ├── theme.service.ts
│   │   └── api.service.ts
│   ├── models/
│   │   ├── nav-node.model.ts
│   │   └── api-response.model.ts
│   ├── guards/
│   ├── interceptors/
│   └── constants/
├── shared/
│   ├── components/
│   │   ├── stat-card/
│   │   ├── dynamic-table/
│   │   ├── pagination/
│   │   ├── badge/
│   │   └── modal/
│   ├── pipes/
│   └── directives/
├── layout/
│   ├── shell/
│   ├── topbar/
│   ├── sidebar/
│   └── breadcrumb/
└── features/
    └── hrms/
        ├── attendance/
        └── compensation/
            └── payroll/
                ├── dashboard/
                ├── allowance-types/
                ├── employee-allowances/
                ├── payroll-periods/
                ├── tax-schedules/
                ├── pension-rules/
                ├── payroll-runs/
                ├── payroll-journals/
                ├── payslips/
                └── reports/
```

#### Key Angular Features

**Standalone Components**:
- No NgModule required
- Self-contained components
- Explicit imports
- Tree-shakeable

**Reactive Programming (RxJS)**:
- Observable streams for data flow
- Async pipe for template subscriptions
- Operators for data transformation
- Subject/BehaviorSubject for state management

**Lazy Loading**:
- Route-based code splitting
- Reduced initial bundle size
- Faster application startup

**State Management**:
- Service-based state (simple scenarios)
- RxJS BehaviorSubject for shared state
- LocalStorage for persistence (theme, user preferences)

---

## Database Architecture

### Database Schema Design

#### 1. Navigation Schema
- **Purpose**: Dynamic, database-driven hierarchical navigation
- **Key Table**: `nav_nodes`
- **Features**:
  - Self-referencing parent-child relationships
  - Configurable display order
  - Depth tracking
  - Active/inactive nodes

#### 2. HRMS Payroll Schema
- **Purpose**: Complete payroll processing functionality
- **Key Tables**:
  - `employees` - Employee master data
  - `allowance_types` - Earning and deduction definitions
  - `employee_allowances` - Employee-specific allowance assignments
  - `payroll_periods` - Pay period management
  - `tax_schedules` - Progressive tax bracket configuration
  - `pension_rules` - Pension contribution rules by employment type
  - `payroll_runs` - Payroll execution records
  - `payroll_journals` - Accounting journal entries
  - `payslips` - Employee pay statements

### Database Patterns

**Audit Columns** (all tables):
- `created_at` - Record creation timestamp
- `updated_at` - Last modification timestamp
- `created_by` - User who created record
- `updated_by` - User who last modified record

**Soft Deletes**:
- `is_active` boolean flag
- Never physically delete records
- Preserve data integrity and audit trail

**Versioning** (where applicable):
- `effective_from` - Configuration effective date
- Allows historical tracking
- Supports date-based queries

---

## API Design

### RESTful Principles

**HTTP Methods**:
- `GET` - Retrieve resources (safe, idempotent)
- `POST` - Create new resources
- `PUT` - Update entire resources (idempotent)
- `PATCH` - Partial update resources
- `DELETE` - Remove resources (idempotent)

**Status Codes**:
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid client request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error

**Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "errors": []
}
```

### API Versioning
- URL versioning: `/api/v1/resource`
- Future-proof for breaking changes
- Maintain backward compatibility

### Caching Strategy
- **Navigation tree**: In-memory cache (rarely changes)
- **Reference data**: Short-lived cache (5-15 minutes)
- **Transactional data**: No caching or very short (1-2 minutes)

---

## Security Architecture

### Authentication & Authorization (Planned)

**JWT (JSON Web Tokens)**:
- Stateless authentication
- Token-based security
- Claims-based authorization

**Role-Based Access Control (RBAC)**:
- Predefined roles (Admin, Manager, Employee, etc.)
- Permission-based resource access
- Hierarchical role inheritance

### Data Security

**Encryption**:
- HTTPS/TLS for data in transit
- Encrypted connection strings
- Sensitive data encryption at rest

**SQL Injection Prevention**:
- Parameterized queries (EF Core)
- Input validation
- Output encoding

**CORS Configuration**:
- Whitelist allowed origins
- Restrict methods and headers
- Credentials handling

---

## Deployment Architecture

### Development Environment
```
Developer Machine
├── Angular Dev Server (localhost:4200)
└── .NET API (localhost:7000)
    └── PostgreSQL (localhost:5432)
```

### Production Environment (Planned)
```
Load Balancer
├── Web Server 1 (Angular SPA)
├── Web Server 2 (Angular SPA)
└── API Cluster
    ├── API Server 1 (.NET)
    ├── API Server 2 (.NET)
    └── API Server 3 (.NET)
        └── Database Cluster
            ├── PostgreSQL Primary
            └── PostgreSQL Standby (Read Replica)
```

### CI/CD Pipeline (Planned)
1. **Source Control**: Git (GitHub)
2. **Build**: GitHub Actions / Azure DevOps
3. **Testing**: Automated unit, integration, E2E tests
4. **Containerization**: Docker
5. **Orchestration**: Kubernetes / Docker Compose
6. **Deployment**: Blue-Green or Rolling deployment
7. **Monitoring**: Application Insights, ELK Stack

---

## Performance Considerations

### Backend Optimization
- **Database Indexing**: Appropriate indexes on foreign keys and query columns
- **Query Optimization**: EF Core query optimization, avoid N+1 queries
- **Caching**: In-memory caching for frequently accessed data
- **Async/Await**: Non-blocking I/O operations
- **Pagination**: Server-side pagination for large datasets

### Frontend Optimization
- **Lazy Loading**: Route-based code splitting
- **OnPush Change Detection**: Reduce change detection cycles
- **Virtual Scrolling**: For large lists
- **Image Optimization**: Compressed, appropriately sized images
- **Bundle Optimization**: Tree-shaking, minification

---

## Monitoring & Logging

### Application Logging
- **Structured Logging**: Serilog with JSON formatting
- **Log Levels**: Trace, Debug, Information, Warning, Error, Critical
- **Log Sinks**: Console, File, Database, Cloud (Application Insights)

### Metrics to Track
- API response times
- Database query performance
- Error rates
- User activity
- System resource usage

---

## Scalability Strategy

### Horizontal Scaling
- Stateless API servers
- Load balancing
- Database read replicas

### Vertical Scaling
- Increase server resources
- Database optimization

### Caching Layer
- Redis for distributed caching
- CDN for static assets

---

## Future Enhancements

1. **Microservices Architecture** - Break down into smaller services
2. **Event-Driven Architecture** - Message queues (RabbitMQ, Azure Service Bus)
3. **GraphQL API** - Alternative to REST for complex queries
4. **Real-time Features** - SignalR for real-time updates
5. **Mobile Apps** - Native or hybrid mobile applications
6. **API Gateway** - Centralized API management (Ocelot, APIM)

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-08  
**Author**: QA-Platform Development Team
