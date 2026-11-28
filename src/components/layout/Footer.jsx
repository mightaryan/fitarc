import React from 'react';
import { Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FitArcLogo } from '../common/FitArcLogo';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

export function Footer() {
  const {
    setActiveTab,
    setFitnessSubTab,
    setIsWeightModalOpen,
    setIsPlanModalOpen,
    openAuthModal,
    siteSettings,
    hasPaidPlan,
    language,
    setLanguage,
    t,
  } = useApp();

  const socialLinks = siteSettings?.socialLinks || {
    instagram: 'https://www.instagram.com/',
    linkedin: 'https://www.linkedin.com/',
    youtube: 'https://www.youtube.com/',
  };

  const navigateAndScrollTop = (tab, subTab = null) => {
    setActiveTab(tab);
    if (subTab && setFitnessSubTab) setFitnessSubTab(subTab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#07080b] mt-10 pt-8 pb-24 md:pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Top Row: Compact Brand, Essential Navigation Links & Social Icon Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-white/10">
          {/* Brand Logo */}
          <div
            onClick={() => navigateAndScrollTop('home')}
            className="cursor-pointer inline-flex flex-col gap-1.5 self-start"
          >
            <FitArcLogo
              brandName={siteSettings?.brandName || 'FITARC'}
              tagline={siteSettings?.tagline || 'AI Fitness · 30m HIIT · Verified Nutrition'}
              logoStyle={siteSettings?.logoStyle || 'kinetic_arc'}
              customLogoUrl={siteSettings?.customLogoUrl || ''}
              size="sm"
            />
            <p className="hidden sm:block text-[11px] text-slate-500 max-w-xs line-clamp-1">
              {siteSettings?.footerDescription || siteSettings?.tagline}
            </p>
          </div>

          {/* Essential Concise Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
            <button
              type="button"
              onClick={() => navigateAndScrollTop('fitness')}
              className="hover:text-amber-300 transition"
            >
              {t?.('nav.fitness') || 'Fitness'}
            </button>
            <button
              type="button"
              onClick={() => navigateAndScrollTop('food')}
              className="hover:text-amber-300 transition"
            >
              {t?.('nav.food') || 'Food'}
            </button>
            {siteSettings?.shopEnabled !== false && (
              <button
                type="button"
                onClick={() => navigateAndScrollTop('shop')}
                className="hover:text-emerald-300 transition"
              >
                {t?.('nav.shop') || 'Shop'}
              </button>
            )}
            {siteSettings?.blogEnabled !== false && (
              <button
                type="button"
                onClick={() => navigateAndScrollTop('blog')}
                className="hover:text-amber-300 transition"
              >
                {t?.('nav.blog') || 'Blog'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsWeightModalOpen(true)}
              className="hover:text-amber-300 transition"
            >
              {t?.('nav.weight') || 'Weight'}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('support')}
              className="hover:text-amber-300 transition"
            >
              {t?.('vault.support') || 'Support'}
            </button>
            {!hasPaidPlan && (
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                Plans ₹99+
              </button>
            )}
            <button
              type="button"
              onClick={() => navigateAndScrollTop('about')}
              className="hover:text-amber-300 transition"
            >
              {t?.('nav.about') || 'About'}
            </button>
          </nav>

          {/* Compact Social Icons (Instagram, LinkedIn, YouTube) */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 hover:border-pink-500/50 hover:text-pink-300 flex items-center justify-center transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-500/50 hover:text-sky-300 flex items-center justify-center transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 hover:border-rose-500/50 hover:text-rose-300 flex items-center justify-center transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Copyright, About Links & Desktop Language Switcher Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {siteSettings?.brandName || 'FITARC'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {/* Desktop Language Switcher (mobile changes language inside Vault) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10">
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                id="desktop-footer-lang"
                value={language}
                onChange={(e) => setLanguage?.(e.target.value)}
                aria-label="Select App Language"
                className="bg-transparent text-amber-300 font-semibold text-xs outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-obsidian-950 text-white">
                    {lang.native}{lang.native !== lang.label ? ` (${lang.label})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => navigateAndScrollTop('about')}
              className="text-amber-400 hover:text-amber-300 font-semibold hover:underline"
            >
              {t?.('footer.aboutLink') || `About ${siteSettings?.brandName || 'FITARC'}`}
            </button>
            <span className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => navigateAndScrollTop('about')}
              className="text-slate-400 hover:text-amber-300"
            >
              {t?.('footer.comparisonLink') || 'vs HealthifyMe & Leap'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
