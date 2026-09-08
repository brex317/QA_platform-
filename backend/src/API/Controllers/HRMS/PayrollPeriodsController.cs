using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/payroll-periods")]
public class PayrollPeriodsController : ControllerBase
{
    private readonly ILogger<PayrollPeriodsController> _logger;

    public PayrollPeriodsController(ILogger<PayrollPeriodsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayrollPeriodDto>>>> GetAll([FromQuery] string? status = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollPeriodDto>>.SuccessResponse(new List<PayrollPeriodDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollPeriodDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<PayrollPeriodDto>.ErrorResponse("Payroll period not found"));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PayrollPeriodDto>>> Create([FromBody] CreatePayrollPeriodDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PayrollPeriodDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollPeriodDto>>> Update(long id, [FromBody] UpdatePayrollPeriodDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PayrollPeriodDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<bool>.ErrorResponse("Not yet implemented"));
    }
}
