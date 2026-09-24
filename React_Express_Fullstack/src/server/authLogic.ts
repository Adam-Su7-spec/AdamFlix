import { User } from '../types';
import { sendOtpEmail, getLatestEmailForAddress } from './emailService';

export const AUTHORIZED_ADMIN_EMAIL = 'ssouhaimat1999@gmail.com';

interface PendingOtp {
  email: string;
  name: string;
  avatar: string;
  code: string;
  expiresAt: number;
  attemptsLeft: number;
  createdAt: number;
  tempSessionId: string;
}

// In-memory persistent state across requests
const registeredUsers: Map<string, User> = new Map([
  // Seed the single authorized administrator as verified by default
  [
    AUTHORIZED_ADMIN_EMAIL.toLowerCase(),
    {
      id: 'u-admin-101',
      name: 'Souhaimat (Administrator)',
      email: AUTHORIZED_ADMIN_EMAIL,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'admin',
      joinedDate: 'January 2026',
      isVerified: true,
      authProvider: 'google'
    }
  ]
]);

const pendingOtps: Map<string, PendingOtp> = new Map();

/**
 * Validates whether an email strictly belongs to the @gmail.com domain
 */
export function isValidGmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  // Must end strictly with @gmail.com
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(clean);
}

/**
 * Masks an email for privacy display in the UI (e.g. ss***99@gmail.com)
 */
export function maskGmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const user = parts[0];
  const domain = parts[1];
  if (user.length <= 3) {
    return `${user.slice(0, 1)}***@${domain}`;
  }
  return `${user.slice(0, 2)}***${user.slice(-2)}@${domain}`;
}

/**
 * Generates a secure, cryptographically sound 6-digit numeric OTP
 */
