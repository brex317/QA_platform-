using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.Help.DTOs;
using QA_Platform.Application.Help.Interfaces;

namespace QA_Platform.API.Controllers;

[ApiController]
[Route("api/help")]
public class HelpController : ControllerBase
{
    private readonly IHelpService _helpService;
    private readonly ILogger<HelpController> _logger;

    public HelpController(IHelpService helpService, ILogger<HelpController> logger)
    {
        _helpService = helpService;
        _logger = logger;
    }

    /// <summary>
    /// Get page-level help steps for a given node (falls back to parent node if no page help on node)
    /// GET /api/help/page?nodeKey=...
    /// </summary>
    [HttpGet("page")]
    public async Task<ActionResult<ApiResponse<HelpResponseDto>>> GetPageHelp([FromQuery] string nodeKey)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(nodeKey))
            {
                return BadRequest(ApiResponse<HelpResponseDto>.ErrorResponse("nodeKey parameter is required"));
            }

            var data = await _helpService.GetPageHelpAsync(nodeKey);
            if (data == null)
            {
                return NotFound(ApiResponse<HelpResponseDto>.ErrorResponse($"No help found for node key '{nodeKey}'"));
            }

            return Ok(ApiResponse<HelpResponseDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving page help for nodeKey {NodeKey}", nodeKey);
            return StatusCode(500, ApiResponse<HelpResponseDto>.ErrorResponse("Failed to retrieve page help content", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get form-level help steps for a given node and formContext
    /// GET /api/help/form?nodeKey=...&context=add_form
    /// </summary>
    [HttpGet("form")]
    public async Task<ActionResult<ApiResponse<HelpResponseDto>>> GetFormHelp([FromQuery] string nodeKey, [FromQuery] string context = "add_form")
    {
        try
        {
            if (string.IsNullOrWhiteSpace(nodeKey))
            {
                return BadRequest(ApiResponse<HelpResponseDto>.ErrorResponse("nodeKey parameter is required"));
            }

            var data = await _helpService.GetFormHelpAsync(nodeKey, context);
            if (data == null)
            {
                return Ok(ApiResponse<HelpResponseDto?>.SuccessResponse(null, "No form help configured for this feature"));
            }

            return Ok(ApiResponse<HelpResponseDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving form help for nodeKey {NodeKey}, context {Context}", nodeKey, context);
            return StatusCode(500, ApiResponse<HelpResponseDto>.ErrorResponse("Failed to retrieve form help content", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Fallback endpoint for legacy requests
    /// GET /api/help?nodeKey=...
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<HelpResponseDto>>> GetHelp([FromQuery] string nodeKey)
    {
        return await GetPageHelp(nodeKey);
    }
}
