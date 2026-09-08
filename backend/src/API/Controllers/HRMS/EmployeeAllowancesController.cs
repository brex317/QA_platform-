using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/employee-allowances")]
public class EmployeeAllowancesController : ControllerBase
{
    private readonly ILogger<EmployeeAllowancesController> _logger;

    public EmployeeAllowancesController(ILogger<EmployeeAllowancesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<EmployeeAllowanceDto>>>> GetAll([FromQuery] string? type = null, [FromQuery] bool? isActive = null)
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<EmployeeAllowanceDto>>.SuccessResponse(new List<EmployeeAllowanceDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EmployeeAllowanceDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Employee allowance not found"));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EmployeeAllowanceDto>>> Create([FromBody] CreateEmployeeAllowanceDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EmployeeAllowanceDto>>> Update(long id, [FromBody] UpdateEmployeeAllowanceDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<EmployeeAllowanceDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<bool>.ErrorResponse("Not yet implemented"));
    }
}
