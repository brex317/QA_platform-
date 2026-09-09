using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/payroll-periods")]
public class PayrollPeriodsController : ControllerBase
{
    private readonly IPayrollPeriodService _payrollPeriodService;
    private readonly ILogger<PayrollPeriodsController> _logger;

    public PayrollPeriodsController(IPayrollPeriodService payrollPeriodService, ILogger<PayrollPeriodsController> logger)
    {
        _payrollPeriodService = payrollPeriodService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayrollPeriodDto>>>> GetAll([FromQuery] string? status = null)
    {
        try
        {
            var data = await _payrollPeriodService.GetAllAsync(status);
            return Ok(ApiResponse<List<PayrollPeriodDto>>.SuccessResponse(data, "Payroll periods retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll periods");
            return StatusCode(500, ApiResponse<List<PayrollPeriodDto>>.ErrorResponse("Failed to retrieve payroll periods", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollPeriodDto>>> GetById(long id)
    {
        try
        {
            var data = await _payrollPeriodService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<PayrollPeriodDto>.ErrorResponse("Payroll period not found"));
            }
            return Ok(ApiResponse<PayrollPeriodDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payroll period {Id}", id);
            return StatusCode(500, ApiResponse<PayrollPeriodDto>.ErrorResponse("Failed to retrieve payroll period", new List<string> { ex.Message }));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PayrollPeriodDto>>> Create([FromBody] CreatePayrollPeriodDto dto)
    {
        try
        {
            var data = await _payrollPeriodService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<PayrollPeriodDto>.SuccessResponse(data, "Payroll period created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payroll period");
            return StatusCode(500, ApiResponse<PayrollPeriodDto>.ErrorResponse("Failed to create payroll period", new List<string> { ex.Message }));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PayrollPeriodDto>>> Update(long id, [FromBody] UpdatePayrollPeriodDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _payrollPeriodService.UpdateAsync(dto);
            return Ok(ApiResponse<PayrollPeriodDto>.SuccessResponse(data, "Payroll period updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<PayrollPeriodDto>.ErrorResponse("Payroll period not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payroll period {Id}", id);
            return StatusCode(500, ApiResponse<PayrollPeriodDto>.ErrorResponse("Failed to update payroll period", new List<string> { ex.Message }));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        try
        {
            var success = await _payrollPeriodService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Payroll period not found"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Payroll period deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting payroll period {Id}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to delete payroll period", new List<string> { ex.Message }));
        }
    }
}