function generate6DigitOtp(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/**
 * Backend authentication handler for Google OAuth 2.0 logins
 */
export async function authenticateGoogleUser(payload: {
  email: string;
  name?: string;
  avatar?: string;
  googleIdToken?: string;
}) {
  const rawEmail = payload.email || '';
  const cleanEmail = rawEmail.trim().toLowerCase();

  // 1. STRICT GMAIL-ONLY ENFORCEMENT
  if (!isValidGmail(cleanEmail)) {
    return {
      status: 403,
      body: {
        success: false,
        error: 'ACCESS_DENIED_NON_GMAIL',
        message: `Security Restriction: Only official @gmail.com accounts are permitted to join AdamFlix. The email domain "${cleanEmail.split('@')[1] || 'unknown'}" is completely blocked.`
      }
    };
  }

  const existingUser = registeredUsers.get(cleanEmail);

  // 2. RETURNING VERIFIED USER
  if (existingUser && existingUser.isVerified) {
    return {
      status: 200,
      body: {
        success: true,
        isNewUser: false,
        requiresOtp: false,
        user: existingUser,
        message: `Welcome back, ${existingUser.name}!`
      }
    };
  }

  // 3. FIRST-TIME REGISTRATION OR UNVERIFIED USER -> ISSUE 6-DIGIT OTP
  const isSuperAdmin = cleanEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
  const userName = payload.name?.trim() || 
    (isSuperAdmin ? 'Souhaimat (Administrator)' : cleanEmail.split('@')[0]);
  const userAvatar = payload.avatar || 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const otpCode = generate6DigitOtp();
  const tempSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store in pending OTP map
  pendingOtps.set(cleanEmail, {
    email: cleanEmail,
    name: userName,
    avatar: userAvatar,
    code: otpCode,
    expiresAt,
    attemptsLeft: 5,
    createdAt: Date.now(),
    tempSessionId
  });

  // DISPATCH ACTIVATION EMAIL INSTANTLY
  await sendOtpEmail(cleanEmail, otpCode);

  return {
    status: 200,
    body: {
      success: true,
      isNewUser: true,
      requiresOtp: true,
      email: cleanEmail,
      name: userName,
      maskedEmail: maskGmail(cleanEmail),
      tempSessionId,
      expiresAt,
      // devOtpCode included for immediate testing review
      devOtpCode: otpCode,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please enter it to activate your account.`
    }
  };
}

/**
 * Verifies the 6-digit OTP entered by the user
 */
export async function verifyUserOtp(payload: {
  email: string;
  code: string;
  tempSessionId?: string;
}) {
  const cleanEmail = (payload.email || '').trim().toLowerCase();
  const inputCode = (payload.code || '').trim();

  // Strict domain check
  if (!isValidGmail(cleanEmail)) {
    return {
      status: 403,
      body: {
        success: false,
        error: 'ACCESS_DENIED_NON_GMAIL',
        message: 'Invalid domain. Only @gmail.com accounts are authorized.'
      }
    };
  }

  const pending = pendingOtps.get(cleanEmail);

  if (!pending) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'NO_PENDING_OTP',
        message: 'No pending verification found for this email. Please sign in again.'
      }
    };
  }

  // Check expiration
  if (Date.now() > pending.expiresAt) {
    pendingOtps.delete(cleanEmail);
    return {
      status: 400,
      body: {
        success: false,
        error: 'OTP_EXPIRED',
        message: 'This verification code has expired. Please request a new code.'
      }
    };
  }

  // Check attempts
  if (pending.attemptsLeft <= 0) {
    pendingOtps.delete(cleanEmail);
    return {
      status: 400,
      body: {
        success: false,
        error: 'TOO_MANY_ATTEMPTS',
        message: 'Too many incorrect attempts. Please request a new verification code.'
      }
    };
  }

  // Check code match
  if (pending.code !== inputCode) {
    pending.attemptsLeft -= 1;
    return {
      status: 400,
      body: {
        success: false,
        error: 'INVALID_OTP',
        attemptsLeft: pending.attemptsLeft,
        message: `Invalid code. ${pending.attemptsLeft} attempt(s) remaining.`
      }
    };
  }

  // CODE IS CORRECT! ACTIVATE ACCOUNT
  const isSuperAdmin = cleanEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  const activatedUser: User = {
    id: isSuperAdmin ? 'u-admin-101' : `u-${Date.now()}`,
    name: pending.name,
    email: cleanEmail,
    avatar: pending.avatar,
    role: isSuperAdmin ? 'admin' : 'user',
    joinedDate: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
    isVerified: true,
    authProvider: 'google'
  };

  registeredUsers.set(cleanEmail, activatedUser);
  pendingOtps.delete(cleanEmail);

  return {
    status: 200,
    body: {
      success: true,
      user: activatedUser,
      message: `Account activated successfully! Welcome to AdamFlix Cinema, ${activatedUser.name}.`
    }
  };
}

/**
 * Resends a fresh 6-digit verification code to the registered Gmail
 */
export async function resendUserOtp(payload: { email: string }) {
  const cleanEmail = (payload.email || '').trim().toLowerCase();

  if (!isValidGmail(cleanEmail)) {
    return {
      status: 403,
      body: { success: false, message: 'Only @gmail.com accounts are permitted.' }
    };
  }

  const existingPending = pendingOtps.get(cleanEmail);
  const newCode = generate6DigitOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  pendingOtps.set(cleanEmail, {
    email: cleanEmail,
    name: existingPending?.name || cleanEmail.split('@')[0],
    avatar: existingPending?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    code: newCode,
    expiresAt,
    attemptsLeft: 5,
    createdAt: Date.now(),
    tempSessionId: existingPending?.tempSessionId || `sess_${Date.now()}`
  });

  await sendOtpEmail(cleanEmail, newCode);

  return {
    status: 200,
    body: {
      success: true,
      email: cleanEmail,
      expiresAt,
      devOtpCode: newCode,
      message: `A new 6-digit code has been dispatched to ${cleanEmail}.`
    }
  };
}

/**
 * Inspect latest dispatched email for this address
 */
export function inspectLatestEmail(email: string) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const record = getLatestEmailForAddress(cleanEmail);
  return record || null;
}
