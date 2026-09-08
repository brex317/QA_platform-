using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/reports")]
public class PayrollReportsController : ControllerBase
{
    private readonly ILogger<PayrollReportsController> _logger;

    public PayrollReportsController(ILogger<PayrollReportsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("register")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetPayrollRegister([FromQuery] long? periodId = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(new List<PayrollReportDto>()));
    }

    [HttpGet("tax")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetTaxReport([FromQuery] long? periodId = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(new List<PayrollReportDto>()));
    }

    [HttpGet("pension")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetPensionReport([FromQuery] long? periodId = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(new List<PayrollReportDto>()));
    }

    [HttpGet("department")]
    public async Task<ActionResult<ApiResponse<List<PayrollReportDto>>>> GetDepartmentReport([FromQuery] long? periodId = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollReportDto>>.SuccessResponse(new List<PayrollReportDto>()));
    }
}
