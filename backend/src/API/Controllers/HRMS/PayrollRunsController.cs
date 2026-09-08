using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/runs")]
public class PayrollRunsController : ControllerBase
{
    private readonly ILogger<PayrollRunsController> _logger;

    public PayrollRunsController(ILogger<PayrollRunsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayrollRunDto>>>> GetAll([FromQuery] string? status = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollRunDto>>.SuccessResponse(new List<PayrollRunDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollRunDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<PayrollRunDto>.ErrorResponse("Payroll run not found"));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PayrollRunDto>>> Create([FromBody] CreatePayrollRunDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PayrollRunDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<PayrollRunDto>>> UpdateStatus(long id, [FromBody] UpdatePayrollRunStatusDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PayrollRunDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPost("{id}/process")]
    public async Task<ActionResult<ApiResponse<bool>>> ProcessPayroll(long id)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<bool>.ErrorResponse("Not yet implemented"));
    }
}
