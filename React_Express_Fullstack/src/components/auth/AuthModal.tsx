import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp, AUTHORIZED_ADMIN_EMAIL } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { isStrictGmail } from '../../services/authService';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal, 
    initiateGoogleLogin, 
    showToast 
  } = useApp();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  // Real-time email validation
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val) {
      setDomainError(null);
      return;
    }
    if (val.includes('@')) {
      const parts = val.split('@');
      if (parts[1] && parts[1].toLowerCase() !== 'gmail.com') {
        setDomainError(`Domain "@${parts[1]}" is blocked. Only official @gmail.com accounts are permitted.`);
      } else {
        setDomainError(null);
      }
    } else {
      setDomainError(null);
    }
  };

  const handleGoogleSubmit = async (customEmail?: string, customName?: string) => {
    const targetEmail = (customEmail || email).trim().toLowerCase();
    const targetName = (customName || name).trim();

    if (!targetEmail) {
      showToast('Please enter your @gmail.com address.');
      return;
    }

    if (!isStrictGmail(targetEmail)) {
      setDomainError('Access Blocked: Only verified @gmail.com accounts are permitted to join AdamFlix.');
      showToast('Blocked: Only @gmail.com accounts are authorized.');
      return;
    }

    setDomainError(null);
    setIsLoading(true);

    const result = await initiateGoogleLogin(targetEmail, targetName);
    setIsLoading(false);

    if (!result.success) {
      setDomainError(result.error || 'Failed to authenticate with Google account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0E1424] border border-[#1E2638] rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Top ambient highlight line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#7C5CFF]" />

        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFF]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-[#A7AFBF] hover:text-white p-1 rounded-xl hover:bg-[#151B28] cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Heading */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF] text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Official Google OAuth 2.0</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            {authModalMode === 'signin' ? 'Sign In to AdamFlix' : 'Join AdamFlix Cinema'}
          </h2>
          <p className="text-xs text-[#A7AFBF] mt-1 max-w-sm mx-auto">
            Access unlimited 4K Ultra HD streaming, your personal Watchlist, and cinema originals.
          </p>
        </div>

        {/* Strict Security Badge */}
        <div className="mb-5 bg-[#080B12] border border-[#1F293D] rounded-2xl p-3 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#A7AFBF] leading-tight">
            <span className="text-white font-semibold block mb-0.5">Strict Gmail-Only Access Protocol</span>
            Registration and access are strictly restricted to official <strong className="text-[#00D4FF]">@gmail.com</strong> accounts. All third-party email domains are blocked.
          </div>
        </div>

        {/* 1. Official Google OAuth Primary Action Button */}
        <button
          type="button"
          onClick={() => handleGoogleSubmit()}
          disabled={isLoading || (email.length > 0 && !isStrictGmail(email))}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer mb-5 border border-gray-200"
        >
          {/* Official Google G SVG */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLoading ? 'Connecting to Google OAuth...' : 'Continue with Google Account'}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#1E2638] w-full" />
          <span className="bg-[#0E1424] px-3 text-[11px] text-[#A7AFBF] font-medium uppercase tracking-wider">
            Or Specify Gmail Address
          </span>
          <div className="border-t border-[#1E2638] w-full" />
        </div>

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); handleGoogleSubmit(); }} className="space-y-4">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#A7AFBF] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Adam Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#151B28] text-white text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                />
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#A7AFBF]" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A7AFBF] mb-1.5">
              Google Account Email (<span className="text-[#00D4FF]">@gmail.com</span> only)
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full bg-[#151B28] text-white text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border transition-all focus:outline-none ${
                  domainError
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-[#1E2638] focus:border-[#00D4FF]'
                }`}
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A7AFBF]" />
            </div>

            {/* Error Message if non-Gmail */}
            {domainError && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 py-1.5 px-3 rounded-lg animate-shake">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{domainError}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (email.length > 0 && !isStrictGmail(email))}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer ${
              !domainError && isStrictGmail(email)
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:brightness-110 active:scale-98 text-white shadow-[#7C5CFF]/30'
                : 'bg-[#151B28] text-[#525966] border border-[#1E2638] cursor-not-allowed'
            }`}
          >
            <span>{isLoading ? 'Verifying...' : authModalMode === 'signin' ? 'Proceed with Google Account' : 'Register via Google & Send Code'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Profiles for Easy Evaluation */}
        <div className="mt-5 pt-4 border-t border-[#1E2638] space-y-2">
          <div className="text-[10px] font-semibold text-[#A7AFBF] text-center uppercase tracking-wider">
            Quick Authorized Profiles
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Admin Profile */}
            <button
              onClick={() => handleGoogleSubmit(AUTHORIZED_ADMIN_EMAIL, 'Souhaimat (Administrator)')}
              type="button"
              className="py-2 px-3 rounded-xl bg-[#151B28] border border-[#7C5CFF]/40 hover:bg-[#7C5CFF]/20 text-[11px] font-semibold text-[#7C5CFF] transition-all cursor-pointer flex items-center gap-2 text-left"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Admin Account</span>
                <span className="text-[9px] text-[#A7AFBF] font-mono truncate">{AUTHORIZED_ADMIN_EMAIL}</span>
              </div>
            </button>

            {/* Test New User (Triggers 6-Digit OTP Email) */}
            <button
              onClick={() => handleGoogleSubmit('newviewer@gmail.com', 'Sarah Viewer')}
              type="button"
              className="py-2 px-3 rounded-xl bg-[#151B28] border border-[#00D4FF]/40 hover:bg-[#00D4FF]/20 text-[11px] font-semibold text-[#00D4FF] transition-all cursor-pointer flex items-center gap-2 text-left"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Test New Account</span>
                <span className="text-[9px] text-[#A7AFBF] font-mono">Triggers 6-Digit OTP</span>
              </div>
            </button>
          </div>
        </div>

        {/* Switch Mode Footer */}
        <div className="mt-4 text-center text-xs text-[#A7AFBF]">
          {authModalMode === 'signin' ? (
            <div>
              New to AdamFlix?{' '}
              <button
                onClick={() => openAuthModal('signup')}
                className="text-[#00D4FF] font-semibold hover:underline cursor-pointer"
              >
                Create Google Account Access
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => openAuthModal('signin')}
                className="text-[#00D4FF] font-semibold hover:underline cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
