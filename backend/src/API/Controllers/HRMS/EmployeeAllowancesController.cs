using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/employee-allowances")]
public class EmployeeAllowancesController : ControllerBase
{
    private readonly IEmployeeAllowanceService _employeeAllowanceService;
    private readonly ILogger<EmployeeAllowancesController> _logger;

    public EmployeeAllowancesController(IEmployeeAllowanceService employeeAllowanceService, ILogger<EmployeeAllowancesController> logger)
    {
        _employeeAllowanceService = employeeAllowanceService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<EmployeeAllowanceDto>>>> GetAll([FromQuery] string? type = null, [FromQuery] bool? isActive = null)
    {
        try
        {
            var data = await _employeeAllowanceService.GetAllAsync(type, isActive);
            return Ok(ApiResponse<List<EmployeeAllowanceDto>>.SuccessResponse(data, "Employee allowances retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving employee allowances");
            return StatusCode(500, ApiResponse<List<EmployeeAllowanceDto>>.ErrorResponse("Failed to retrieve employee allowances", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EmployeeAllowanceDto>>> GetById(long id)
    {
        try
        {
            var data = await _employeeAllowanceService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Employee allowance not found"));
            }
            return Ok(ApiResponse<EmployeeAllowanceDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving employee allowance {Id}", id);
            return StatusCode(500, ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Failed to retrieve employee allowance", new List<string> { ex.Message }));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EmployeeAllowanceDto>>> Create([FromBody] CreateEmployeeAllowanceDto dto)
    {
        try
        {
            var data = await _employeeAllowanceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<EmployeeAllowanceDto>.SuccessResponse(data, "Employee allowance created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating employee allowance");
            return StatusCode(500, ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Failed to create employee allowance", new List<string> { ex.Message }));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EmployeeAllowanceDto>>> Update(long id, [FromBody] UpdateEmployeeAllowanceDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _employeeAllowanceService.UpdateAsync(dto);
            return Ok(ApiResponse<EmployeeAllowanceDto>.SuccessResponse(data, "Employee allowance updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Employee allowance not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating employee allowance {Id}", id);
            return StatusCode(500, ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Failed to update employee allowance", new List<string> { ex.Message }));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        try
        {
            var success = await _employeeAllowanceService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Employee allowance not found"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Employee allowance deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting employee allowance {Id}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to delete employee allowance", new List<string> { ex.Message }));
        }
    }
}
