using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/payslips")]
public class PayslipsController : ControllerBase
{
    private readonly ILogger<PayslipsController> _logger;

    public PayslipsController(ILogger<PayslipsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayslipDto>>>> GetAll([FromQuery] string? department = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayslipDto>>.SuccessResponse(new List<PayslipDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayslipDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<PayslipDto>.ErrorResponse("Payslip not found"));
    }

    [HttpGet("run/{payrollRunId}")]
    public async Task<ActionResult<ApiResponse<List<PayslipDto>>>> GetByPayrollRun(long payrollRunId)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayslipDto>>.SuccessResponse(new List<PayslipDto>()));
    }
}
