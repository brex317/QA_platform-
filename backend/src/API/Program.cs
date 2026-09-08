using QA_Platform.Infrastructure;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ===================================================================
// Add services to the container
// ===================================================================

// Controllers with JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4400", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Infrastructure services (DbContext, Services, Repositories)
builder.Services.AddInfrastructure(builder.Configuration);

// API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "QA-Platform ERP API",
        Version = "v1",
        Description = "RESTful API for QA-Platform ERP System - Phase 1: HRMS Payroll Module",
        Contact = new OpenApiContact
        {
            Name = "QA-Platform Development Team",
            Email = "support@qa-platform.com"
        }
    });

    // Enable XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Health checks
builder.Services.AddHealthChecks();

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

if (builder.Environment.IsDevelopment())
{
    builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Information);
}

// ===================================================================
// Build the application
// ===================================================================
var app = builder.Build();

// ===================================================================
// Configure the HTTP request pipeline
// ===================================================================

// Global exception handling middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(exception, "Unhandled exception occurred");

        var response = new
        {
            success = false,
            message = "An unexpected error occurred. Please try again later.",
            errors = app.Environment.IsDevelopment() && exception != null
                ? new[] { exception.Message, exception.StackTrace ?? "" }
                : Array.Empty<string>()
        };

        await context.Response.WriteAsJsonAsync(response);
    });
});

// Swagger UI (Development and Staging)
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "QA-Platform API V1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "QA-Platform ERP API Documentation";
        c.DisplayRequestDuration();
    });
}

// HTTPS Redirection
app.UseHttpsRedirection();

// CORS
app.UseCors("AllowAngularApp");

// Authentication & Authorization (when implemented)
// app.UseAuthentication();
// app.UseAuthorization();

// Health check endpoint
app.MapHealthChecks("/health");

// Map controllers
app.MapControllers();

// Welcome endpoint
app.MapGet("/", () => new
{
    application = "QA-Platform ERP API",
    version = "1.0.0",
    status = "Running",
    environment = app.Environment.EnvironmentName,
    timestamp = DateTime.UtcNow,
    endpoints = new
    {
        swagger = "/swagger",
        health = "/health",
        navigation = "/api/nav/tree",
        payrollDashboard = "/api/hrms/payroll/dashboard/summary"
    }
}).WithName("Root").WithTags("Info");

// ===================================================================
// Run the application
// ===================================================================
app.Logger.LogInformation("QA-Platform ERP API starting...");
app.Logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
app.Logger.LogInformation("CORS enabled for: http://localhost:4400, http://localhost:4200");

app.Run();

// Make the implicit Program class public for testing
public partial class Program { }
