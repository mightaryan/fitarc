import React, { useState, useMemo } from 'react';
import {
  Droplet,
  Footprints,
  Moon,
  Timer,
  HeartPulse,
  Bot,
  Send,
  Plus,
  Minus,
  Sparkles,
  Camera,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

function buildCoachReply(promptText, ctx) {
  const q = (promptText || '').toLowerCase();
  const weight = ctx.user?.currentWeight || 75;
  const heightM = (ctx.user?.height || 180) / 100;
  const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
  const proteinNeed = Math.round(weight * 1.9);
  const proteinRemaining = Math.max(0, proteinNeed - (ctx.totalProtein || 0));
  const waterRemainingMl = Math.max(0, (ctx.wellnessToday?.waterTargetMl || 3500) - (ctx.wellnessToday?.waterMl || 0));

  if (q.includes('protein') || q.includes('meal') || q.includes('diet') || q.includes('eat')) {
    return `At ${weight} kg (BMI ${bmi}), your optimal daily protein target is ~${proteinNeed}g. You still need ${proteinRemaining}g today — add 1 scoop Whey Isolate (27g), 150g grilled paneer/chicken (32g), or a 2-egg + oats bowl.`;
  }
  if (q.includes('water') || q.includes('hydrat')) {
    return `You have logged ${((ctx.wellnessToday?.waterMl || 0) / 1000).toFixed(2)}L today. Sip ${waterRemainingMl}ml more across small 250ml glasses to keep metabolism and fat lipolysis peaked.`;
  }
  if (q.includes('hiit') || q.includes('workout') || q.includes('belly') || q.includes('fat')) {
    return `To accelerate fat loss without muscle loss, pair a 30-Minute HIIT Cardio Voice session (~${Math.round(weight * 4.8)} kcal burn) with ${ctx.wellnessToday?.stepsTarget || 8500} daily steps and stay under ${ctx.sugarLimitGrams || 20}g added sugar.`;
  }
  if (q.includes('plateau') || q.includes('weight')) {
    return `Weight plateaus happen when NEAT steps dip or hidden cooking oils add 300+ kcal. Today you are at ${ctx.wellnessToday?.steps || 0} steps — bump to 9,000 steps, keep sleep near 7.5–8h, and stay strict on measured gram logs.`;
  }
  return `Coach FitArc Summary (${ctx.user?.name?.split(' ')[0] || 'Athlete'}): Health Score ${ctx.healthScore}/100 · Remaining Protein: ${proteinRemaining}g · Hydration left: ${waterRemainingMl}ml · Goal: ${(ctx.user?.goal || 'fat_loss').replace('_', ' ')}. Try a 30-Min HIIT session or log your next meal slot!`;
}

export function HealthifySuite({ compact = false }) {
  const {
    user,
    totalCaloriesConsumed,
    totalCaloriesBurned,
    totalProtein,
    sugarLimitGrams,
    totalWorkoutMinutes,
    wellnessToday,
    addWaterIntake,
    updateDailySteps,
    updateSleepHours,
    toggleFasting,
    logMeal,
    setActiveTab,
    setFitnessSubTab,
    setIsMealScannerOpen,
    setIsCustomPlanModalOpen,
  } = useApp();

  const [coachInput, setCoachInput] = useState('');
  const [coachMessages, setCoachMessages] = useState([
    {
      role: 'coach',
      text: `Hi ${user?.name?.split(' ')[0] || 'Athlete'}! Ask me about Indian/global high-protein swaps, water, steps, plateaus, or 30m HIIT timing.`,
    },
  ]);

  // Compute Healthify-style Metabolic Health Score (0-100)
  const healthScore = useMemo(() => {
    const waterPct = Math.min(1, (wellnessToday?.waterMl || 0) / (wellnessToday?.waterTargetMl || 3500));
    const stepPct = Math.min(1, (wellnessToday?.steps || 0) / (wellnessToday?.stepsTarget || 8500));
    const protTarget = Math.round((user?.currentWeight || 75) * 1.8);
    const protPct = Math.min(1, (totalProtein || 0) / (protTarget || 135));
    const sleepPct = Math.min(1, (wellnessToday?.sleepHours || 7) / 8);
    const exPct = Math.min(1, (totalWorkoutMinutes || 0) / (user?.dailyWorkoutTargetMin || 30));
    return Math.round((waterPct * 20 + stepPct * 25 + protPct * 25 + sleepPct * 15 + exPct * 15));
  }, [wellnessToday, totalProtein, totalWorkoutMinutes, user]);

  const glassesDone = Math.round((wellnessToday?.waterMl || 0) / 250);
  const glassesTarget = Math.round((wellnessToday?.waterTargetMl || 3500) / 250);
  const neatCalories = Math.round((wellnessToday?.steps || 0) * 0.04);
  const fastingHoursElapsed = wellnessToday?.fastingStartedAt
    ? ((Date.now() - wellnessToday.fastingStartedAt) / 3600000).toFixed(1)
    : null;

  const handleAskCoach = (e, quickPrompt = null) => {
    if (e) e.preventDefault();
    const prompt = (quickPrompt ?? coachInput).trim();
    if (!prompt) return;
    const reply = buildCoachReply(prompt, {
      user,
      totalCaloriesConsumed,
      totalCaloriesBurned,
      totalProtein,
      sugarLimitGrams,
      wellnessToday,
      healthScore,
    });
    setCoachMessages((prev) => [
      ...prev.slice(-4),
      { role: 'user', text: prompt },
      { role: 'coach', text: reply },
    ]);
    if (!quickPrompt) setCoachInput('');
  };

  if (compact) {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-obsidian-850 to-[#090d14] border border-emerald-500/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" /> Healthify-Grade Daily Wellness Telemetry
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Hydration, Steps, Sleep &amp; AI Diet Coach
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-black">
              Health Score: {healthScore}/100
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-bold text-amber-300 hover:underline"
            >
              Full Suite →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Water Quick */}
          <div className="p-3 rounded-2xl bg-black/50 border border-sky-500/20 space-y-2">
            <div className="flex items-center justify-between text-sky-300 font-bold">
              <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5" /> Water</span>
              <span>{((wellnessToday.waterMl || 0) / 1000).toFixed(2)}L</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => addWaterIntake(250)}
                className="flex-1 py-1.5 rounded-lg bg-sky-500/20 border border-sky-500/35 text-sky-200 font-bold hover:bg-sky-500/30"
              >
                +250ml
              </button>
              <button
                type="button"
                onClick={() => addWaterIntake(500)}
                className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-bold hover:bg-white/10"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Steps Quick */}
          <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-emerald-300 font-bold">
              <span className="flex items-center gap-1"><Footprints className="w-3.5 h-3.5" /> Steps</span>
              <span>{(wellnessToday.steps || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateDailySteps((wellnessToday.steps || 0) + 1000)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/35 text-emerald-200 font-bold hover:bg-emerald-500/30"
              >
                +1,000
              </button>
              <span className="text-[10px] text-slate-400 font-mono">~{neatCalories} kcal</span>
            </div>
          </div>

          {/* Sleep & Fasting Quick */}
          <div className="p-3 rounded-2xl bg-black/50 border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5" /> Sleep</span>
              <span>{wellnessToday.sleepHours} hrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateSleepHours((wellnessToday.sleepHours || 7.5) - 0.5)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => updateSleepHours((wellnessToday.sleepHours || 7.5) + 0.5)}
                className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/35 text-purple-200"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={toggleFasting}
                className={`flex-1 py-1 rounded-lg border text-[10px] font-bold ${
                  fastingHoursElapsed ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                {fastingHoursElapsed ? `Fast ${fastingHoursElapsed}h` : '16:8 Fast'}
              </button>
            </div>
          </div>

          {/* AI Coach Quick */}
          <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Diet &amp; Plan Coach</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsMealScannerOpen(true)}
                className="flex-1 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/35 text-amber-300 font-bold text-[10px]"
              >
                Snap Meal
              </button>
              <button
                type="button"
                onClick={() => setIsCustomPlanModalOpen?.(true)}
                className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-bold text-[10px]"
              >
                Custom Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full HealthifyMe Parity Dashboard Suite
  return (
    <div className="space-y-5">
      <div className="p-5 sm:p-6 rounded-3xl glass-panel-glow border border-emerald-500/25 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" /> Holistic Healthify Wellness Telemetry
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Hydration, Steps, Sleep, Intermittent Fasting &amp; AI Dietitian
            </h3>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-right self-start sm:self-auto">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
              Daily Health Score
            </span>
            <span className="text-xl font-black text-white">{healthScore} / 100</span>
          </div>
        </div>

        {/* 4 Wellness Metric Trackers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Water Tracker */}
          <div className="p-4 rounded-2xl bg-black/50 border border-sky-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-300 flex items-center gap-1.5">
                <Droplet className="w-4 h-4" /> Hydration
              </span>
              <span className="font-mono font-bold text-white">
                {((wellnessToday.waterMl || 0) / 1000).toFixed(2)}L / {((wellnessToday.waterTargetMl || 3500) / 1000).toFixed(1)}L
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: Math.min(14, glassesTarget) }, (_, i) => (
                <span
                  key={i}
                  className={`w-3.5 h-5 rounded-sm border ${
                    i < glassesDone
                      ? 'bg-sky-400/80 border-sky-300'
                      : 'bg-white/5 border-white/10'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => addWaterIntake(-250)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 font-bold"
              >
                -250
              </button>
              <button
                type="button"
                onClick={() => addWaterIntake(250)}
                className="flex-1 py-1.5 rounded-lg bg-sky-500/25 border border-sky-400/40 text-sky-200 font-bold"
              >
                +1 Glass (250ml)
              </button>
            </div>
          </div>

          {/* 2. Steps & NEAT Counter */}
          <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Footprints className="w-4 h-4" /> Daily Steps
              </span>
              <span className="font-mono font-bold text-white">
                {(wellnessToday.steps || 0).toLocaleString()} / {(wellnessToday.stepsTarget || 8500).toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300"
                style={{
                  width: `${Math.min(100, Math.round(((wellnessToday.steps || 0) / (wellnessToday.stepsTarget || 8500)) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => updateDailySteps((wellnessToday.steps || 0) + 1000)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/35 text-emerald-200 font-bold"
              >
                +1k Steps
              </button>
              <button
                type="button"
                onClick={() => updateDailySteps((wellnessToday.steps || 0) + 2500)}
                className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-bold"
              >
                +2.5k ({neatCalories} kcal)
              </button>
            </div>
          </div>

          {/* 3. Sleep Quality */}
          <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Moon className="w-4 h-4" /> Sleep Recovery
              </span>
              <span className="font-mono font-bold text-white">{wellnessToday.sleepHours} hrs</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {wellnessToday.sleepHours >= 7.5
                ? 'Optimal cortisol & muscle synthesis window reached.'
                : 'Aim for 7.5+ hrs to sharpen insulin sensitivity.'}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateSleepHours((wellnessToday.sleepHours || 7.5) - 0.5)}
                className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-bold"
              >
                -0.5h
              </button>
              <button
                type="button"
                onClick={() => updateSleepHours((wellnessToday.sleepHours || 7.5) + 0.5)}
                className="flex-1 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/35 text-purple-200 font-bold"
              >
                +0.5h
              </button>
            </div>
          </div>

          {/* 4. Intermittent Fasting Window */}
          <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Timer className="w-4 h-4" /> 16:8 Fasting
              </span>
              <span className="font-mono font-bold text-white">
                {fastingHoursElapsed ? `${fastingHoursElapsed}h Active` : 'Eating Window'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {fastingHoursElapsed
                ? 'Fasting mode running — hydrate with plain water or black coffee.'
                : 'Start your overnight clean fast window after dinner.'}
            </p>
            <button
              type="button"
              onClick={toggleFasting}
              className={`w-full py-1.5 rounded-lg font-bold border ${
                fastingHoursElapsed
                  ? 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              }`}
            >
              {fastingHoursElapsed ? 'End Fast Window' : 'Start 16:8 Fast Timer'}
            </button>
          </div>
        </div>

        {/* Healthify RIA-Style AI Coach Interactive Assistant */}
        <div className="p-4 rounded-2xl bg-black/55 border border-amber-500/20 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-black text-amber-300">
              <Bot className="w-4 h-4" />
              <span>Coach FitArc AI (Healthify RIA-Style Nutrition &amp; Fat-Loss Assistant)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'How much protein left today?',
                'Best 30m HIIT & fat loss tip',
                'Why is weight plateauing?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskCoach(null, q)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 border border-white/10 text-[10px] text-slate-300 hover:text-amber-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {coachMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100 ml-8 text-right'
                    : 'bg-obsidian-900 border border-white/10 text-slate-200 mr-8'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAskCoach} className="flex gap-2">
            <input
              type="text"
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="Ask Coach FitArc about Indian protein swaps, calories, HIIT or water..."
              className="flex-1 px-3.5 py-2 rounded-xl glass-input text-white"
            />
            <button type="submit" className="gold-btn px-4 py-2 rounded-xl font-bold flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                logMeal({
                  title: 'High-Protein Paneer / Tofu Bhurji (Quick Log)',
                  calories: 320,
                  protein: 26,
                  carbs: 14,
                  fats: 16,
                  sugar: 3,
                  mealSlot: 'lunch',
                });
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold inline-flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Quick Log 26g Protein Meal
            </button>
            <button
              type="button"
              onClick={() => setIsMealScannerOpen(true)}
              className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-bold inline-flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" /> AI Photo Meal Scan
            </button>
            <button
              type="button"
              onClick={() => {
                setFitnessSubTab?.('hiit_leap');
                setActiveTab('fitness');
              }}
              className="px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold inline-flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" /> Open 30m HIIT Cardio
            </button>
            <button
              type="button"
              onClick={() => setIsCustomPlanModalOpen?.(true)}
              className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Build Custom Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HealthifySuite;
