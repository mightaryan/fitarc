import React, { useState, useMemo } from 'react';
import {
  Flame,
  CheckCircle2,
  Play,
  ChevronRight,
  Activity,
  Layers,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { TROUBLE_ZONE_PLANS, HOME_WORKOUTS_EXPANDED } from '../../data/homeWorkoutsExpanded';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { mergeManagedCatalog } from '../../utils/adminCatalogHelpers';
import { useApp } from '../../context/AppContext';

export function HomeWorkoutHub() {
  const { user, customExercises, disabledExerciseIds, exerciseOverrides, hasPaidPlan, openPlanUpgradeModal, setActiveGuidedSession } = useApp();

  const managedHomeWorkouts = useMemo(
    () =>
      mergeManagedCatalog(HOME_WORKOUTS_EXPANDED, {
        customItems: customExercises,
        disabledIds: disabledExerciseIds,
        overrides: exerciseOverrides,
        customFilter: (ex) => ex.category === 'home_workout' || ex.subCategory === 'home_workout',
      }),
    [customExercises, disabledExerciseIds, exerciseOverrides]
  );

  const [selectedPlanId, setSelectedPlanId] = useState('belly_fat');
  const [selectedLevel, setSelectedLevel] = useState(() => {
    if (!hasPaidPlan) return 'beginner';
    const bf = user.bodyFat || 20;
    if (bf > 35) return 'beginner';
    if (bf >= 25) return 'intermediate';
    return 'advanced';
  });
  // Active selected day of the 30-day challenge (1 to 30)
  const [activeDay, setActiveDay] = useState(5);
  // Low-impact / No-jumping toggle
  const [isLowImpact, setIsLowImpact] = useState(false);

  // Detail modal state for inspection
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  const activePlan = useMemo(() => {
    return TROUBLE_ZONE_PLANS.find((p) => p.id === selectedPlanId) || TROUBLE_ZONE_PLANS[0];
  }, [selectedPlanId]);

  const activeLevelData = useMemo(() => {
    return activePlan.levels[selectedLevel] || activePlan.levels.intermediate;
  }, [activePlan, selectedLevel]);

  // Resolve exercises from IDs, respecting Admin hides/overrides and filtering for low-impact
  const activeExercises = useMemo(() => {
    let exercises = activeLevelData.exerciseIds
      .map((id) => managedHomeWorkouts.find((e) => e.id === id))
      .filter(Boolean);

    // If low impact is enabled, swap high-impact jumping exercises with unique unused low-impact alternatives
    if (isLowImpact) {
      const usedGifs = new Set(exercises.filter((e) => e.lowImpact).map((e) => e.gifUrl));
      const lowImpactPool = managedHomeWorkouts.filter(
        (e) => e.targetArea === selectedPlanId && e.lowImpact
      );
      const allLowImpactFallback = managedHomeWorkouts.filter((e) => e.lowImpact);
      exercises = exercises.map((ex, idx) => {
        if (!ex.lowImpact) {
          const replacement =
            lowImpactPool.find((c) => !usedGifs.has(c.gifUrl)) ||
            allLowImpactFallback.find((c) => !usedGifs.has(c.gifUrl)) ||
            lowImpactPool[idx % (lowImpactPool.length || 1)];
          if (replacement) {
            usedGifs.add(replacement.gifUrl);
            return replacement;
          }
        }
        return ex;
      });
    }

    return exercises;
  }, [activeLevelData, selectedPlanId, isLowImpact, managedHomeWorkouts]);

  // Trouble Zone cards metadata
  const TROUBLE_ZONE_CARDS = [
    {
      id: 'belly_fat',
      label: 'Lose Belly Fat',
      tag: 'Core Chisel',
      color: 'from-rose-500/25 via-orange-500/15 to-obsidian-900',
      border: 'border-rose-500/40',
      activeGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      icon: '🔥',
    },
    {
      id: 'hiit_furnace_600',
      label: '400-600 kcal HIIT',
      tag: 'Extreme Burn',
      color: 'from-amber-600/25 via-rose-600/15 to-obsidian-900',
      border: 'border-amber-500/50',
      activeGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.45)]',
      icon: '⚡',
    },
    {
      id: 'chest_man_boobs',
      label: 'No Man Boobs',
      tag: 'Chest Sculpt',
      color: 'from-amber-500/25 via-yellow-500/15 to-obsidian-900',
      border: 'border-amber-500/40',
      activeGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      icon: '⚡',
    },
    {
      id: 'arm_fat',
      label: 'Lose Arm Fat',
      tag: 'Tricep Tone',
      color: 'from-blue-500/25 via-cyan-500/15 to-obsidian-900',
      border: 'border-blue-500/40',
      activeGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
      icon: '💪',
    },
    {
      id: 'shape_full_body',
      label: 'Shape Full Body',
      tag: 'HIIT Burn',
      color: 'from-emerald-500/25 via-teal-500/15 to-obsidian-900',
      border: 'border-emerald-500/40',
      activeGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      icon: '🏃',
    },
    {
      id: 'legs_glutes',
      label: 'Butt & Glute Lift',
      tag: 'Legs & Booty',
      color: 'from-pink-500/25 via-purple-500/15 to-obsidian-900',
      border: 'border-pink-500/40',
      activeGlow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
      icon: '✨',
    },
    {
      id: 'lazy_fitness',
      label: 'Lazy Bed & Couch',
      tag: 'Restorative',
      color: 'from-indigo-500/25 via-purple-500/15 to-obsidian-900',
      border: 'border-indigo-500/40',
      activeGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.35)]',
      icon: '🛋️',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HERO BANNER: 30 DAYS CHALLENGE AT HOME (LEAP FITNESS INSPIRED) */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-rose-950/60 via-obsidian-850 to-amber-950/40 border border-amber-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-rose-500 text-rose-400" />
                30 Days Challenge At Home
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Zero Equipment
              </span>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                ★ 4.9 Rating · {HOME_WORKOUTS_EXPANDED.length}+ Zero-Rig Home Movements
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {activePlan.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activePlan.description}
            </p>
          </div>

          {/* Quick Action Start Button */}
          <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setIsPlayerOpen(true)}
              className="gold-btn py-3 px-6 rounded-2xl text-sm font-black shadow-gold-glow flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Day {activeDay} Workout</span>
            </button>
            <span className="text-[10px] text-center text-slate-400 font-mono">
              {activeLevelData.exerciseCount} Exercises · ~{activeLevelData.durationMinutes} Mins · {activeLevelData.estimatedCalories} kcal
            </span>
          </div>
        </div>
      </div>

      {/* 2. FOCUS ON TROUBLE ZONE (LEAP FITNESS 6 TILES) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Focus on Trouble Zone:
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold font-mono">
            {HOME_WORKOUTS_EXPANDED.length}+ Home Exercises
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {TROUBLE_ZONE_CARDS.map((card) => {
            const isSelected = selectedPlanId === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedPlanId(card.id)}
                className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.color} border text-left transition-all duration-200 active:scale-95 flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? `${card.border} ${card.activeGlow} ring-2 ring-amber-400/80`
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{card.icon}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                    {card.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                    {card.label}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. VISIBLE CHANGES: 3-LEVEL PLAN SELECTOR (BODY FAT CALIBRATED) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          Visible Changes: 3-Level Plan (Calibrated to Body Fat):
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Level 1: Beginner */}
          <div
            onClick={() => setSelectedLevel('beginner')}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
              selectedLevel === 'beginner'
                ? 'bg-blue-950/40 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-blue-400'
                : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Beginner
              </span>
              <span className="text-xs text-blue-300 font-bold">Body Fat &gt; 40%</span>
            </div>
            <h4 className="text-sm font-extrabold text-white mt-2">Gentle & Low Impact</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Joint-friendly movements to safely ignite calorie expenditure without straining knees.
            </p>
            <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-400">
              <span>{activePlan.levels.beginner.exerciseCount} Exercises</span>
              <span>·</span>
              <span>~{activePlan.levels.beginner.durationMinutes} Min</span>
              <span>·</span>
              <span className="text-blue-300 font-bold">{activePlan.levels.beginner.estimatedCalories} kcal</span>
            </div>
          </div>

          {/* Level 2: Intermediate */}
          <div
            onClick={() => setSelectedLevel('intermediate')}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
              selectedLevel === 'intermediate'
                ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400'
                : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Intermediate
              </span>
              <span className="text-xs text-amber-300 font-bold">Body Fat 30% - 40%</span>
            </div>
            <h4 className="text-sm font-extrabold text-white mt-2">Fat Burn Acceleration</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Multi-angle time-under-tension calisthenics accelerating metabolic rate.
            </p>
            <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-400">
              <span>{activePlan.levels.intermediate.exerciseCount} Exercises</span>
              <span>·</span>
              <span>~{activePlan.levels.intermediate.durationMinutes} Min</span>
              <span>·</span>
              <span className="text-amber-300 font-bold">{activePlan.levels.intermediate.estimatedCalories} kcal</span>
            </div>
          </div>

          {/* Level 3: Advanced */}
          <div
            onClick={() => {
              if (!hasPaidPlan) {
                openPlanUpgradeModal('Switch from Free to a Paid Plan to unlock Advanced home programs.');
                return;
              }
              setSelectedLevel('advanced');
            }}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
              selectedLevel === 'advanced'
                ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-2 ring-rose-400'
                : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1">
                {!hasPaidPlan && <Lock className="w-3 h-3" />}
                Advanced
              </span>
              <span className="text-xs text-rose-300 font-bold">
                {hasPaidPlan ? 'Unlocked' : 'Paid Plan'}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white mt-2">6-Pack Chisel & Density</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              High-intensity muscle endurance intervals carving deep abdominal definition.
            </p>
            <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-400">
              <span>{activePlan.levels.advanced.exerciseCount} Exercises</span>
              <span>·</span>
              <span>~{activePlan.levels.advanced.durationMinutes} Min</span>
              <span>·</span>
              <span className="text-rose-300 font-bold">{activePlan.levels.advanced.estimatedCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DAY 1-30 CALENDAR TIMELINE & LOW IMPACT TOGGLE */}
      <div className="p-4 sm:p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              30-Day Calendar Timeline
            </span>
            <h3 className="text-base font-extrabold text-white">
              Day {activeDay} · {activeExercises.length} Exercises ({activeLevelData.estimatedCalories} kcal)
            </h3>
          </div>

          {/* LOW IMPACT / NO-JUMPING TOGGLE (LEAP FITNESS SIGNATURE FEATURE) */}
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Low Impact (No-Jumping Mode)
            </span>
            <button
              onClick={() => setIsLowImpact(!isLowImpact)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative p-0.5 ${
                isLowImpact ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle Low Impact Mode"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  isLowImpact ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Day Pills Carousel (Days 1 to 30) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = dayNum < activeDay;
            const isCurrent = dayNum === activeDay;
            const isRestDay = dayNum % 4 === 0;

            return (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                className={`px-3 py-2 rounded-xl text-center shrink-0 min-w-[58px] transition active:scale-95 border ${
                  isCurrent
                    ? 'bg-amber-500 text-black font-black border-amber-400 shadow-gold-glow-sm'
                    : isCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider block font-bold">
                  {isRestDay ? 'Rest' : `Day`}
                </span>
                <span className="text-sm font-extrabold block">
                  {dayNum}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mx-auto mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. TODAY'S EXERCISE LIST (LEAP FITNESS WORKOUT LIST VIEW) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Day {activeDay} Routine ({activeExercises.length} Exercises):
          </h3>
          <button
            onClick={() => setIsPlayerOpen(true)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
          >
            <span>Start Guided Player</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeExercises.map((exercise, idx) => (
            <div
              key={exercise.id || idx}
              onClick={() => setSelectedExerciseForModal(exercise)}
              className="rounded-3xl bg-obsidian-850 border border-white/10 hover:border-amber-500/40 transition duration-200 cursor-pointer group flex flex-col justify-between overflow-hidden shadow-lg active:scale-[0.98]"
            >
              {/* Large 3D Animated Obsidian Stage (Matching Gym Cards) */}
              <div className="relative h-44 bg-[#050608] overflow-hidden flex items-center justify-center p-2 border-b border-white/5">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  onError={(e) => {
                    if (!e.currentTarget.dataset.err) {
                      e.currentTarget.dataset.err = 'true';
                      e.currentTarget.src =
                        'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif';
                    }
                  }}
                  className="max-h-full w-auto object-contain dark-3d-animation group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    #{idx + 1}
                  </span>
                  {exercise.lowImpact && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      Low Impact
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/80 text-amber-400 border border-white/10 group-hover:bg-amber-500 group-hover:text-black transition shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* Exercise Telemetry Footer */}
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-300 transition">
                    {exercise.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="font-semibold text-amber-300">{exercise.defaultReps || '15 Reps'}</span>
                    <span>·</span>
                    <span className="truncate">{exercise.muscleCategory || 'Core'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Action Bar for Mobile & Desktop */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() =>
            setActiveGuidedSession?.({
              routineTitle: `${activePlan.title} - Day ${activeDay}`,
              badge: activePlan.badge,
              exercises: activeExercises,
              restDurationSeconds: activeLevelData.restSeconds || 15,
              isLowImpact,
            })
          }
          className="gold-btn w-full max-w-md py-4 rounded-2xl text-base font-black shadow-gold-glow flex items-center justify-center gap-2.5 uppercase tracking-wider active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START GUIDED WORKOUT (DAY {activeDay})</span>
        </button>
      </div>

      {/* 7. INDIVIDUAL EXERCISE 3D INSPECTION MODAL */}
      {selectedExerciseForModal && (
        <WorkoutDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
        />
      )}
    </div>
  );
}
