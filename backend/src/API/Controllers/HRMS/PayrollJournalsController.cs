using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/payroll-journals")]
[Route("api/hrms/payroll/journals")]
public class PayrollJournalsController : ControllerBase
{
    private readonly IPayrollJournalService _payrollJournalService;
    private readonly ILogger<PayrollJournalsController> _logger;

    public PayrollJournalsController(IPayrollJournalService payrollJournalService, ILogger<PayrollJournalsController> logger)
    {
        _payrollJournalService = payrollJournalService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayrollJournalDto>>>> GetAll(
        [FromQuery] string? status = null,
        [FromQuery] long? runId = null)
    {
        try
        {
            var data = await _payrollJournalService.GetAllAsync(status, runId);
            return Ok(ApiResponse<List<PayrollJournalDto>>.SuccessResponse(data, "Payroll journals retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll journals");
            return StatusCode(500, ApiResponse<List<PayrollJournalDto>>.ErrorResponse("Failed to retrieve payroll journals", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollJournalDto>>> GetById(long id)
    {
        try
        {
            var data = await _payrollJournalService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<PayrollJournalDto>.ErrorResponse("Payroll journal not found"));
            }
            return Ok(ApiResponse<PayrollJournalDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll journal {Id}", id);
            return StatusCode(500, ApiResponse<PayrollJournalDto>.ErrorResponse("Failed to retrieve payroll journal", new List<string> { ex.Message }));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PayrollJournalDto>>> Create([FromBody] CreatePayrollJournalDto dto)
    {
        try
        {
            var data = await _payrollJournalService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<PayrollJournalDto>.SuccessResponse(data, "Payroll journal created successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(ApiResponse<PayrollJournalDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payroll journal");
            return StatusCode(500, ApiResponse<PayrollJournalDto>.ErrorResponse("Failed to create payroll journal", new List<string> { ex.Message }));
        }
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<PayrollJournalDto>>> UpdateStatus(long id, [FromBody] UpdatePayrollJournalStatusDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _payrollJournalService.UpdateStatusAsync(dto);
            return Ok(ApiResponse<PayrollJournalDto>.SuccessResponse(data, "Payroll journal status updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<PayrollJournalDto>.ErrorResponse("Payroll journal not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payroll journal status {Id}", id);
            return StatusCode(500, ApiResponse<PayrollJournalDto>.ErrorResponse("Failed to update payroll journal status", new List<string> { ex.Message }));
        }
    }
}
