using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.Navigation.DTOs;
using QA_Platform.Application.Navigation.Interfaces;

namespace QA_Platform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NavController : ControllerBase
{
    private readonly INavigationService _navigationService;
    private readonly ILogger<NavController> _logger;

    public NavController(INavigationService navigationService, ILogger<NavController> logger)
    {
        _navigationService = navigationService;
        _logger = logger;
    }

    /// <summary>
    /// Get complete navigation tree hierarchy
    /// </summary>
    [HttpGet("tree")]
    [ProducesResponseType(typeof(ApiResponse<List<NavNodeDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<NavNodeDto>>>> GetNavigationTree()
    {
        try
        {
            var tree = await _navigationService.GetNavigationTreeAsync();
            return Ok(ApiResponse<List<NavNodeDto>>.SuccessResponse(tree, "Navigation tree retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving navigation tree");
            return StatusCode(500, ApiResponse<List<NavNodeDto>>.ErrorResponse("Failed to retrieve navigation tree", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get navigation node by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<NavNodeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NavNodeDto>>> GetNodeById(long id)
    {
        try
        {
            var node = await _navigationService.GetNodeByIdAsync(id);
            if (node == null)
            {
                return NotFound(ApiResponse<NavNodeDto>.ErrorResponse("Navigation node not found"));
            }
            return Ok(ApiResponse<NavNodeDto>.SuccessResponse(node));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving navigation node {Id}", id);
            return StatusCode(500, ApiResponse<NavNodeDto>.ErrorResponse("Failed to retrieve navigation node", new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Get navigation node by key
    /// </summary>
    [HttpGet("key/{nodeKey}")]
    [ProducesResponseType(typeof(ApiResponse<NavNodeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NavNodeDto>>> GetNodeByKey(string nodeKey)
    {
        try
        {
            var node = await _navigationService.GetNodeByKeyAsync(nodeKey);
            if (node == null)
            {
                return NotFound(ApiResponse<NavNodeDto>.ErrorResponse("Navigation node not found"));
            }
            return Ok(ApiResponse<NavNodeDto>.SuccessResponse(node));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving navigation node by key {NodeKey}", nodeKey);
            return StatusCode(500, ApiResponse<NavNodeDto>.ErrorResponse("Failed to retrieve navigation node", new List<string> { ex.Message }));
        }
    }
}
