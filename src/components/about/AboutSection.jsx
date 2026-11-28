import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Mic,
  Flame,
  HeartPulse,
  ShoppingBag,
  CalendarRange,
  Bot,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PwaInstallPrompt } from '../common/PwaInstallPrompt';
import { FitArcLogo } from '../common/FitArcLogo';

const FEATURE_MATRIX = [
  { feature: 'Full 30-Minute Guided HIIT Cardio Arena', fitarc: true, healthify: false, leap: true },
  { feature: 'Choose Workout by Body Part x Exact Duration (7–30m)', fitarc: true, healthify: false, leap: true },
  { feature: 'HD Video Motion Demos + Web Speech Voice Coach', fitarc: true, healthify: false, leap: true },
  { feature: '30-Day Challenge Calendar & Streak Badges', fitarc: true, healthify: false, leap: true },
  { feature: 'Visual Exercise Demonstrations & Muscle Focus Guides', fitarc: true, healthify: false, leap: false },
  { feature: 'Indian + Global Gram-Measured Meal & Macro Diary', fitarc: true, healthify: true, leap: false },
  { feature: 'AI Photo Meal Scanner & Meal Slot Logging', fitarc: true, healthify: true, leap: false },
  { feature: 'Water Intake, Step Counter, Sleep & 16:8 Fasting', fitarc: true, healthify: true, leap: false },
  { feature: 'RIA-Style Interactive AI Nutrition & Fat-Loss Coach', fitarc: true, healthify: true, leap: false },
  { feature: 'Daily Metabolic Health Score (0–100) & Weight Chart', fitarc: true, healthify: true, leap: false },
  { feature: 'User Custom Plan Architect (Goal + Multi Exercise Types)', fitarc: true, healthify: false, leap: false },
  { feature: 'On-Demand AI Exercise Synthesizer', fitarc: true, healthify: false, leap: false },
  { feature: 'Trustified™ Lab-Verified Supplement Shop Magazine', fitarc: true, healthify: false, leap: false },
  { feature: 'iOS & Android Installable PWA + ₹99 Starter Plans', fitarc: true, healthify: false, leap: false },
];

export function AboutSection() {
  const {
    siteSettings,
    hasPaidPlan,
    setActiveTab,
    setFitnessSubTab,
    setIsPlanModalOpen,
    setIsCustomPlanModalOpen,
  } = useApp();

  const brand = siteSettings?.brandName || 'FITARC';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* Editorial Mission Hero */}
      <section className="p-6 sm:p-10 rounded-3xl glass-panel-glow border border-amber-500/25 relative overflow-hidden space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FitArcLogo
            brandName={brand}
            tagline={siteSettings?.tagline}
            logoStyle={siteSettings?.logoStyle}
            customLogoUrl={siteSettings?.customLogoUrl}
            showTagline
            size="lg"
          />
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            Production Release · Plans Starting ₹99
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            One Precision Platform Replacing Separate Workout, Diet &amp; Supplement Apps
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {siteSettings?.footerDescription ||
              'FitArc combines Leap Fitness-style guided body-part workouts & 30-minute HIIT cardio with real-time voice coaching, HealthifyMe-grade Indian/global macro, water, step, sleep & fasting telemetry, AI exercise & custom plan builders, and a Trustified™ supplement magazine store.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {!hasPaidPlan && (
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(true)}
              className="gold-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-gold-glow-sm"
            >
              Plans Starting ₹99/mo &amp; Yearly
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsCustomPlanModalOpen?.(true)}
            className="gold-btn-outline px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            <span>Create Custom Goal Plan</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFitnessSubTab?.('hiit_leap');
              setActiveTab('fitness');
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-xs sm:text-sm font-bold text-white"
          >
            Explore 30m HIIT &amp; Body Parts →
          </button>
        </div>
      </section>

      {/* Core Technology & Product Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            icon: Flame,
            color: 'text-rose-400',
            title: '30-Min HIIT & Body-Part Workouts',
            desc: 'Choose Abs, Chest, Arms, Back, Legs, Yoga, or full 30-Min HIIT Cardio for 7, 15, 20, or 30 minutes with Leap-inspired challenge streaks & knee-safe low-impact swaps.',
          },
          {
            icon: Mic,
            color: 'text-amber-400',
            title: 'HD Motion Demos & Voice Coach',
            desc: 'Real-time Web Speech API audio coaching reads form tips, countdowns, halfway encouragement, and rest cues so you can train hands-free.',
          },
          {
            icon: HeartPulse,
            color: 'text-emerald-400',
            title: 'Complete HealthifyMe Wellness Parity',
            desc: 'Meal slot diary (Breakfast/Snack/Lunch/Dinner), AI Photo Meal Scanner, Water glass tracker, Step NEAT counter, Sleep recovery, 16:8 fasting & RIA-style AI Coach.',
          },
          {
            icon: CalendarRange,
            color: 'text-sky-400',
            title: 'AI Exercises & Custom Plan Builder',
            desc: 'Synthesize tailored exercises on demand or assemble a 14/30/60/90-day personal plan combining multiple exercise types matched to your exact calorie & protein targets.',
          },
          {
            icon: ShoppingBag,
            color: 'text-teal-400',
            title: 'Trustified™ Magazine Storefront (/shop)',
            desc: 'Dedicated shop page inspecting blind lab pass status, protein per serving, sugar, carbs & fat right under every product card with 1-tap Amazon.in & Flipkart redirects.',
          },
          {
            icon: Cpu,
            color: 'text-purple-400',
            title: 'Installable iOS & Android PWA',
            desc: 'Offline Service Worker caching, home-screen app icons (`180px`, `192px`, `512px`), safe-area mobile dock, and SEO-configurable routes.',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="p-5 rounded-3xl glass-card border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h2 className="text-base font-black text-white">{card.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Direct Comparison: FitArc vs HealthifyMe vs Leap Fitness */}
      <section className="p-5 sm:p-7 rounded-3xl glass-panel border border-amber-500/20 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Transparent Ecosystem Comparison
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            {brand} vs. HealthifyMe vs. Leap Fitness Apps
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-3 pr-4">Capability</th>
                <th className="py-3 px-4 text-amber-300 font-black">{brand}</th>
                <th className="py-3 px-4">HealthifyMe Style</th>
                <th className="py-3 px-4">Leap Fitness Apps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {FEATURE_MATRIX.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-semibold text-slate-200">{row.feature}</td>
                  <td className="py-3 px-4">
                    {row.fitarc ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.healthify ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.leap ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile PWA Install Strip */}
      <PwaInstallPrompt />

      {/* Safety & Privacy Note */}
      <section className="p-5 rounded-3xl bg-black/50 border border-white/10 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Health &amp; Fitness Guidance Disclaimer:</strong> Workout routines, calorie estimates, macros, and voice cues in {brand} are designed for educational fitness coaching. Consult a healthcare specialist before starting intense workouts if you have existing medical conditions.
        </p>
      </section>
    </div>
  );
}
export default AboutSection;
