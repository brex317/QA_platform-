using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/payroll-runs")]
[Route("api/hrms/payroll/runs")]
public class PayrollRunsController : ControllerBase
{
    private readonly IPayrollRunService _payrollRunService;
    private readonly ILogger<PayrollRunsController> _logger;

    public PayrollRunsController(IPayrollRunService payrollRunService, ILogger<PayrollRunsController> logger)
    {
        _payrollRunService = payrollRunService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayrollRunDto>>>> GetAll([FromQuery] string? status = null)
    {
        try
        {
            var data = await _payrollRunService.GetAllAsync(status);
            return Ok(ApiResponse<List<PayrollRunDto>>.SuccessResponse(data, "Payroll runs retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll runs");
            return StatusCode(500, ApiResponse<List<PayrollRunDto>>.ErrorResponse("Failed to retrieve payroll runs", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollRunDto>>> GetById(long id)
    {
        try
        {
            var data = await _payrollRunService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<PayrollRunDto>.ErrorResponse("Payroll run not found"));
            }
            return Ok(ApiResponse<PayrollRunDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll run {Id}", id);
            return StatusCode(500, ApiResponse<PayrollRunDto>.ErrorResponse("Failed to retrieve payroll run", new List<string> { ex.Message }));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PayrollRunDto>>> Create([FromBody] CreatePayrollRunDto dto)
    {
        try
        {
            var data = await _payrollRunService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<PayrollRunDto>.SuccessResponse(data, "Payroll run created successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(ApiResponse<PayrollRunDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payroll run");
            return StatusCode(500, ApiResponse<PayrollRunDto>.ErrorResponse("Failed to create payroll run", new List<string> { ex.Message }));
        }
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<PayrollRunDto>>> UpdateStatus(long id, [FromBody] UpdatePayrollRunStatusDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _payrollRunService.UpdateStatusAsync(dto);
            return Ok(ApiResponse<PayrollRunDto>.SuccessResponse(data, "Payroll run status updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<PayrollRunDto>.ErrorResponse("Payroll run not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payroll run status {Id}", id);
            return StatusCode(500, ApiResponse<PayrollRunDto>.ErrorResponse("Failed to update payroll run status", new List<string> { ex.Message }));
        }
    }

    [HttpPost("{id}/process")]
    public async Task<ActionResult<ApiResponse<bool>>> ProcessPayroll(long id)
    {
        try
        {
            var success = await _payrollRunService.ProcessPayrollAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Payroll run not found"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Payroll processed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing payroll {Id}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to process payroll", new List<string> { ex.Message }));
        }
    }
}
