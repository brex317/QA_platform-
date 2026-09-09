using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/reports")]
public class PayrollReportsController : ControllerBase
{
    private readonly IPayrollReportService _reportService;
    private readonly ILogger<PayrollReportsController> _logger;

    public PayrollReportsController(IPayrollReportService reportService, ILogger<PayrollReportsController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet("register")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetPayrollRegister([FromQuery] long? periodId = null)
    {
        try
        {
            var data = await _reportService.GetPayrollRegisterAsync(periodId);
            return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(data, "Payroll register report retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll register report");
            return StatusCode(500, ApiResponse<List<PayrollReportDto>>.ErrorResponse("Failed to retrieve payroll register report", new List<string> { ex.Message }));
        }
    }

    [HttpGet("tax")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetTaxReport([FromQuery] long? periodId = null)
    {
        try
        {
            var data = await _reportService.GetTaxReportAsync(periodId);
            return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(data, "Tax report retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tax report");
            return StatusCode(500, ApiResponse<List<PayrollReportDto>>.ErrorResponse("Failed to retrieve tax report", new List<string> { ex.Message }));
        }
    }

    [HttpGet("pension")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetPensionReport([FromQuery] long? periodId = null)
    {
        try
        {
            var data = await _reportService.GetPensionReportAsync(periodId);
            return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(data, "Pension report retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pension report");
            return StatusCode(500, ApiResponse<List<PayrollReportDto>>.ErrorResponse("Failed to retrieve pension report", new List<string> { ex.Message }));
        }
    }

    [HttpGet("department")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetDepartmentReport([FromQuery] long? periodId = null)
    {
        try
        {
            var data = await _reportService.GetDepartmentReportAsync(periodId);
            return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(data, "Department report retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving department report");
            return StatusCode(500, ApiResponse<List<PayrollReportDto>>.ErrorResponse("Failed to retrieve department report", new List<string> { ex.Message }));
        }
    }
}
