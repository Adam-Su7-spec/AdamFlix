using System.Net;
using System.Net.Mail;

namespace AdamFlix.Services
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string toEmail, string otpCode);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otpCode)
        {
            var host = _config["Smtp:Host"] ?? "smtp.gmail.com";
            var port = int.TryParse(_config["Smtp:Port"], out var p) ? p : 587;
            var user = _config["Smtp:User"];
            var pass = _config["Smtp:Pass"];

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<body style=""background-color: #080B12; font-family: sans-serif; color: #FFFFFF; padding: 30px;"">
    <div style=""max-width: 520px; margin: 0 auto; background: #0E1424; border: 1px solid #1E2638; border-radius: 20px; padding: 35px;"">
        <h2 style=""color: #00D4FF; text-align: center; margin-bottom: 8px;"">AdamFlix Cinema Activation</h2>
        <p style=""color: #A7AFBF; text-align: center; font-size: 14px;"">Your 6-digit registration code is:</p>
        <div style=""text-align: center; margin: 25px 0;"">
            <span style=""background: #151B28; border: 1px solid #7C5CFF; border-radius: 12px; padding: 14px 28px; font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 8px; color: #00D4FF;"">
                {otpCode}
            </span>
        </div>
        <p style=""font-size: 12px; color: #A7AFBF; text-align: center;"">Expires in 10 minutes. If you did not request this, please ignore.</p>
    </div>
</body>
</html>";

            try
            {
                if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(pass))
                {
                    using var client = new SmtpClient(host, port)
                    {
                        Credentials = new NetworkCredential(user, pass),
                        EnableSsl = true
                    };

                    using var mail = new MailMessage
                    {
                        From = new MailAddress(user, "AdamFlix Cinema Security"),
                        Subject = $"{otpCode} is your AdamFlix Verification Code",
                        Body = htmlBody,
                        IsBodyHtml = true
                    };
                    mail.To.Add(toEmail);

                    await client.SendMailAsync(mail);
                }
                else
                {
                    _logger.LogInformation("[EmailService Live Code Log] {Code} -> {Email}", otpCode, toEmail);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailService] Error dispatching email");
            }
        }
    }
}
