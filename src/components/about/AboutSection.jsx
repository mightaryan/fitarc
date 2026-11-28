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
  AlertTriangle,
  Compass,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PwaInstallPrompt } from '../common/PwaInstallPrompt';
import { FitArcLogo } from '../common/FitArcLogo';

const FEATURE_MATRIX = [
  { feature: 'Full 30-Minute Guided HIIT Cardio Arena', fitarc: true, healthify: false, leap: true },
  { feature: 'Choose Workout by Body Part x Exact Duration (7–30m)', fitarc: true, healthify: false, leap: true },
  { feature: 'Animated Motion Demos + Web Speech Voice Coach', fitarc: true, healthify: false, leap: true },
  { feature: '30-Day Challenge Calendar & Streak Badges', fitarc: true, healthify: false, leap: true },
  { feature: '200+ Health Blog Guides (Diabetes, BP, Heart, Home Fitness)', fitarc: true, healthify: false, leap: false },
  { feature: 'Indian + Global Gram-Measured Meal & Macro Diary', fitarc: true, healthify: true, leap: false },
  { feature: 'AI Photo Meal Scanner & Meal Slot Logging', fitarc: true, healthify: true, leap: false },
  { feature: 'Water Intake, Step Counter, Sleep & 16:8 Fasting', fitarc: true, healthify: true, leap: false },
  { feature: 'Interactive AI Nutrition & Fat-Loss Coach', fitarc: true, healthify: true, leap: false },
  { feature: 'Daily Metabolic Health Score (0–100) & Weight Chart', fitarc: true, healthify: true, leap: false },
  { feature: 'User Custom Plan Architect (Goal + Multi Exercise Types)', fitarc: true, healthify: false, leap: false },
  { feature: 'On-Demand AI Exercise Synthesizer', fitarc: true, healthify: false, leap: false },
  { feature: 'Trustified™ Lab-Verified Supplement Shop Magazine', fitarc: true, healthify: false, leap: false },
  { feature: 'iOS & Android Installable PWA + ₹99 Starter Plans', fitarc: true, healthify: false, leap: false },
];

const PROBLEMS_SOLVED = [
  {
    title: 'Replacing 4 Separate Apps',
    desc: 'People usually juggle one app for timer workouts, another for diet/water tracking, a search engine for diabetes/BP food advice, and separate shopping sites. FitArc unites everything into one fast workspace.',
  },
  {
    title: 'Removing Beginner Confusion & Technical Jargon',
    desc: 'Many fitness apps overwhelm newcomers with intimidating anatomical math or complex jargon. FitArc shows crystal-clear step-by-step movements, friendly breathing tips, and hands-free voice guidance.',
  },
  {
    title: 'No Unfair Paywalls Before You Build a Habit',
    desc: 'Instead of locking everything on Day 1 behind expensive annual subscriptions, all Beginner movements, hydration/meal tracking, and health guides stay open free—with optional ₹99/mo+ upgrades.',
  },
  {
    title: 'Fixing Supplement Guesswork',
    desc: 'Athletes rarely know which whey proteins, mueslis, or creatine tubs actually pass independent purity testing. Our /shop index pairs Trustified™ lab check context directly with macros and buy links.',
  },
];

const WHAT_MAKES_IT_BETTER = [
  {
    title: 'Condition-to-Exercise Connection',
    desc: 'Inside our 200+ Health Blog (/blog), reading about blood sugar, blood pressure, cholesterol, or belly fat doesn’t leave you guessing—every guide includes 1-click recommended exercises ready to preview and start at home.',
  },
  {
    title: 'Zero-Equipment & Knee-Friendly Modes',
    desc: 'Need to train silently in an apartment or protect your knees? Toggle No-Jumping Mode inside 30-Min HIIT and Home Hubs to swap plyometrics for smooth low-impact alternatives automatically.',
  },
  {
    title: 'Multilingual Accessibility Worldwide',
    desc: 'Switch seamlessly between English, Hindi, Arabic (with RTL support), Turkish, Russian, and Spanish directly from your Vault on mobile or Footer on desktop.',
  },
  {
    title: 'Real Indian & Global Nutrition Intelligence',
    desc: 'From dal-chawal, poha, paneer, and roti portions to whey isolates, overnight oats, and quick AI meal photo scanning, daily calorie and sugar goals adjust to how people actually eat.',
  },
];

