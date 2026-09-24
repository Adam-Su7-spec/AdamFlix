import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { verifyOtpCode, resendOtpCode, fetchDispatchedEmail } from '../../services/authService';
import { EmailDispatchRecord } from '../../types';

export const AccountActivationModal: React.FC = () => {
  const { 
    otpVerificationState, 
    completeOtpVerification, 
    cancelOtpVerification, 
    showToast 
  } = useApp();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes
  const [showEmailInspector, setShowEmailInspector] = useState(false);
  const [dispatchedRecord, setDispatchedRecord] = useState<EmailDispatchRecord | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (otpVerificationState.isPending) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);

      // Fetch dispatched email record for inspection preview
      fetchDispatchedEmail(otpVerificationState.email).then(rec => {
        if (rec) setDispatchedRecord(rec);
      });
    }
  }, [otpVerificationState.isPending, otpVerificationState.email]);

  // Countdown timer for code expiry
  useEffect(() => {
    if (!otpVerificationState.isPending) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpVerificationState.isPending]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!otpVerificationState.isPending) {
    return null;
  }

  const formatExpiryTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    const cleaned = value.replace(/\D/g, ''); // numbers only

    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Single digit input
    const char = cleaned.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);

    // Auto focus next box
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    const completeCode = next.join('');
    if (completeCode.length === 6) {
      triggerVerification(completeCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);

    const targetFocus = Math.min(pasted.length, 5);
    inputRefs.current[targetFocus]?.focus();

    if (pasted.length === 6) {
      triggerVerification(pasted);
    }
  };

  const triggerVerification = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the activation code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    const result = await verifyOtpCode({
      email: otpVerificationState.email,
      code,
      tempSessionId: otpVerificationState.tempSessionId
    });

    setIsVerifying(false);

    if (result.success && result.user) {
      showToast(`Account successfully verified! Welcome to AdamFlix.`);
      completeOtpVerification(result.user);
    } else {
      setError(result.message || 'Invalid activation code. Please check your Gmail.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    const result = await resendOtpCode(otpVerificationState.email);
    setIsResending(false);

    if (result.success) {
      setResendCooldown(30);
      setSecondsRemaining(600);
      setDigits(['', '', '', '', '', '']);
      showToast(`A fresh 6-digit code has been dispatched to ${otpVerificationState.email}`);
      // Refresh inspector
      fetchDispatchedEmail(otpVerificationState.email).then(rec => {
        if (rec) setDispatchedRecord(rec);
      });
      inputRefs.current[0]?.focus();
    } else {
      setError(result.message || 'Unable to resend code right now.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Cinematic security glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C5CFF]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#0E1424] border border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden text-center">
        {/* Top ambient highlight line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#7C5CFF]" />

        {/* Security Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 to-[#00D4FF]/20 border border-[#7C5CFF]/40 flex items-center justify-center text-[#7C5CFF] mb-5 shadow-lg shadow-[#7C5CFF]/15">
          <ShieldCheck className="w-8 h-8 text-[#00D4FF] animate-pulse" />
        </div>

        {/* Security Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF] text-[11px] font-mono font-bold tracking-wider uppercase mb-3">
          <Lock className="w-3 h-3 text-[#00D4FF]" />
          <span>Strict Gmail Security Gateway</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Verify Your Gmail Account
        </h2>

        <p className="text-xs sm:text-sm text-[#A7AFBF] leading-relaxed mb-5 max-w-md mx-auto">
          To maintain strict platform security, we have dispatched a temporary 6-digit verification code to your official Google account:
        </p>

        {/* Recipient Email Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151B28] border border-[#1E2638] text-white text-xs sm:text-sm font-semibold mb-6">
          <Mail className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-mono text-[#00D4FF]">{otpVerificationState.email}</span>
        </div>

        {/* 6 Digit Input Boxes */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              disabled={isVerifying}
              className={`w-11 sm:w-13 h-14 sm:h-16 text-center text-2xl font-black font-mono rounded-xl border bg-[#080B12] text-white transition-all focus:outline-none ${
                error
                  ? 'border-rose-500/80 shadow-lg shadow-rose-950/40 text-rose-300'
                  : digit
                    ? 'border-[#7C5CFF] shadow-lg shadow-[#7C5CFF]/25 ring-2 ring-[#7C5CFF]/30 text-[#00D4FF]'
                    : 'border-[#1E2638] hover:border-[#2B354C] focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium mb-4 bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-xl animate-shake">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Timer & Resend info */}
        <div className="flex items-center justify-between text-xs text-[#A7AFBF] mb-6 px-2">
          <span>
            Code expires in:{' '}
            <strong className="font-mono text-white">
              {formatExpiryTime(secondsRemaining)}
            </strong>
          </span>

          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className={`font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              resendCooldown > 0 || isResending
                ? 'text-[#525966] cursor-not-allowed'
                : 'text-[#00D4FF] hover:underline'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </span>
          </button>
        </div>

        {/* Submit Verification Button */}
        <button
          onClick={() => triggerVerification()}
          disabled={isVerifying || digits.join('').length !== 6}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            digits.join('').length === 6 && !isVerifying
              ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:brightness-110 active:scale-98 text-white shadow-[#7C5CFF]/30 cursor-pointer'
              : 'bg-[#151B28] text-[#525966] cursor-not-allowed border border-[#1E2638]'
          }`}
        >
          {isVerifying ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-white" />
              <span>Verifying Activation Code...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Activate Account & Start Streaming</span>
            </>
          )}
        </button>

        {/* Quick Helper / Dispatched Mail Inspector for Test Verification */}
        <div className="mt-5 pt-4 border-t border-[#1E2638] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEmailInspector(!showEmailInspector)}
              className="text-xs text-[#7C5CFF] hover:text-[#9b80ff] flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              {showEmailInspector ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showEmailInspector ? 'Hide Dispatched Mail' : 'Inspect Activation Mail (Security Log)'}</span>
            </button>

            <button
              type="button"
              onClick={cancelOtpVerification}
              className="text-xs text-[#A7AFBF] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Change Account</span>
            </button>
          </div>

          {/* Email Inspector Box */}
          {showEmailInspector && (
            <div className="mt-2 text-left bg-[#080B12] border border-[#1E2638] rounded-xl p-4 text-xs animate-fadeIn space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E2638] pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#00D4FF]" />
                  Dispatched Email Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SMTP Ready
                </span>
              </div>

              <div className="text-[11px] text-[#A7AFBF] space-y-1">
                <div>Recipient: <span className="text-white font-mono">{otpVerificationState.email}</span></div>
                <div>Subject: <span className="text-white font-medium">Your AdamFlix Security Verification Code</span></div>
                <div>Status: <span className="text-emerald-400 font-semibold">Instant Dispatch Completed</span></div>
              </div>

              {/* Quick Fill Button */}
              {otpVerificationState.devOtpCode && (
                <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between">
                  <span className="text-[11px] text-[#A7AFBF]">Dispatched Code:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-[#00D4FF] tracking-widest bg-[#151B28] px-2 py-0.5 rounded border border-[#1E2638]">
                      {otpVerificationState.devOtpCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const code = otpVerificationState.devOtpCode || '';
                        setDigits(code.split(''));
                        triggerVerification(code);
                      }}
                      className="text-[11px] font-semibold text-white bg-[#7C5CFF] hover:bg-[#6846f5] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Fill &amp; Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
