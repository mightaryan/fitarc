import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  ArrowUpRight,
  Dumbbell,
  Globe,
} from 'lucide-react';
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
    <footer className="w-full border-t border-amber-500/20 bg-gradient-to-b from-[#0a0c10] to-[#050608] backdrop-blur-2xl mt-20 pt-14 pb-28 md:pb-12 text-slate-400 text-xs relative overflow-hidden">
      {/* Subtle Ambient Gold Bottom Bar Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[540px] h-48 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Top 4-Column Executive Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Column 1: Artistic Brand Identity */}
          <div className="space-y-4">
            <div onClick={() => navigateAndScrollTop('home')} className="cursor-pointer group inline-block">
              <FitArcLogo
                brandName={siteSettings?.brandName || 'FITARC'}
                tagline={siteSettings?.tagline || 'Golden Standard Fitness & Nutrition'}
                logoStyle={siteSettings?.logoStyle || 'kinetic_arc'}
                customLogoUrl={siteSettings?.customLogoUrl || ''}
                showTagline
                size="lg"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {siteSettings?.footerDescription ||
                'Biomechanics-first training, Yoga Mat & Stability Ball flows, macro food intelligence, and Trustified™ certified protein curation.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production Telemetry Ready</span>
            </div>
          </div>

          {/* Column 2: Training & Nutrition Protocols */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              Training &amp; Nutrition
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => navigateAndScrollTop('home')}
                  className="hover:text-amber-300 transition flex items-center gap-1"
                >
                  Daily Command Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndScrollTop('fitness', 'yoga')}
                  className="hover:text-amber-300 transition flex items-center gap-1"
                >
                  Yoga Sanctuary (Mat &amp; Stability Ball)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndScrollTop('fitness', 'archive')}
                  className="hover:text-amber-300 transition flex items-center gap-1"
                >
                  3D Gym &amp; Home Exercise Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndScrollTop('food')}
                  className="hover:text-amber-300 transition flex items-center gap-1"
                >
                  Macros, Meal Diary &amp; AI Photo Scan
                </button>
              </li>
              {!hasPaidPlan && (
                <li>
                  <button
                    onClick={() => setIsPlanModalOpen(true)}
                    className="hover:text-amber-300 transition flex items-center gap-1 text-amber-300 font-semibold"
                  >
                    Plans Starting ₹99/mo &amp; Yearly
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Trustified Store & Analytics */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              Shop &amp; Telemetry
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {siteSettings?.shopEnabled !== false && (
                <li>
                  <button
                    onClick={() => navigateAndScrollTop('shop')}
                    className="hover:text-emerald-300 transition flex items-center gap-1.5 text-emerald-200 font-semibold"
                  >
                    <span>Trustified™ Protein &amp; Muesli Magazine</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => navigateAndScrollTop('dashboard')}
                  className="hover:text-amber-300 transition"
                >
                  Overview &amp; Progress Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsWeightModalOpen(true)}
                  className="hover:text-amber-300 transition"
                >
                  Weight &amp; Body Fat Tracker
                </button>
              </li>
              {siteSettings?.leaderboardEnabled !== false && (
                <li>
                  <button
                    onClick={() => openAuthModal('leaderboard')}
                    className="hover:text-amber-300 transition"
                  >
                    Health Points Top 10 Leaderboard
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => navigateAndScrollTop('fitness', 'calisthenics')}
                  className="hover:text-amber-300 transition flex items-center gap-1.5 text-amber-300 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Calisthenics Strength Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndScrollTop('about')}
                  className="hover:text-amber-300 transition flex items-center gap-1.5 text-slate-200 font-bold"
                >
                  <span>About {siteSettings?.brandName || 'FitArc'} &amp; Features Comparison</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Dedicated Social Media Section (Instagram, LinkedIn, YouTube) */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-400">
              Follow {siteSettings?.brandName || 'FitArc'} Socials
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Daily posture cues, lab supplement breakdowns, and athlete transformations across our official channels:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {/* Instagram */}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FitArc on Instagram"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-black/55 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-pink-300 block leading-none">
                      Instagram
                    </span>
                    <span className="text-[10px] text-slate-400">@fitarc.official</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-300 transition" />
              </a>

              {/* LinkedIn */}
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FitArc on LinkedIn"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-black/55 border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/10 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-sky-300 block leading-none">
                      LinkedIn
                    </span>
                    <span className="text-[10px] text-slate-400">FitArc Wellness Tech</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition" />
              </a>

              {/* YouTube */}
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FitArc on YouTube"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-black/55 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-rose-300 block leading-none">
                      YouTube
                    </span>
                    <span className="text-[10px] text-slate-400">Video Exercise Guides</span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-300 transition" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright, About Links, Standards & Desktop Language Switcher Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {siteSettings?.brandName || 'FITARC'}. Fitness, HIIT, Nutrition &amp; Supplement Platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {/* Desktop Language Switcher (mobile switches inside Vault Settings) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/25">
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <label htmlFor="desktop-footer-lang" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t?.('footer.languageLabel') || 'Language'}:
              </label>
              <select
                id="desktop-footer-lang"
                value={language}
                onChange={(e) => setLanguage?.(e.target.value)}
                aria-label="Select App Language"
                className="bg-transparent text-amber-300 font-bold text-xs outline-none cursor-pointer pr-1"
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
              className="text-amber-400 hover:text-amber-300 font-bold underline-offset-4 hover:underline"
            >
              {t?.('footer.aboutLink') || `About ${siteSettings?.brandName || 'FITARC'}`}
            </button>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={() => navigateAndScrollTop('about')}
              className="text-slate-300 hover:text-amber-300 font-semibold"
            >
              {t?.('footer.comparisonLink') || 'Compare vs Healthify & Leap'}
            </button>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400/90 font-semibold">Trustified™ Partner Index</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
