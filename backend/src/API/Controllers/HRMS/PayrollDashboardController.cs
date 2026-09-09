using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IPayrollDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IPayrollDashboardService dashboardService, ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
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
            var data = await _dashboardService.GetDashboardSummaryAsync();
            return Ok(ApiResponse<PayrollDashboardDto>.SuccessResponse(data, "Dashboard summary retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard summary");
            return StatusCode(500, ApiResponse<PayrollDashboardDto>.ErrorResponse("Failed to retrieve dashboard summary", new List<string> { ex.Message }));
        }
    }
}