const BEGINNER_PATH = [
  {
    step: '01 · Start Safe & Free',
    title: 'Begin at Beginner Difficulty',
    desc: 'Sign up securely with your Phone & Email OTP inside Athlete Vault. All Beginner exercises, body-part timers, hydration logs, and food tracking work right out of the box.',
  },
  {
    step: '02 · Train With Voice Cues',
    title: 'Press Play — No Clock Watching',
    desc: 'Pick any body part and duration (7, 15, 20, or 30 minutes). Visual GIF form demos plus Web Speech voice prompts guide every set, rest interval, and form correction.',
  },
  {
    step: '03 · Eat & Recover Smarter',
    title: 'Follow Food, Steps & Health Guides',
    desc: 'Log water, steps, sleep, and meals in seconds, or explore the /blog articles tailored for blood sugar, heart health, posture, and steady belly-fat reduction.',
  },
  {
    step: '04 · Scale When Ready',
    title: 'Unlock Advanced & Custom Plans from ₹99',
    desc: 'Once consistent, unlock Advanced workouts or customize multi-discipline Monthly/Yearly schedules inside Plans starting at just ₹99/month.',
  },
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
            One Guided Platform for Workouts, Daily Nutrition, Health Education &amp; Verified Supplements
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {siteSettings?.footerDescription ||
              'FitArc combines guided home & body-part workouts with 30-minute voice-coached HIIT, HealthifyMe-grade food, water, step & sleep telemetry, 200+ actionable health blog guides, and Trustified™ certified protein curation.'}
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
          <button
            type="button"
            onClick={() => setActiveTab('blog')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 hover:bg-emerald-500/25 text-xs sm:text-sm font-bold text-emerald-200 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore 200+ Health Guides</span>
          </button>
        </div>
      </section>

      {/* Section A: What Problem FitArc Solves */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> The Problem We Solve
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Why Existing Fitness Apps Leave Beginners Stuck
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROBLEMS_SOLVED.map((item) => (
            <div key={item.title} className="p-5 rounded-3xl bg-obsidian-900 border border-rose-500/20 space-y-2">
              <h3 className="text-sm sm:text-base font-extrabold text-amber-300">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section B: What Makes FitArc Better */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> The FitArc Advantage
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            What Makes {brand} Better Every Single Day
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WHAT_MAKES_IT_BETTER.map((item) => (
            <div key={item.title} className="p-5 rounded-3xl bg-obsidian-900 border border-emerald-500/20 space-y-2">
              <h3 className="text-sm sm:text-base font-extrabold text-emerald-300">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section C: How FitArc Helps Beginners */}
      <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-obsidian-900 to-obsidian-950 border border-amber-500/30 space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
            Built For First-Timers &amp; Home Athletes
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            How {brand} Helps Beginners Succeed Safely
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {BEGINNER_PATH.map((stage) => (
            <div key={stage.step} className="p-4 rounded-2xl bg-black/55 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                {stage.step}
              </span>
              <h3 className="text-sm font-black text-white">{stage.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Technology & Product Features */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          All-In-One Features Inside {brand}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              title: 'Animated Demos & Voice Coach',
              desc: 'Real-time Web Speech API audio coaching reads form tips, countdowns, halfway encouragement, and rest cues so you can train hands-free.',
            },
            {
              icon: HeartPulse,
              color: 'text-emerald-400',
              title: 'Complete HealthifyMe Wellness Parity',
              desc: 'Meal slot diary (Breakfast/Snack/Lunch/Dinner), AI Photo Meal Scanner, Water glass tracker, Step NEAT counter, Sleep recovery, 16:8 fasting & interactive AI Coach.',
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
              title: 'Multilingual PWA & Vault Concierge',
              desc: 'Offline Service Worker caching, 6 languages (English, Hindi, Arabic RTL, Turkish, Russian, Spanish), profile picture sync, and direct Help & Support ticketing.',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="p-5 rounded-3xl glass-card border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="text-base font-black text-white">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
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
          <strong className="text-slate-200">Health &amp; Fitness Guidance Disclaimer:</strong> Workout routines, calorie estimates, health blog educational guides, and voice cues in {brand} support general lifestyle wellness. Consult a qualified physician before making medical changes if you manage diabetes, hypertension, cardiovascular conditions, or acute injuries.
        </p>
      </section>
    </div>
  );
}
export default AboutSection;
