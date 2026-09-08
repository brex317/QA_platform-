using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
        
        // TODO: Register payroll services here when implemented
        // services.AddScoped<IPayrollDashboardService, PayrollDashboardService>();
        // services.AddScoped<IAllowanceTypeService, AllowanceTypeService>();
        // etc.

        return services;
    }
}
