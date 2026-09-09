using Microsoft.EntityFrameworkCore;
using QA_Platform.Domain.Entities.Help;
using QA_Platform.Domain.Entities.HRMS;
using QA_Platform.Domain.Entities.Navigation;

namespace QA_Platform.Infrastructure.Data;

/// <summary>
/// Main database context for QA Platform
/// </summary>
public class QAPlatformDbContext : DbContext
{
    public QAPlatformDbContext(DbContextOptions<QAPlatformDbContext> options) : base(options)
    {
    }

    // Navigation
    public DbSet<NavNode> NavNodes { get; set; }

    // Help Context
    public DbSet<HelpHeader> HelpHeaders { get; set; }
    public DbSet<HelpDetail> HelpDetails { get; set; }

    // HRMS - Payroll
    public DbSet<Employee> Employees { get; set; }
    public DbSet<AllowanceType> AllowanceTypes { get; set; }
    public DbSet<EmployeeAllowance> EmployeeAllowances { get; set; }
    public DbSet<PayrollPeriod> PayrollPeriods { get; set; }
    public DbSet<TaxSchedule> TaxSchedules { get; set; }
    public DbSet<PensionRule> PensionRules { get; set; }
    public DbSet<PayrollRun> PayrollRuns { get; set; }
    public DbSet<PayrollJournal> PayrollJournals { get; set; }
    public DbSet<Payslip> Payslips { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(QAPlatformDbContext).Assembly);
    }
}
