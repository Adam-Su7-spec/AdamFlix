namespace AdamFlix.Models
{
    public class GoogleAuthRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string GoogleIdToken { get; set; } = string.Empty;
    }

    public class OtpVerificationRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string TempSessionId { get; set; } = string.Empty;
    }

    public class ResendOtpRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class OtpVerificationResult
    {
        public bool Success { get; set; }
        public string ErrorCode { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int AttemptsLeft { get; set; } = 5;
        public User? User { get; set; }
    }

    public class GeneratedOtp
    {
        public string Code { get; set; } = string.Empty;
        public string TempSessionId { get; set; } = string.Empty;
        public long ExpiresAt { get; set; }
    }
}
