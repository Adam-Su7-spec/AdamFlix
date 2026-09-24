using Microsoft.AspNetCore.Mvc;
using AdamFlix.Models;
using AdamFlix.Services;

namespace AdamFlix.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;

        public const string AUTHORIZED_ADMIN_EMAIL = "ssouhaimat1999@gmail.com";

        public AuthController(IAuthService authService, IEmailService emailService)
        {
            _authService = authService;
            _emailService = emailService;
        }

        [HttpPost("google/verify")]
        public async Task<IActionResult> AuthenticateGoogle([FromBody] GoogleAuthRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Email))
                return BadRequest(new { success = false, message = "Google account email is required." });

            var cleanEmail = request.Email.Trim().ToLowerInvariant();

            // STRICT GMAIL-ONLY ACCESS CONTROL
            if (!cleanEmail.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    success = false,
                    error = "ACCESS_DENIED_NON_GMAIL",
                    message = $"Access Denied: Only official @gmail.com accounts are permitted. The domain '{cleanEmail.Split('@').LastOrDefault()}' is blocked."
                });
            }

            var existingUser = _authService.GetUserByEmail(cleanEmail);
            if (existingUser != null && existingUser.IsVerified)
            {
                return Ok(new
                {
                    success = true,
                    isNewUser = false,
                    requiresOtp = false,
                    user = existingUser,
                    message = $"Welcome back, {existingUser.Name}!"
                });
            }

            // Generate 6-Digit OTP & Dispatch Activation Email
            var otpResult = _authService.GenerateOtpForUser(cleanEmail, request.Name, request.Avatar);
            await _emailService.SendOtpEmailAsync(cleanEmail, otpResult.Code);

            return Ok(new
            {
                success = true,
                isNewUser = true,
                requiresOtp = true,
                email = cleanEmail,
                maskedEmail = _authService.MaskEmail(cleanEmail),
                tempSessionId = otpResult.TempSessionId,
                expiresAt = otpResult.ExpiresAt,
                message = $"A 6-digit verification code has been dispatched to {cleanEmail}."
            });
        }

        [HttpPost("otp/verify")]
        public IActionResult VerifyOtp([FromBody] OtpVerificationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request?.Code))
                return BadRequest(new { success = false, message = "Email and 6-digit code are required." });

            var result = _authService.VerifyOtp(request.Email.Trim().ToLowerInvariant(), request.Code);
            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    error = result.ErrorCode,
                    attemptsLeft = result.AttemptsLeft,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                user = result.User,
                message = $"Account activated successfully! Welcome to AdamFlix, {result.User?.Name}."
            });
        }

        [HttpPost("otp/resend")]
        public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Email))
                return BadRequest(new { success = false, message = "Email is required." });

            var cleanEmail = request.Email.Trim().ToLowerInvariant();
            if (!cleanEmail.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
                return StatusCode(StatusCodes.Status403Forbidden, new { success = false, message = "Only @gmail.com accounts are permitted." });

            var otpResult = _authService.GenerateOtpForUser(cleanEmail);
            await _emailService.SendOtpEmailAsync(cleanEmail, otpResult.Code);

            return Ok(new
            {
                success = true,
                expiresAt = otpResult.ExpiresAt,
                message = $"A fresh 6-digit verification code has been sent to {cleanEmail}."
            });
        }
    }
}
