import React, { useState } from 'react';
import { Logo } from './Logo';
import { useApp, AUTHORIZED_ADMIN_EMAIL } from '../../context/AppContext';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, currentUser } = useApp();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'cookie' | null>(null);

  const isAuthorizedAdmin = Boolean(
    currentUser && 
    currentUser.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  return (
    <footer className="w-full bg-[#080B12] border-t border-[#151B28] text-[#A7AFBF] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#151B28]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <button 
              onClick={() => navigateTo('/')}
              className="text-left focus:outline-none cursor-pointer w-fit"
            >
              <Logo showDomain={true} size="md" />
            </button>
            <p className="text-xs sm:text-sm text-[#A7AFBF] leading-relaxed max-w-sm">
              AdamFlix.tv is a premier cinematic entertainment destination delivering 
              4K Ultra HD blockbusters, critically acclaimed television series, and 
              groundbreaking indie releases directly to your screens.
            </p>
            <div className="text-xs text-[#A7AFBF]/70">
              High-Definition Streaming · Zero Distractions · Global Access
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigateTo('/')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/movies')} className="hover:text-white transition-colors cursor-pointer">
                  Movies
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/tv-shows')} className="hover:text-white transition-colors cursor-pointer">
                  TV Shows
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/genres')} className="hover:text-white transition-colors cursor-pointer">
                  Genres
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/movies', { filter: 'trending' })} className="hover:text-white transition-colors cursor-pointer">
                  Trending
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/movies', { filter: 'new' })} className="hover:text-white transition-colors cursor-pointer">
                  New Releases
                </button>
              </li>
            </ul>
          </div>

          {/* Genres Shortcut */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Popular Genres
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigateTo('/genre/Action', { genre: 'Action' })} className="hover:text-white transition-colors cursor-pointer">
                  Action
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/genre/Science Fiction', { genre: 'Science Fiction' })} className="hover:text-white transition-colors cursor-pointer">
                  Science Fiction
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/genre/Adventure', { genre: 'Adventure' })} className="hover:text-white transition-colors cursor-pointer">
                  Adventure
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/genre/Drama', { genre: 'Drama' })} className="hover:text-white transition-colors cursor-pointer">
                  Drama
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/genre/Horror', { genre: 'Horror' })} className="hover:text-white transition-colors cursor-pointer">
                  Horror
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/genre/Comedy', { genre: 'Comedy' })} className="hover:text-white transition-colors cursor-pointer">
                  Comedy
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setLegalModal('cookie')} className="hover:text-white transition-colors cursor-pointer">
                  Cookie Policy
                </button>
              </li>
              {isAuthorizedAdmin && (
                <li>
                  <button onClick={() => navigateTo('/admin')} className="text-[#7C5CFF] hover:underline transition-colors cursor-pointer">
                    Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Channels */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-[#A7AFBF]">
            © 2026 <span className="text-white font-medium">AdamFlix.tv</span>. All Rights Reserved.
          </div>

          {/* Social Channels */}
          <div className="flex items-center gap-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#00D4FF] transition-colors"
              aria-label="AdamFlix on Facebook"
            >
              Facebook
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#00D4FF] transition-colors"
              aria-label="AdamFlix on Instagram"
            >
              Instagram
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#00D4FF] transition-colors"
              aria-label="AdamFlix on YouTube"
            >
              YouTube
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[#00D4FF] transition-colors"
              aria-label="AdamFlix on X"
            >
              X
            </a>
          </div>
        </div>
      </div>

      {/* Legal Modal Popup */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#101521] border border-[#1E2638] rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-5 right-5 text-[#A7AFBF] hover:text-white p-1 rounded-lg hover:bg-[#151B28] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {legalModal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Privacy Policy</h3>
                <p className="text-sm text-[#A7AFBF] leading-relaxed mb-4">
                  At AdamFlix.tv, your privacy is our foundational commitment. This policy describes how we collect, protect, and process user information when navigating our streaming platform.
                </p>
                <h4 className="text-sm font-semibold text-white mb-2">1. Data We Collect</h4>
                <p className="text-xs text-[#A7AFBF] leading-relaxed mb-4">
                  We gather minimal viewing telemetry, playback timestamps for continuous resumption, and account identifiers strictly necessary to deliver personalized high-definition streaming.
                </p>
                <h4 className="text-sm font-semibold text-white mb-2">2. Respect for User Data</h4>
                <p className="text-xs text-[#A7AFBF] leading-relaxed">
                  AdamFlix does not sell or distribute personal data to third-party brokers. All streaming telemetry is encrypted in transit and at rest.
                </p>
              </div>
            )}

            {legalModal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Terms of Service</h3>
                <p className="text-sm text-[#A7AFBF] leading-relaxed mb-4">
                  By accessing AdamFlix.tv, you agree to comply with our commercial terms and acceptable streaming policies.
                </p>
                <h4 className="text-sm font-semibold text-white mb-2">1. Authorized Viewing</h4>
                <p className="text-xs text-[#A7AFBF] leading-relaxed mb-4">
                  Streams provided on AdamFlix are licensed or open-standard educational and demo media. Unauthorized ripping, re-broadcasting, or scraping is strictly prohibited.
                </p>
                <h4 className="text-sm font-semibold text-white mb-2">2. Account Responsibility</h4>
                <p className="text-xs text-[#A7AFBF] leading-relaxed">
                  Users are responsible for safeguarding login credentials and viewing preferences within their account dashboards.
                </p>
              </div>
            )}

            {legalModal === 'cookie' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Cookie Policy</h3>
                <p className="text-sm text-[#A7AFBF] leading-relaxed mb-4">
                  AdamFlix uses first-party essential cookies and local browser storage to remember your audio preferences, subtitle configurations, and playback progress across sessions.
                </p>
                <p className="text-xs text-[#A7AFBF] leading-relaxed">
                  No intrusive third-party cross-site trackers are loaded. You may clear your cached storage at any time via your Account Settings.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#1E2638] flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 rounded-xl bg-[#7C5CFF] text-white text-xs font-semibold hover:brightness-110 cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
