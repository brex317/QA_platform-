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

    [HttpGet]
    public async Task<ActionResult<ApiResponse<HelpResponseDto>>> GetHelp([FromQuery] string nodeKey)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(nodeKey))
            {
                return BadRequest(ApiResponse<HelpResponseDto>.ErrorResponse("nodeKey parameter is required"));
            }

            var data = await _helpService.GetHelpByNodeKeyAsync(nodeKey);
            return Ok(ApiResponse<HelpResponseDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving help for nodeKey {NodeKey}", nodeKey);
            return StatusCode(500, ApiResponse<HelpResponseDto>.ErrorResponse("Failed to retrieve help content", new List<string> { ex.Message }));
        }
    }
}
