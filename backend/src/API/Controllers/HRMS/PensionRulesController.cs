using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/pension-rules")]
public class PensionRulesController : ControllerBase
{
    private readonly IPensionRuleService _pensionRuleService;
    private readonly ILogger<PensionRulesController> _logger;

    public PensionRulesController(IPensionRuleService pensionRuleService, ILogger<PensionRulesController> logger)
    {
        _pensionRuleService = pensionRuleService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PensionRuleDto>>>> GetAll()
    {
        try
        {
            var data = await _pensionRuleService.GetAllAsync();
            return Ok(ApiResponse<List<PensionRuleDto>>.SuccessResponse(data, "Pension rules retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pension rules");
            return StatusCode(500, ApiResponse<List<PensionRuleDto>>.ErrorResponse("Failed to retrieve pension rules", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> GetById(long id)
    {
        try
        {
            var data = await _pensionRuleService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<PensionRuleDto>.ErrorResponse("Pension rule not found"));
            }
            return Ok(ApiResponse<PensionRuleDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pension rule {Id}", id);
            return StatusCode(500, ApiResponse<PensionRuleDto>.ErrorResponse("Failed to retrieve pension rule", new List<string> { ex.Message }));
        }
    }

    [HttpGet("employment-type/{employmentType}")]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> GetByEmploymentType(string employmentType)
    {
        try
        {
            var data = await _pensionRuleService.GetByEmploymentTypeAsync(employmentType);
            if (data == null)
            {
                return NotFound(ApiResponse<PensionRuleDto>.ErrorResponse("Pension rule not found"));
            }
            return Ok(ApiResponse<PensionRuleDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pension rule for employment type {EmploymentType}", employmentType);
            return StatusCode(500, ApiResponse<PensionRuleDto>.ErrorResponse("Failed to retrieve pension rule", new List<string> { ex.Message }));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> Create([FromBody] CreatePensionRuleDto dto)
    {
        try
        {
            var data = await _pensionRuleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<PensionRuleDto>.SuccessResponse(data, "Pension rule created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating pension rule");
            return StatusCode(500, ApiResponse<PensionRuleDto>.ErrorResponse("Failed to create pension rule", new List<string> { ex.Message }));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PensionRuleDto>>> Update(long id, [FromBody] UpdatePensionRuleDto dto)
    {
        try
        {
            dto.Id = id;
            var data = await _pensionRuleService.UpdateAsync(dto);
            return Ok(ApiResponse<PensionRuleDto>.SuccessResponse(data, "Pension rule updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<PensionRuleDto>.ErrorResponse("Pension rule not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating pension rule {Id}", id);
            return StatusCode(500, ApiResponse<PensionRuleDto>.ErrorResponse("Failed to update pension rule", new List<string> { ex.Message }));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(long id)
    {
        try
        {
            var success = await _pensionRuleService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("Pension rule not found"));
            }
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Pension rule deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting pension rule {Id}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to delete pension rule", new List<string> { ex.Message }));
        }
    }
}
