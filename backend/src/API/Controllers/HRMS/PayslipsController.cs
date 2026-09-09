using Microsoft.AspNetCore.Mvc;
using QA_Platform.Application.Common;
using QA_Platform.Application.HRMS.Payroll.DTOs;
using QA_Platform.Application.HRMS.Payroll.Interfaces;

namespace QA_Platform.API.Controllers.HRMS;

[ApiController]
[Route("api/hrms/payroll/payslips")]
public class PayslipsController : ControllerBase
{
    private readonly IPayslipService _payslipService;
    private readonly ILogger<PayslipsController> _logger;

    public PayslipsController(IPayslipService payslipService, ILogger<PayslipsController> logger)
    {
        _payslipService = payslipService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PayslipDto>>>> GetAll([FromQuery] string? department = null)
    {
        try
        {
            var data = await _payslipService.GetAllAsync(department);
            return Ok(ApiResponse<List<PayslipDto>>.SuccessResponse(data, "Payslips retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payslips");
            return StatusCode(500, ApiResponse<List<PayslipDto>>.ErrorResponse("Failed to retrieve payslips", new List<string> { ex.Message }));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PayslipDto>>> GetById(long id)
    {
        try
        {
            var data = await _payslipService.GetByIdAsync(id);
            if (data == null)
            {
                return NotFound(ApiResponse<PayslipDto>.ErrorResponse("Payslip not found"));
            }
            return Ok(ApiResponse<PayslipDto>.SuccessResponse(data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payslip {Id}", id);
            return StatusCode(500, ApiResponse<PayslipDto>.ErrorResponse("Failed to retrieve payslip", new List<string> { ex.Message }));
        }
    }

    [HttpGet("run/{payrollRunId}")]
    public async Task<ActionResult<ApiResponse<List<PayslipDto>>>> GetByPayrollRun(long payrollRunId)
    {
        try
        {
            var data = await _payslipService.GetByPayrollRunIdAsync(payrollRunId);
            return Ok(ApiResponse<List<PayslipDto>>.SuccessResponse(data, "Payslips retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payslips for payroll run {RunId}", payrollRunId);
            return StatusCode(500, ApiResponse<List<PayslipDto>>.ErrorResponse("Failed to retrieve payslips", new List<string> { ex.Message }));
        }
    }
}
