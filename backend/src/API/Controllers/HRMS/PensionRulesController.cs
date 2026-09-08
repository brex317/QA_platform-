using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/pension-rules")]
public class PensionRulesController : ControllerBase
{
    private readonly ILogger<PensionRulesController> _logger;

    public PensionRulesController(ILogger<PensionRulesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PensionRuleDto>>>> GetAll()
    {
        await Task.CompletedTask;
        return Ok(ApiResponse<List<PensionRuleDto>>.SuccessResponse(new List<PensionRuleDto>()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> GetById(long id)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<PensionRuleDto>.ErrorResponse("Pension rule not found"));
    }

    [HttpGet("employment-type/{employmentType}")]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> GetByEmploymentType(string employmentType)
    {
        await Task.CompletedTask;
        return NotFound(ApiResponse<PensionRuleDto>.ErrorResponse("Pension rule not found"));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> Create([FromBody] CreatePensionRuleDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PensionRuleDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> Update(long id, [FromBody] UpdatePensionRuleDto dto)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<PensionRuleDto>.ErrorResponse("Not yet implemented"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        await Task.CompletedTask;
        return StatusCode(501, ApiResponse<bool>.ErrorResponse("Not yet implemented"));
    }
}
