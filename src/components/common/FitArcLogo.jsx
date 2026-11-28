import React, { useState } from 'react';

/**
 * Artistic Customizable Brand Emblem & Editorial Wordmark
 * Supports multiple geometric styles or an Admin-uploaded/linked custom logo image URL.
 */
export function FitArcLogo({
  brandName = 'FITARC',
  tagline = 'Golden Standard Fitness & Nutrition',
  logoStyle = 'kinetic_arc', // 'kinetic_arc' | 'crown_shield' | 'flame_core' | 'minimal_hex' | 'custom_url'
  customLogoUrl = '',
  showTagline = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const cleanName = (brandName || 'FITARC').trim();
  const splitIdx = cleanName.toUpperCase().startsWith('FIT') ? 3 : Math.ceil(cleanName.length / 2);
  const firstPart = cleanName.slice(0, splitIdx);
  const secondPart = cleanName.slice(splitIdx);

  const dims =
    size === 'sm'
      ? { box: 'w-8 h-8 rounded-xl', svg: 22, title: 'text-base', sub: 'text-[8px]' }
      : size === 'lg'
      ? { box: 'w-12 h-12 rounded-2xl', svg: 32, title: 'text-2xl', sub: 'text-[10px]' }
      : { box: 'w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl', svg: 28, title: 'text-lg sm:text-2xl', sub: 'text-[9px]' };

  const renderSvgMark = () => {
    if (logoStyle === 'custom_url' && customLogoUrl && !imgFailed) {
      return (
        <img
          src={customLogoUrl}
          alt={cleanName}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover relative z-10"
        />
      );
    }

    if (logoStyle === 'crown_shield') {
      return (
        <svg width={dims.svg} height={dims.svg} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="relative z-10">
          <path
            d="M24 6L39 12V23C39 32.5 32.5 39.2 24 42C15.5 39.2 9 32.5 9 23V12L24 6Z"
            stroke="#F59E0B"
            strokeWidth="2.8"
            fill="rgba(245,158,11,0.1)"
          />
          <path d="M15 27L19 18L24 23L29 18L33 27H15Z" fill="#FDE047" />
          <circle cx="24" cy="14" r="2.2" fill="#FB923C" />
        </svg>
      );
    }

    if (logoStyle === 'flame_core') {
      return (
        <svg width={dims.svg} height={dims.svg} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="relative z-10">
          <path
            d="M25 7C25 7 35 15 35 25C35 32 30.2 38 24 38C17.8 38 13 32 13 25C13 19.5 16.5 15.5 19.5 12.8C19.2 17 21.2 19.5 23.2 20C21.8 15 24 10 25 7Z"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="rgba(245,158,11,0.18)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="28" r="4" fill="#FEF08A" />
        </svg>
      );
    }

    if (logoStyle === 'minimal_hex') {
      return (
        <svg width={dims.svg} height={dims.svg} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="relative z-10">
          <polygon
            points="24,6 39,15 39,33 24,42 9,33 9,15"
            stroke="#FBBF24"
            strokeWidth="2.8"
            fill="rgba(245,158,11,0.08)"
          />
          <path d="M16 29L24 15L32 29" stroke="#FEF08A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="18" y1="25" x2="30" y2="25" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }

    // Default: kinetic_arc
    return (
      <svg width={dims.svg} height={dims.svg} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="relative z-10">
        <defs>
          <linearGradient id="fitarcGoldGrad" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="fitarcInnerArc" x1="12" y1="36" x2="38" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="19.5" stroke="rgba(245,158,11,0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
        <path
          d="M9 35.5C12.8 22.8 18.2 14.2 24.4 9.5C29.4 13.8 34.4 22.2 38.5 34.5"
          stroke="url(#fitarcGoldGrad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 25.5C20.5 21.8 28.5 21.2 37.5 23.2"
          stroke="url(#fitarcInnerArc)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path d="M24.2 10.5L19.5 35.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="24.4" cy="9.8" r="3" fill="#fef08a" />
        <circle cx="24.4" cy="9.8" r="5.5" fill="#f59e0b" fillOpacity="0.28" />
      </svg>
    );
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <div
        className={`${dims.box} p-[1.5px] bg-gradient-to-br from-amber-300 via-orange-500 to-amber-800 shadow-[0_0_24px_rgba(245,158,11,0.35)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="w-full h-full rounded-[inherit] bg-[#07080c] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(251,191,36,0.18),transparent_65%)]" />
          {renderSvgMark()}
        </div>
      </div>

      <div className="leading-none">
        <div className={`${dims.title} font-black tracking-tight text-white flex items-center`}>
          <span>{firstPart}</span>
          <span className="gold-gradient-text font-black">{secondPart}</span>
          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
        </div>
        {showTagline ? (
          <div className={`${dims.sub} uppercase tracking-[0.18em] text-amber-400/90 font-semibold mt-1`}>
            {tagline}
          </div>
        ) : (
          <div className="text-[8px] uppercase tracking-widest text-amber-400/80 font-bold mt-0.5 block sm:hidden">
            Elite Studio
          </div>
        )}
      </div>
    </div>
  );
}
export default FitArcLogo;
