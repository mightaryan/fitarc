import React, { useState, useMemo } from 'react';
import {
  Flame,
  Clock,
  Play,
  Trophy,
  CheckCircle2,
  ShieldCheck,
  Mic,
  Sparkles,
  Calendar,
  Award,
  Sliders,
  Lock,
} from 'lucide-react';
import {
  HIIT_CARDIO_EXERCISES,
  BODY_PART_SETS,
  DURATION_OPTIONS,
  LEAP_ACHIEVEMENT_BADGES,
  buildBodyPartSession,
} from '../../data/hiitAndLeapWorkouts';
import { HOME_WORKOUTS_EXPANDED } from '../../data/homeWorkoutsExpanded';
import { YOGA_AND_HOME_WORKOUTS } from '../../data/yogaAndHomeWorkouts';
import { CALISTHENICS_EXERCISES } from '../../data/calisthenicsExercises';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { useApp } from '../../context/AppContext';

const SAFE_HIIT_FALLBACK = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif';

export function HiitAndBodyPartStudio() {
  const { user, wellnessToday, setIsCustomPlanModalOpen, hasPaidPlan, openPlanUpgradeModal, setActiveGuidedSession } = useApp();

  const [selectedBodyPart, setSelectedBodyPart] = useState('hiit_cardio');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [lowImpactOnly, setLowImpactOnly] = useState(false);
  const [selectedExerciseModal, setSelectedExerciseModal] = useState(null);

  const combinedCatalog = useMemo(
    () => [
      ...HIIT_CARDIO_EXERCISES,
      ...HOME_WORKOUTS_EXPANDED,
      ...CALISTHENICS_EXERCISES,
      ...YOGA_AND_HOME_WORKOUTS,
    ],
    []
  );

  const builtSession = useMemo(
    () =>
      buildBodyPartSession({
        bodyPartId: selectedBodyPart,
        durationMinutes: selectedDuration,
        level: selectedLevel,
        lowImpact: lowImpactOnly,
        catalogExercises: combinedCatalog,
        userWeightKg: user?.currentWeight || 75,
      }),
    [selectedBodyPart, selectedDuration, selectedLevel, lowImpactOnly, combinedCatalog, user?.currentWeight]
  );

  const completedDays = wellnessToday?.challengeDaysCompleted || [1, 2, 3, 4];

  const handleSelectLevel = (lvl) => {
    if (lvl === 'Advanced' && !hasPaidPlan) {
      openPlanUpgradeModal('Switch from Free to a Paid Plan to unlock Advanced intensity workouts.');
      return;
    }
    setSelectedLevel(lvl);
  };

  const launchBuiltSession = (dayNumber = null) => {
    if (selectedLevel === 'Advanced' && !hasPaidPlan) {
      openPlanUpgradeModal('Switch from Free to a Paid Plan to launch Advanced guided sessions.');
      return;
    }
    setActiveGuidedSession({
      ...builtSession,
      routineTitle: dayNumber ? `Day ${dayNumber}: ${builtSession.title}` : builtSession.title,
      challengeDayNumber: dayNumber,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-500/15 via-amber-500/10 to-obsidian-900 border border-amber-500/25 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <Flame className="w-3 h-3" /> 30-Min HIIT Cardio &amp; Body Parts
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Mic className="w-3 h-3" /> Voice Coach Guided
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pick Your Body Part &amp; Duration
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Follow beginner-friendly guided exercises with step-by-step animation demos and live voice cues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedBodyPart('hiit_cardio');
                setSelectedDuration(30);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold hover:bg-rose-500/30 transition"
            >
              ⚡ 30m HIIT Cardio
            </button>
            <button
              type="button"
              onClick={() => setIsCustomPlanModalOpen?.(true)}
              className="gold-btn-outline px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Custom Plan</span>
            </button>
          </div>
        </div>

        {/* STEP 1: BODY PART SELECTOR */}
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
            1 · Body Part or Cardio
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BODY_PART_SETS.map((part) => {
              const active = selectedBodyPart === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSelectedBodyPart(part.id)}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 bg-gradient-to-br ${part.accent} ${
                    active ? 'ring-2 ring-amber-400 shadow-gold-glow-sm' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{part.icon}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-white mt-1">{part.label}</div>
                  <div className="text-[10px] text-slate-300 line-clamp-1">{part.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: DURATION + LEVEL + KNEE SAFE TOGGLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 2 · Workout Duration
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d.minutes}
                  type="button"
                  onClick={() => setSelectedDuration(d.minutes)}
                  className={`py-2 px-1 rounded-xl text-center border transition ${
                    selectedDuration === d.minutes
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-300 font-black shadow-gold-glow-sm'
                      : 'bg-obsidian-900 text-slate-300 border-white/10 hover:border-amber-500/35'
                  }`}
                >
                  <div className="text-xs font-black">{d.label}</div>
                  <div className={`text-[9px] ${selectedDuration === d.minutes ? 'text-black/75' : 'text-slate-400'}`}>
                    {d.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> 3 · Level {(!hasPaidPlan) && '(Free: Beginner & Inter.)'}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                const locked = lvl === 'Advanced' && !hasPaidPlan;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSelectLevel(lvl)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                      selectedLevel === lvl
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                        : locked
                        ? 'bg-black/40 border-amber-500/25 text-amber-300/80 hover:border-amber-400'
                        : 'bg-obsidian-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {locked && <Lock className="w-3 h-3 shrink-0" />}
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No-Jumping Mode
              </span>
              <button
                type="button"
                onClick={() => setLowImpactOnly((p) => !p)}
                className={`px-3 py-1 rounded-full text-[11px] font-black border transition ${
                  lowImpactOnly
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {lowImpactOnly ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => launchBuiltSession(null)}
              className="gold-btn w-full py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold-glow active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                Start {selectedDuration}-Min Session (~{builtSession.estimatedCalories} kcal)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* GENERATED SESSION INTERVALS PREVIEW */}
      <div className="p-5 rounded-3xl bg-obsidian-850/90 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              {builtSession.badge}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">{builtSession.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
              🔥 ~{builtSession.estimatedCalories} kcal
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold">
              {builtSession.exercises.length} Exercises
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {builtSession.exercises.map((ex, idx) => {
            const isItemLocked = ex.level === 'Advanced' && !hasPaidPlan;
            return (
              <div
                key={ex.sessionItemId || `${ex.id}-${idx}`}
                onClick={() => {
                  if (isItemLocked) {
                    openPlanUpgradeModal(`Switch to Paid Plan to unlock "${ex.name}"`);
                    return;
                  }
                  setSelectedExerciseModal(ex);
                }}
                className="p-3 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-400/50 transition cursor-pointer flex items-center gap-3 group"
              >
                <div className="w-16 h-16 rounded-xl bg-[#07090d] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center relative">
                  <img
                    src={ex.gifUrl || ex.fallbackGif || SAFE_HIIT_FALLBACK}
                    alt={ex.name}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fb) {
                        e.currentTarget.dataset.fb = '1';
                        e.currentTarget.src = ex.fallbackGif || SAFE_HIIT_FALLBACK;
                      }
                    }}
                    className="w-full h-full object-contain dark-3d-animation"
                    loading="lazy"
                  />
                  {isItemLocked && (
                    <span className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400">#{idx + 1}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 truncate">
                      {ex.phaseLabel}
                    </span>
                    {isItemLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Pro
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate mt-0.5">
                    {ex.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {ex.defaultDuration || '40 Sec'} · {ex.muscleCategory}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-DAY CHALLENGE CALENDAR & BADGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5 rounded-3xl bg-obsidian-850/90 border border-amber-500/20 space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 30-Day Challenge Calendar
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Tap any day to begin ({completedDays.length}/30 Completed)
            </h3>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {Array.from({ length: 30 }, (_, idx) => idx + 1).map((day) => {
              const isDone = completedDays.includes(day);
              const isRest = day % 4 === 0;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => launchBuiltSession(day)}
                  className={`p-2 rounded-xl border text-center transition active:scale-95 ${
                    isDone
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                      : isRest
                      ? 'bg-sky-500/10 border-sky-500/25 text-sky-300'
                      : 'bg-black/45 border-white/10 text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">Day {day}</div>
                  <div className="text-xs font-black mt-0.5">
                    {isDone ? '✓ Done' : isRest ? 'Rest' : '▶ Go'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-obsidian-850/90 border border-white/10 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Milestones
          </span>
          <h3 className="text-sm sm:text-base font-black text-white">Daily Streaks</h3>
          <div className="space-y-2">
            {LEAP_ACHIEVEMENT_BADGES.map((badge) => {
              const unlocked = completedDays.length >= badge.reqDays;
              return (
                <div
                  key={badge.id}
                  className={`p-2.5 rounded-2xl border flex items-center gap-3 text-xs ${
                    unlocked
                      ? 'bg-amber-500/15 border-amber-400/40 text-white'
                      : 'bg-black/40 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="text-lg">{badge.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {unlocked && <Award className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400">{badge.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedExerciseModal && (
        <WorkoutDetailModal
          exercise={selectedExerciseModal}
          onClose={() => setSelectedExerciseModal(null)}
        />
      )}
    </div>
  );
}
export default HiitAndBodyPartStudio;
