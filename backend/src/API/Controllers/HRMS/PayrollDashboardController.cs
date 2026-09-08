using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(ILogger<DashboardController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get payroll dashboard summary with KPIs
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(ApiResponse<PayrollDashboardDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PayrollDashboardDto>>> GetDashboardSummary()
    {
        try
        {
            // TODO: Implement when IPayrollDashboardService is available
            var mockData = new PayrollDashboardDto
            {
                TotalEmployees = 26,
                ActivePeriod = "2025-01",
                TotalPayrollRuns = 0,
                TotalGrossPay = 0,
                TotalNetPay = 0,
                Currency = "ETB"
            };

            await Task.CompletedTask; // Placeholder for async operation
            return Ok(ApiResponse<PayrollDashboardDto>.SuccessResponse(mockData, "Dashboard summary retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard summary");
            return StatusCode(500, ApiResponse<PayrollDashboardDto>.ErrorResponse("Failed to retrieve dashboard summary", new List<string> { ex.Message }));
        }
    }
}
