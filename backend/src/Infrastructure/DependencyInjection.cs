using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using QA_Platform.Application.HRMS.Payroll.Interfaces;
using QA_Platform.Application.Navigation.Interfaces;
using QA_Platform.Infrastructure.Data;
using QA_Platform.Infrastructure.Services;

namespace QA_Platform.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database Context
        services.AddDbContext<QAPlatformDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(QAPlatformDbContext).Assembly.FullName)));

        // Memory Cache
        services.AddMemoryCache();

        // Services
        services.AddScoped<INavigationService, NavigationService>();
        
        // Payroll Services
        services.AddScoped<IAllowanceTypeService, AllowanceTypeService>();
        services.AddScoped<IEmployeeAllowanceService, EmployeeAllowanceService>();
        services.AddScoped<IPayrollDashboardService, PayrollDashboardService>();
        services.AddScoped<IPayrollJournalService, PayrollJournalService>();
        services.AddScoped<IPayrollPeriodService, PayrollPeriodService>();
        services.AddScoped<IPayrollReportService, PayrollReportService>();
        services.AddScoped<IPayrollRunService, PayrollRunService>();
        services.AddScoped<IPayslipService, PayslipService>();
        services.AddScoped<IPensionRuleService, PensionRuleService>();
        services.AddScoped<ITaxScheduleService, TaxScheduleService>();

        return services;
    }
}
