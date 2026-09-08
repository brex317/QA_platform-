using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/tax-schedules")]
public class TaxSchedulesController : ControllerBase
{
    private readonly ILogger<TaxSchedulesController> _logger;

    public TaxSchedulesController(ILogger<TaxSchedulesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TaxScheduleDto>>>> GetAll()
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<TaxScheduleDto>>.SuccessResponse(new List<TaxScheduleDto>()));
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<List<TaxScheduleDto>>>> GetActiveSchedules()
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<TaxScheduleDto>>.SuccessResponse(new List<TaxScheduleDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TaxScheduleDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<TaxScheduleDto>.ErrorResponse("Tax schedule not found"));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TaxScheduleDto>>> Create([FromBody] CreateTaxScheduleDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<TaxScheduleDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TaxScheduleDto>>> Update(long id, [FromBody] UpdateTaxScheduleDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<TaxScheduleDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<bool>.ErrorResponse("Not yet implemented"));
    }
}
