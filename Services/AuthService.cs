using System.Collections.Concurrent;
using System.Security.Cryptography;
using AdamFlix.Models;

namespace AdamFlix.Services
{
    public interface IAuthService
    {
        User? GetUserByEmail(string email);
        GeneratedOtp GenerateOtpForUser(string email, string? name = null, string? avatar = null);
        OtpVerificationResult VerifyOtp(string email, string code);
        string MaskEmail(string email);
    }

    public class AuthService : IAuthService
    {
        public const string AUTHORIZED_ADMIN_EMAIL = "ssouhaimat1999@gmail.com";

        private class PendingOtp
        {
            public string Email { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string Avatar { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;
            public long ExpiresAt { get; set; }
            public int AttemptsLeft { get; set; } = 5;
            public string TempSessionId { get; set; } = string.Empty;
        }

        private readonly ConcurrentDictionary<string, User> _users = new();
        private readonly ConcurrentDictionary<string, PendingOtp> _pendingOtps = new();

        public AuthService()
        {
            // Seed verified super admin
            _users.TryAdd(AUTHORIZED_ADMIN_EMAIL.ToLowerInvariant(), new User
            {
                Id = "u-admin-101",
                Name = "Souhaimat (Administrator)",
                Email = AUTHORIZED_ADMIN_EMAIL,
                Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                Role = "admin",
                IsVerified = true,
                AuthProvider = "google"
            });
        }

        public User? GetUserByEmail(string email)
        {
            _users.TryGetValue(email.ToLowerInvariant(), out var user);
            return user;
        }

        public GeneratedOtp GenerateOtpForUser(string email, string? name = null, string? avatar = null)
        {
            var cleanEmail = email.ToLowerInvariant();
            var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            var sessionId = $"sess_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            var expiresAt = DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeMilliseconds();

            var pending = new PendingOtp
            {
                Email = cleanEmail,
                Name = name ?? cleanEmail.Split('@')[0],
                Avatar = avatar ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                Code = code,
                ExpiresAt = expiresAt,
                AttemptsLeft = 5,
                TempSessionId = sessionId
            };

            _pendingOtps.AddOrUpdate(cleanEmail, pending, (_, _) => pending);

            return new GeneratedOtp
            {
                Code = code,
                TempSessionId = sessionId,
                ExpiresAt = expiresAt
            };
        }

        public OtpVerificationResult VerifyOtp(string email, string code)
        {
            var cleanEmail = email.ToLowerInvariant();

            if (!_pendingOtps.TryGetValue(cleanEmail, out var pending))
            {
                return new OtpVerificationResult
                {
                    Success = false,
                    ErrorCode = "NO_PENDING_OTP",
                    Message = "No pending verification found. Please sign in again."
                };
            }

            if (DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() > pending.ExpiresAt)
            {
                _pendingOtps.TryRemove(cleanEmail, out _);
                return new OtpVerificationResult
                {
                    Success = false,
                    ErrorCode = "OTP_EXPIRED",
                    Message = "This verification code has expired. Please request a new one."
                };
            }

            if (pending.AttemptsLeft <= 0)
            {
                _pendingOtps.TryRemove(cleanEmail, out _);
                return new OtpVerificationResult
                {
                    Success = false,
                    ErrorCode = "TOO_MANY_ATTEMPTS",
                    Message = "Too many incorrect attempts. Please request a new code."
                };
            }

            if (pending.Code != code.Trim())
            {
                pending.AttemptsLeft -= 1;
                return new OtpVerificationResult
                {
                    Success = false,
                    ErrorCode = "INVALID_OTP",
                    AttemptsLeft = pending.AttemptsLeft,
                    Message = $"Invalid code. {pending.AttemptsLeft} attempt(s) remaining."
                };
            }

            var isAdmin = cleanEmail.Equals(AUTHORIZED_ADMIN_EMAIL, StringComparison.OrdinalIgnoreCase);
            var activatedUser = new User
            {
                Id = isAdmin ? "u-admin-101" : $"u-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                Name = pending.Name,
                Email = cleanEmail,
                Avatar = pending.Avatar,
                Role = isAdmin ? "admin" : "user",
                IsVerified = true,
                AuthProvider = "google"
            };

            _users.AddOrUpdate(cleanEmail, activatedUser, (_, _) => activatedUser);
            _pendingOtps.TryRemove(cleanEmail, out _);

            return new OtpVerificationResult
            {
                Success = true,
                User = activatedUser,
                Message = "Account verified successfully."
            };
        }

        public string MaskEmail(string email)
        {
            var parts = email.Split('@');
            if (parts.Length != 2) return email;
            var u = parts[0];
            return u.Length <= 3 ? $"{u[0]}***@{parts[1]}" : $"{u[..2]}***{u[^2..]}@{parts[1]}";
        }
    }
}
