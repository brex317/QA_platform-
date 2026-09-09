using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/tax-schedules")]
public class TaxSchedulesController : ControllerBase
{
    private readonly ITaxScheduleService _taxScheduleService;
    private readonly ILogger<TaxSchedulesController> _logger;

    public TaxSchedulesController(ITaxScheduleService taxScheduleService, ILogger<TaxSchedulesController> logger)
    {
        _taxScheduleService = taxScheduleService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TaxScheduleDto>>>> GetAll()
    {
        try
        {
            var data = await _taxScheduleService.GetAllAsync();
            return Ok(ApiResponse<List<TaxScheduleDto>>.SuccessResponse(data, "Tax schedules retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tax schedules");
            return StatusCode(500, ApiResponse<List<TaxScheduleDto>>.ErrorResponse("Failed to retrieve tax schedules", new List<string> { ex.Message }));
        }
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<List<TaxScheduleDto>>>> GetActiveSchedules()
    {
        try
        {
            var data = await _taxScheduleService.GetActiveSchedulesAsync();
            return Ok(ApiResponse<List<TaxScheduleDto>>.SuccessResponse(data, "Active tax schedules retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active tax schedules");
            return StatusCode(500, ApiResponse<List<TaxScheduleDto>>.ErrorResponse("Failed to retrieve active tax schedules", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TaxScheduleDto>>> GetById(long id)
    {
        try
        {
            var data = await _taxScheduleService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<TaxScheduleDto>.ErrorResponse("Tax schedule not found"));
            }
            return Ok(ApiResponse<TaxScheduleDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tax schedule {Id}", id);
            return StatusCode(500, ApiResponse<TaxScheduleDto>.ErrorResponse("Failed to retrieve tax schedule", new List<string> { ex.Message }));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TaxScheduleDto>>> Create([FromBody] CreateTaxScheduleDto dto)
    {
        try
        {
            var data = await _taxScheduleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<TaxScheduleDto>.SuccessResponse(data, "Tax schedule created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tax schedule");
            return StatusCode(500, ApiResponse<TaxScheduleDto>.ErrorResponse("Failed to create tax schedule", new List<string> { ex.Message }));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TaxScheduleDto>>> Update(long id, [FromBody] UpdateTaxScheduleDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _taxScheduleService.UpdateAsync(dto);
            return Ok(ApiResponse<TaxScheduleDto>.SuccessResponse(data, "Tax schedule updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<TaxScheduleDto>.ErrorResponse("Tax schedule not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tax schedule {Id}", id);
            return StatusCode(500, ApiResponse<TaxScheduleDto>.ErrorResponse("Failed to update tax schedule", new List<string> { ex.Message }));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        try
        {
            var success = await _taxScheduleService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Tax schedule not found"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Tax schedule deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tax schedule {Id}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to delete tax schedule", new List<string> { ex.Message }));
        }
    }
}
