using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/journals")]
public class PayrollJournalsController : ControllerBase
{
    private readonly ILogger<PayrollJournalsController> _logger;

    public PayrollJournalsController(ILogger<PayrollJournalsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayrollJournalDto>>>> GetAll(
        [FromQuery] string? status = null,
        [FromQuery] long? runId = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PayrollJournalDto>>.SuccessResponse(new List<PayrollJournalDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollJournalDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<PayrollJournalDto>.ErrorResponse("Payroll journal not found"));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PayrollJournalDto>>> Create([FromBody] CreatePayrollJournalDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PayrollJournalDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<PayrollJournalDto>>> UpdateStatus(long id, [FromBody] UpdatePayrollJournalStatusDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PayrollJournalDto>.ErrorResponse("Not yet implemented"));
    }
}
