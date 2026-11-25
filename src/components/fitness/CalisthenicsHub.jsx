import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Activity,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  CircleDot,
  Dumbbell,
} from 'lucide-react';
import { CALISTHENICS_EXERCISES } from '../../data/calisthenicsExercises';
import { GuidedWorkoutPlayerModal } from './GuidedWorkoutPlayerModal';
import { WorkoutDetailModal } from './WorkoutDetailModal';

export function CalisthenicsHub() {
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [guidedPlan, setGuidedPlan] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const filteredExercises = useMemo(() => {
    return CALISTHENICS_EXERCISES.filter((item) => {
      const matchTier =
        selectedTier === 'all' ||
        (selectedTier === 'tier1' && item.tier.includes('Tier 1')) ||
        (selectedTier === 'tier2' && item.tier.includes('Tier 2')) ||
        (selectedTier === 'tier3' && item.tier.includes('Tier 3'));
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      return matchTier && matchLevel;
    });
  }, [selectedTier, selectedLevel]);

  const tier1Count = useMemo(() => CALISTHENICS_EXERCISES.filter((e) => e.tier.includes('Tier 1')).length, []);
  const tier2Count = useMemo(() => CALISTHENICS_EXERCISES.filter((e) => e.tier.includes('Tier 2')).length, []);
  const tier3Count = useMemo(() => CALISTHENICS_EXERCISES.filter((e) => e.tier.includes('Tier 3')).length, []);

  const handleStartCalisthenicsSession = () => {
    const routineTitle =
      selectedTier === 'tier3'
        ? 'Elite Calisthenic Gymnastic Mastery'
        : selectedTier === 'tier2'
        ? 'Bar & Parallel Pull-Dip Progression'
        : 'Foundational Calisthenic Kinetic Chain';

    const exercises = filteredExercises.slice(0, 8);

    setGuidedPlan({
      title: routineTitle,
      badge: 'Calisthenics Street Workout',
      exercises,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HERO CALISTHENICS PARK BANNER */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/60 via-obsidian-850 to-orange-950/40 border border-amber-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Zero Gym Machinery
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Bodyweight · Bars · Rings · Levers
              </span>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                {CALISTHENICS_EXERCISES.length} Certified Movements
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Calisthenics & Relative Power Studio
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Master your own bodyweight with progressive gymnastic strength. From foundational push-ups and chair dips to advanced pull-ups, L-sits, dragon flags, and full planche holds.
            </p>
          </div>

          {/* Quick Action Start Flow */}
          <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0">
            <button
              onClick={handleStartCalisthenicsSession}
              className="gold-btn py-3 px-6 rounded-2xl text-sm font-black shadow-gold-glow flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Calisthenics Flow</span>
            </button>
            <span className="text-[10px] text-center text-slate-400 font-mono">
              8 Progressive Sets · Scapular Lock
            </span>
          </div>
        </div>
      </div>

      {/* 2. TIER SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {[
            { id: 'all', label: `All Moves (${CALISTHENICS_EXERCISES.length})`, icon: '🤸' },
            { id: 'tier1', label: `Foundations (${tier1Count})`, icon: '⚡' },
            { id: 'tier2', label: `Bar & Dips (${tier2Count})`, icon: '💪' },
            { id: 'tier3', label: `Elite Static Holds (${tier3Count})`, icon: '👑' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedTier === tier.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm'
                  : 'bg-obsidian-850 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{tier.icon}</span>
              <span>{tier.label}</span>
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 shrink-0">
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                selectedLevel === lvl
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'All Tiers' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CALISTHENICS MOVEMENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="p-4 rounded-3xl bg-obsidian-850/90 border border-white/10 hover:border-amber-400/50 hover:bg-obsidian-800 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-3 shadow-lg active:scale-[0.98]"
          >
            <div className="space-y-3">
              {/* 3D Motion Stage */}
              <div className="relative w-full h-44 rounded-2xl bg-black/70 overflow-hidden border border-white/5 flex items-center justify-center p-2 group-hover:border-amber-500/30 transition">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
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
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/80 border border-amber-500/40 text-amber-300 backdrop-blur-md">
                    {exercise.badge}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/80 text-amber-400 border border-white/10 group-hover:bg-amber-500 group-hover:text-black transition shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  {exercise.tier}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-1 mt-0.5">
                  {exercise.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {exercise.tagline}
                </p>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">⚡ {exercise.primaryMuscles[0]?.name || 'Relative Power'}</span>
              <span className="font-mono text-amber-300 font-bold shrink-0">
                MET {exercise.metScore} · {exercise.defaultReps}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Guided Workout Runner Modal */}
      {guidedPlan && (
        <GuidedWorkoutPlayerModal
          planTitle={guidedPlan.title}
          planBadge={guidedPlan.badge}
          exercises={guidedPlan.exercises}
          onClose={() => setGuidedPlan(null)}
        />
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <WorkoutDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
