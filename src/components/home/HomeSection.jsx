import React, { useState, useMemo } from 'react';
import {
  Flame,
  Clock,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Camera,
  Scale,
  Dumbbell,
  Utensils,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Heart,
  Droplet,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutDetailModal } from '../fitness/WorkoutDetailModal';
import { GuidedWorkoutPlayerModal } from '../fitness/GuidedWorkoutPlayerModal';
import { YOGA_AND_HOME_WORKOUTS } from '../../data/yogaAndHomeWorkouts';
import { MASTER_EXERCISE_CATALOG } from '../../data/allExercisesMaster';
import { TROUBLE_ZONE_PLANS, HOME_WORKOUTS_EXPANDED } from '../../data/homeWorkoutsExpanded';

export function HomeSection() {
  const {
    user,
    todaysWorkouts,
    todaysMeals,
    totalCaloriesBurned,
    totalWorkoutMinutes,
    totalCaloriesConsumed,
    totalSugar,
    sugarLimitGrams,
    setActiveTab,
    setIsWeightModalOpen,
    setIsMealScannerOpen,
    setIsPlanModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    openAuthModal,
  } = useApp();

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [guidedWorkoutPlan, setGuidedWorkoutPlan] = useState(null);

  const launchTroubleZoneSession = (zoneId = 'belly_fat') => {
    const plan = TROUBLE_ZONE_PLANS.find((p) => p.id === zoneId) || TROUBLE_ZONE_PLANS[0];
    const levelKey = (user.bodyFat || 20) > 30 ? 'beginner' : 'intermediate';
    const lvl = plan.levels[levelKey] || plan.levels.intermediate;
    const exercises = lvl.exerciseIds
      .map((id) => HOME_WORKOUTS_EXPANDED.find((e) => e.id === id))
      .filter(Boolean);

    setGuidedWorkoutPlan({
      title: `${plan.title} (Day 5)`,
      badge: plan.badge,
      exercises,
    });
  };

  // Dynamic Time-based Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayFormatted = useMemo(() => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }, []);

  // Targets (Apple Fitness / Google Fit standard calibrated to user)
  const calorieGoal = 500;
  const exerciseMinGoal = user.dailyWorkoutTargetMin || 45;
  const sugarLimit = sugarLimitGrams || 20;

  // Percentage calculations capped at 100% for rings, but displaying real values
  const movePercent = Math.min(100, Math.round((totalCaloriesBurned / calorieGoal) * 100));
  const exercisePercent = Math.min(100, Math.round((totalWorkoutMinutes / exerciseMinGoal) * 100));
  const sugarPercent = Math.min(100, Math.round((totalSugar / sugarLimit) * 100));

  // Curated Featured Workouts for Today (Apple Fitness+ style)
  const featuredWorkouts = useMemo(() => {
    const sunSalutation =
      YOGA_AND_HOME_WORKOUTS.find((e) => e.name && e.name.includes('Surya Namaskar')) ||
      YOGA_AND_HOME_WORKOUTS[0];
    const crossCrunch =
      MASTER_EXERCISE_CATALOG.find((e) => e.name && e.name.toLowerCase().includes('cross body crunch')) ||
      MASTER_EXERCISE_CATALOG.find((e) => e.muscleCategory === 'Core' || e.muscle === 'abs');
    const faceYoga =
      YOGA_AND_HOME_WORKOUTS.find((e) => e.category === 'face_yoga' && e.name.includes('Jawline')) ||
      YOGA_AND_HOME_WORKOUTS.find((e) => e.category === 'face_yoga');
    const homeSquat =
      YOGA_AND_HOME_WORKOUTS.find((e) => e.category === 'home_workout' && e.name.includes('Split Squat')) ||
      YOGA_AND_HOME_WORKOUTS.find((e) => e.category === 'home_workout');

    return [
      {
        exercise: sunSalutation,
        title: 'Morning Flow: Surya Namaskar',
        subtitle: '15 min · Full Body Mobility Flow',
        tag: 'Yoga Flow',
        color: 'from-amber-500/20 to-orange-500/10',
        borderColor: 'border-amber-500/30',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      },
      {
        exercise: crossCrunch || MASTER_EXERCISE_CATALOG[0],
        title: 'Core & Oblique Kinetic Sculpt',
        subtitle: '12 min · High Calisthenics Burn',
        tag: 'Belly Fat Focus',
        color: 'from-rose-500/20 to-orange-500/10',
        borderColor: 'border-rose-500/30',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      },
      {
        exercise: faceYoga,
        title: 'Jawline Sculpt & Fascia Glide',
        subtitle: '8 min · Targeted Face Yoga',
        tag: 'Face Definition',
        color: 'from-purple-500/20 to-pink-500/10',
        borderColor: 'border-purple-500/30',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      },
      {
        exercise: homeSquat,
        title: 'Sofa Bulgarian Split Squat',
        subtitle: '18 min · Zero Equipment Home Leg Burn',
        tag: 'Home Workout',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      },
    ].filter((item) => item.exercise);
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* 1. HERO GREETING & STREAK BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              {todayFormatted}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className="text-[11px] text-slate-400 font-medium">FITARC Golden Standard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {greeting}, <span className="gold-gradient-text">{user.name?.split(' ')[0] || 'Athlete'}</span>
          </h1>
        </div>

        {/* Dynamic Streak & Health Score Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 shadow-gold-glow-sm">
            <span className="text-base animate-bounce">🔥</span>
            <div className="text-left leading-none">
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">Streak</span>
              <span className="text-xs font-black text-amber-300">5 Days Active</span>
            </div>
          </div>

          <button
            onClick={() => openAuthModal('tier')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-obsidian-850 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition text-left leading-none active:scale-95 group shadow-sm"
            title="Athlete Tier & Perks"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold text-[10px] flex items-center justify-center shadow-gold-glow-sm group-hover:scale-105 transition">
              {user.name?.slice(0, 2).toUpperCase() || 'AV'}
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">Tier</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                {user.memberTier || 'Gold Elite Pro'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. APPLE FITNESS ICONIC 3-RING ACTIVITY & METRIC HUB */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-black border border-amber-500/25 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* LEFT: APPLE FITNESS CONCENTRIC ACTIVITY RINGS (SVG) */}
          <div className="flex items-center gap-5 sm:gap-6 shrink-0 w-full sm:w-auto justify-center sm:justify-start">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Tracks */}
                {/* Outer Ring: Move (Calories) */}
                <circle cx="80" cy="80" r="68" stroke="rgba(244, 63, 94, 0.15)" strokeWidth="12" fill="none" />
                {/* Middle Ring: Exercise (Minutes) */}
                <circle cx="80" cy="80" r="50" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="12" fill="none" />
                {/* Inner Ring: Fuel / Sugar Control */}
                <circle cx="80" cy="80" r="32" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="12" fill="none" />

                {/* Animated Progress Rings */}
                {/* Outer: Move (Rose / Red) */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="#f43f5e"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - movePercent / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Middle: Exercise (Emerald / Green) */}
                <circle
                  cx="80"
                  cy="80"
                  r="50"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - exercisePercent / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Inner: Fuel / Sugar Cap (Amber / Gold) */}
                <circle
                  cx="80"
                  cy="80"
                  r="32"
                  stroke="#fbbf24"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - Math.min(100, sugarPercent) / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Ring Icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                  Today
                </span>
              </div>
            </div>

            {/* Ring Legend & Highlights */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Move (Calories)</div>
                  <div className="text-sm font-extrabold text-white">
                    {totalCaloriesBurned} <span className="text-[11px] font-normal text-slate-400">/ {calorieGoal} kcal</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Exercise (Minutes)</div>
                  <div className="text-sm font-extrabold text-white">
                    {totalWorkoutMinutes} <span className="text-[11px] font-normal text-slate-400">/ {exerciseMinGoal} min</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Daily Sugar Cap</div>
                  <div className={`text-sm font-extrabold ${totalSugar > sugarLimit ? 'text-rose-400' : 'text-amber-300'}`}>
                    {totalSugar}g <span className="text-[11px] font-normal text-slate-400">/ {sugarLimit}g max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: COMPACT BIOMETRIC SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full lg:w-auto flex-1">
            {/* Calories Ingested */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-amber-400" /> Fuel In
              </span>
              <div className="text-lg font-black text-white">
                {totalCaloriesConsumed} <span className="text-[10px] font-normal text-slate-400">kcal</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Target: {user.dailyCalorieTarget || 2200}
              </span>
            </div>

            {/* Current Weight & BMI */}
            <div
              onClick={() => setIsWeightModalOpen(true)}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-500/30 transition cursor-pointer space-y-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-amber-400" /> Weight
              </span>
              <div className="text-lg font-black text-amber-300">
                {user.currentWeight} <span className="text-[10px] font-normal text-slate-400">kg</span>
              </div>
              <span className="text-[10px] text-emerald-400 block truncate">
                BMI {(user.currentWeight / Math.pow((user.height || 180) / 100, 2)).toFixed(1)} · Optimal
              </span>
            </div>

            {/* Estimated Body Fat */}
            <div
              onClick={() => openAuthModal('biometrics')}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-500/30 transition cursor-pointer space-y-1 col-span-2 sm:col-span-1"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Body Fat %
              </span>
              <div className="text-lg font-black text-white">
                {user.bodyFat || 16.5}%
              </div>
              <span className="text-[10px] text-amber-400 block truncate">
                {user.gender === 'male' ? 'Athletic / Lean' : 'Fitness Tier'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE TRANSFORMATION SPRINT CARD (30 / 60 / 90 DAYS) */}
      {user.activePlan && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-obsidian-850 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black shadow-gold-glow-sm shrink-0">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Active Transformation Protocol
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Day {user.activePlan.currentDay || 5} of {user.activePlan.durationDays}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
                  {user.activePlan.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/15 transition flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
            >
              <span>Change Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Sprint Progression</span>
              <span className="text-amber-400 font-mono font-bold">
                {Math.round(((user.activePlan.currentDay || 5) / user.activePlan.durationDays) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, Math.round(((user.activePlan.currentDay || 5) / user.activePlan.durationDays) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Today's Protocol Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200 truncate">
                Deficit: -{user.activePlan.dailyCalorieDeficit || 500} kcal
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200 truncate">
                Sugar Limit: &lt; {user.activePlan.dailySugarLimitGrams || 20}g / day
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-slate-200 truncate">
                {user.activePlan.workoutDaysPerWeek || 5} Training Days / Wk
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. LEAP FITNESS TROUBLE ZONE 30-DAY CHALLENGES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            30 Days Challenge: Focus on Trouble Zone
          </h2>
          <button
            onClick={() => setActiveTab('fitness')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
          >
            <span>Open Home Workout Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { id: 'belly_fat', label: 'Lose Belly Fat', tag: 'Core Chisel', icon: '🔥', color: 'from-rose-500/20 to-orange-500/10', border: 'border-rose-500/30' },
            { id: 'chest_man_boobs', label: 'No Man Boobs', tag: 'Chest Sculpt', icon: '⚡', color: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/30' },
            { id: 'arm_fat', label: 'Lose Arm Fat', tag: 'Tricep Tone', icon: '💪', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
            { id: 'shape_full_body', label: 'Shape Full Body', tag: 'HIIT Burn', icon: '🏃', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
            { id: 'legs_glutes', label: 'Butt & Glutes', tag: 'Legs Lift', icon: '✨', color: 'from-pink-500/20 to-purple-500/10', border: 'border-pink-500/30' },
            { id: 'lazy_fitness', label: 'Lazy Bed Fitness', tag: 'Restorative', icon: '🛋️', color: 'from-indigo-500/20 to-purple-500/10', border: 'border-indigo-500/30' },
          ].map((zone) => (
            <button
              key={zone.id}
              onClick={() => launchTroubleZoneSession(zone.id)}
              className={`p-3.5 rounded-2xl bg-gradient-to-br ${zone.color} bg-obsidian-850 border ${zone.border} hover:border-amber-400 text-left transition-all duration-200 active:scale-95 flex flex-col justify-between space-y-2 group shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl group-hover:scale-110 transition">{zone.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/50 text-amber-300">
                  {zone.tag}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition leading-tight">
                  {zone.label}
                </h4>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">1-Tap Start</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. QUICK ACTION 1-TAP LAUNCHPAD */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Launchpad
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Home Workouts */}
          <button
            onClick={() => setActiveTab('fitness')}
            className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 transition group text-left space-y-2 active:scale-95 shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Home Workouts
              </h4>
              <p className="text-[11px] text-slate-400">590+ Zero-Equipment</p>
            </div>
          </button>

          {/* Action 2: AI Food Photo Scanner */}
          <button
            onClick={() => setIsMealScannerOpen(true)}
            className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 transition group text-left space-y-2 active:scale-95 shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                AI Meal Scanner
              </h4>
              <p className="text-[11px] text-slate-400">Snap Photo for Macros</p>
            </div>
          </button>

          {/* Action 3: Daily Yoga & Face Yoga */}
          <button
            onClick={() => {
              setActiveTab('fitness');
            }}
            className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 transition group text-left space-y-2 active:scale-95 shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Yoga & Face Flow
              </h4>
              <p className="text-[11px] text-slate-400">Full Body & Jawline</p>
            </div>
          </button>

          {/* Action 4: Body Fat & BMI Vault */}
          <button
            onClick={() => openAuthModal('biometrics')}
            className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 transition group text-left space-y-2 active:scale-95 shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Body Fat & BMI
              </h4>
              <p className="text-[11px] text-slate-400">Photo Vision Scan</p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. APPLE FITNESS+ CURATED SESSIONS FOR TODAY */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Curated For You Today
            </h2>
            <p className="text-xs text-slate-400">
              Personalized routines with dark 3D anatomical animations & form guidance
            </p>
          </div>

          <button
            onClick={() => setActiveTab('fitness')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 self-start sm:self-auto"
          >
            <span>See All ({YOGA_AND_HOME_WORKOUTS.length}+ Movements)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredWorkouts.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedExercise(item.exercise)}
              className={`p-4 rounded-3xl bg-gradient-to-br ${item.color} bg-obsidian-900 border ${item.borderColor} hover:border-amber-400 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg active:scale-[0.98]`}
            >
              <div className="space-y-3">
                {/* 3D Preview Stage */}
                <div className="relative w-full h-36 rounded-2xl bg-black/60 overflow-hidden border border-white/5 flex items-center justify-center p-2">
                  <img
                    src={item.exercise.gifUrl}
                    alt={item.title}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackApplied) {
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src =
                          'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif';
                      }
                    }}
                    className="w-full h-full object-contain dark-3d-animation group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/80 text-amber-400 border border-white/10 group-hover:bg-amber-500 group-hover:text-black transition shadow-lg">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              {/* Target Muscles Pill */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">⚡ {item.exercise.primaryMuscles?.[0]?.name || 'Full Body'}</span>
                <span className="font-bold text-amber-300 shrink-0">~{item.exercise.metScore * 20} kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. TODAY'S RECENT ACTIVITY & LOGGED SESSIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Logged Workouts */}
        <div className="p-5 rounded-3xl bg-obsidian-850/90 border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" /> Today's Workouts ({todaysWorkouts.length})
            </h3>
            <button
              onClick={() => setActiveTab('fitness')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              + Log More
            </button>
          </div>

          {todaysWorkouts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-black/30 border border-dashed border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-400">No workout logged yet today.</p>
              <button
                onClick={() => setActiveTab('fitness')}
                className="gold-btn px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Workout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysWorkouts.slice(0, 3).map((w, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-bold text-white truncate max-w-[160px] sm:max-w-xs">{w.exerciseName}</h4>
                      <span className="text-[10px] text-slate-400">{w.durationMinutes} mins · {w.sets} sets</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-300">+{w.caloriesBurned} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Logged Meals & Sugar Status */}
        <div className="p-5 rounded-3xl bg-obsidian-850/90 border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" /> Today's Nutrition ({todaysMeals.length})
            </h3>
            <button
              onClick={() => setActiveTab('food')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              + Log Food
            </button>
          </div>

          {todaysMeals.length === 0 ? (
            <div className="p-6 rounded-2xl bg-black/30 border border-dashed border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-400">No meals logged yet today.</p>
              <button
                onClick={() => setIsMealScannerOpen(true)}
                className="gold-btn px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Meal</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysMeals.slice(0, 3).map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                      🥗
                    </div>
                    <div>
                      <h4 className="font-bold text-white truncate max-w-[160px] sm:max-w-xs">{m.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {m.protein}g protein · {m.sugar || 0}g sugar
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-300">{m.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Workout Modal */}
      {selectedExercise && (
        <WorkoutDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Guided Workout Live Session Runner Modal */}
      {guidedWorkoutPlan && (
        <GuidedWorkoutPlayerModal
          isOpen={!!guidedWorkoutPlan}
          onClose={() => setGuidedWorkoutPlan(null)}
          routineTitle={guidedWorkoutPlan.title}
          planBadge={guidedWorkoutPlan.badge}
          exercises={guidedWorkoutPlan.exercises}
        />
      )}
    </div>
  );
}
