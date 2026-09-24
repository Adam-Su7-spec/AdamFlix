import nodemailer, { type Transporter } from 'nodemailer';
import { EmailDispatchRecord } from '../types';

// In-memory log of recent email dispatches for security auditing & UI testing
const dispatchedEmailLog: EmailDispatchRecord[] = [];

// Transporter configuration: uses SMTP env if configured, or fallback transporter
let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    console.log(`[EmailService] Configured live SMTP transport via ${host}:${port}`);
  } else {
    // Development / preview fallback: ethereal or mock transporter
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[EmailService] Ethereal test transport initialized: ${testAccount.user}`);
    } catch {
      // Fallback json transport if external network is unavailable
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
      console.log('[EmailService] In-memory JSON transport initialized');
    }
  }

  return transporter;
}

export function generateVerificationEmailHtml(code: string, recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AdamFlix Security Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B12; margin: 0; padding: 24px; color: #ffffff; }
    .container { max-width: 540px; margin: 0 auto; background: #0E1424; border: 1px solid #1E2638; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { padding: 32px 32px 24px; text-align: center; background: linear-gradient(180deg, #151B28 0%, #0E1424 100%); border-bottom: 1px solid #1E2638; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
    .logo-adam { color: #ffffff; }
    .logo-flix { color: #7C5CFF; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(124, 92, 255, 0.15); border: 1px solid rgba(124, 92, 255, 0.4); border-radius: 9999px; font-size: 11px; font-weight: 700; color: #7C5CFF; letter-spacing: 1px; text-transform: uppercase; margin-top: 12px; }
    .content { padding: 32px; text-align: center; }
    .title { font-size: 20px; font-weight: 700; margin: 0 0 12px; color: #ffffff; }
    .subtitle { font-size: 14px; line-height: 1.6; color: #A7AFBF; margin: 0 0 28px; }
    .code-box { background: #080B12; border: 2px dashed #7C5CFF; border-radius: 16px; padding: 20px; margin: 0 auto 28px; display: inline-block; min-width: 240px; }
    .code-number { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #00D4FF; margin: 0; text-shadow: 0 0 15px rgba(0, 212, 255, 0.4); }
    .code-expiry { font-size: 12px; color: #A7AFBF; margin-top: 8px; font-weight: 500; }
    .account-info { background: #151B28; border-radius: 12px; padding: 12px 16px; font-size: 13px; color: #A7AFBF; margin-bottom: 24px; text-align: left; border: 1px solid #1F293D; }
    .account-info strong { color: #ffffff; }
    .security-notice { font-size: 12px; color: #757D8A; line-height: 1.5; border-top: 1px solid #1E2638; padding-top: 20px; }
    .footer { padding: 20px 32px; text-align: center; font-size: 11px; color: #525966; background: #080B12; border-top: 1px solid #151B28; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-adam">ADAM</span><span class="logo-flix">FLIX</span>
      </div>
      <div>
        <span class="badge">Google OAuth 2.0 Verification</span>
      </div>
    </div>
    <div class="content">
      <h1 class="title">Verify Your Gmail Account</h1>
      <p class="subtitle">
        Welcome to AdamFlix Cinema! We detected a new Google Sign-In with your official Gmail account. Enter the 6-digit activation code below to verify your identity and activate unlimited 4K Ultra HD streaming.
      </p>

      <div class="code-box">
        <div class="code-number">${code}</div>
        <div class="code-expiry">Expires in 10 minutes · One-time use</div>
      </div>

      <div class="account-info">
        <div>Registered Account: <strong>${recipientEmail}</strong></div>
        <div>Security Protocol: <strong>Strict Gmail-Only Authorization</strong></div>
      </div>

      <div class="security-notice">
        If you did not request this verification code, please ignore this email. Never disclose this one-time password to any third party.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} AdamFlix.tv · Protected by AdamFlix Security Gateway
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends a 6-digit verification code to the user's registered Gmail address
 */
export async function sendOtpEmail(toEmail: string, code: string): Promise<EmailDispatchRecord> {
  const cleanEmail = toEmail.trim().toLowerCase();
  const subject = `${code} is your AdamFlix account verification code`;
  const htmlContent = generateVerificationEmailHtml(code, cleanEmail);

  let deliveryStatus: 'delivered' | 'simulated' = 'simulated';

  try {
    const mailClient = await getTransporter();
    const info = await mailClient.sendMail({
      from: '"AdamFlix Security" <security@adamflix.tv>',
      to: cleanEmail,
      subject,
      text: `Your AdamFlix verification code is: ${code}. This code expires in 10 minutes.`,
      html: htmlContent
    });

    console.log(`[EmailService] OTP ${code} dispatched to ${cleanEmail}. MessageId:`, info.messageId);
    deliveryStatus = 'delivered';
  } catch (err) {
    console.error(`[EmailService] SMTP delivery fallback for ${cleanEmail}:`, err);
    deliveryStatus = 'simulated';
  }

  const record: EmailDispatchRecord = {
    id: `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    to: cleanEmail,
    subject,
    code,
    sentAt: new Date().toISOString(),
    status: deliveryStatus,
    htmlPreview: htmlContent
  };

  // Keep last 30 dispatched emails in audit log
  dispatchedEmailLog.unshift(record);
  if (dispatchedEmailLog.length > 30) {
    dispatchedEmailLog.pop();
  }

  return record;
}

/**
 * Retrieves the latest email sent to an email address (for UI inspection / verification testing)
 */
export function getLatestEmailForAddress(email: string): EmailDispatchRecord | undefined {
  const cleanEmail = email.trim().toLowerCase();
  return dispatchedEmailLog.find(r => r.to === cleanEmail);
}

/**
 * Returns recent dispatched email logs
 */
export function getEmailAuditLog(): EmailDispatchRecord[] {
  return [...dispatchedEmailLog];
}
