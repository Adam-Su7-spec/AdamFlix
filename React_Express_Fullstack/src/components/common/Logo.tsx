import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDomain?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showDomain = false }) => {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Original AdamFlix Cinematic Play Symbol */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
        style={{
          width: iconSize + 8,
          height: iconSize + 8,
          background: 'linear-gradient(135deg, #7C5CFF 0%, #3B2896 50%, #00D4FF 100%)',
          boxShadow: '0 0 16px rgba(124, 92, 255, 0.45)'
        }}
      >
        {/* Geometric film reel apertures & play prism */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-md translate-x-0.5"
        >
          <path 
            d="M6 4.5L18.5 12L6 19.5V4.5Z" 
            fill="#FFFFFF" 
          />
          <path 
            d="M6 4.5L13 12L6 19.5" 
            stroke="#00D4FF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-display font-extrabold tracking-tight ${textSize} text-white flex items-center`}>
          <span>Adam</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]">Flix</span>
          {showDomain && (
            <span className="ml-1 text-[11px] font-mono font-medium text-[#00D4FF] bg-[#151B28] px-1.5 py-0.5 rounded border border-[#1E2638]">
              .tv
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
