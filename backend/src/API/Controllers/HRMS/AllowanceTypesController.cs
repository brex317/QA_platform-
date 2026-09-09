using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/allowance-types")]
public class AllowanceTypesController : ControllerBase
{
    private readonly IAllowanceTypeService _allowanceTypeService;
    private readonly ILogger<AllowanceTypesController> _logger;

    public AllowanceTypesController(IAllowanceTypeService allowanceTypeService, ILogger<AllowanceTypesController> logger)
    {
        _allowanceTypeService = allowanceTypeService;
        _logger = logger;
    }

    /// <summary>
    /// Get all allowance types with optional filtering
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<AllowanceTypeDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<AllowanceTypeDto>>>> GetAll(
        [FromQuery] string? type = null,
        [FromQuery] bool? isActive = null)
    {
        try
        {
            var data = await _allowanceTypeService.GetAllAsync(type, isActive);
            return Ok(ApiResponse<List<AllowanceTypeDto>>.SuccessResponse(data, "Allowance types retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance types");
            return StatusCode(500, ApiResponse<List<AllowanceTypeDto>>.ErrorResponse("Failed to retrieve allowance types", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get allowance type by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<AllowanceTypeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<AllowanceTypeDto>>> GetById(long id)
    {
        try
        {
            var data = await _allowanceTypeService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<AllowanceTypeDto>.ErrorResponse("Allowance type not found"));
            }
            return Ok(ApiResponse<AllowanceTypeDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving allowance type {Id}", id);
            return StatusCode(500, ApiResponse<AllowanceTypeDto>.ErrorResponse("Failed to retrieve allowance type", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Create new allowance type
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<AllowanceTypeDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<AllowanceTypeDto>>> Create([FromBody] CreateAllowanceTypeDto dto)
    {
        try
        {
            var data = await _allowanceTypeService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<AllowanceTypeDto>.SuccessResponse(data, "Allowance type created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating allowance type");
            return StatusCode(500, ApiResponse<AllowanceTypeDto>.ErrorResponse("Failed to create allowance type", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Update existing allowance type
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<AllowanceTypeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<AllowanceTypeDto>>> Update(long id, [FromBody] UpdateAllowanceTypeDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _allowanceTypeService.UpdateAsync(dto);
            return Ok(ApiResponse<AllowanceTypeDto>.SuccessResponse(data, "Allowance type updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<AllowanceTypeDto>.ErrorResponse("Allowance type not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating allowance type {Id}", id);
            return StatusCode(500, ApiResponse<AllowanceTypeDto>.ErrorResponse("Failed to update allowance type", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Delete allowance type (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        try
        {
            var success = await _allowanceTypeService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Allowance type not found"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Allowance type deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting allowance type {Id}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to delete allowance type", new List<string> { ex.Message }));
        }
    }
}
