import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Sun,
  Smile,
  Activity,
  Heart,
  Play,
  RotateCcw,
  CheckCircle2,
  Wind,
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  CircleDot,
} from 'lucide-react';
import { YOGA_AND_HOME_WORKOUTS } from '../../data/yogaAndHomeWorkouts';
import { GuidedWorkoutPlayerModal } from './GuidedWorkoutPlayerModal';
import { WorkoutDetailModal } from './WorkoutDetailModal';

export function YogaSanctuaryHub() {
  // Sanctuary section: 'yoga_mat' | 'exercise_ball' | 'face_yoga'
  const [selectedStudio, setSelectedStudio] = useState('yoga_mat');
  // Level filter: 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  const [selectedLevel, setSelectedLevel] = useState('all');
  // Guided session runner state
  const [guidedPlan, setGuidedPlan] = useState(null);
  // Detail modal state
  const [selectedPose, setSelectedPose] = useState(null);

  // Pranayama Breathwave widget state
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale -> Hold -> Exhale -> Hold
  const [breathSeconds, setBreathSeconds] = useState(4);

  // Synchronize 4-4-4-4 Pranayama Box Breathing rhythm
  useEffect(() => {
    const phases = ['Inhale (Expand)', 'Hold (Retain)', 'Exhale (Release)', 'Hold (Stillness)'];
    let phaseIndex = 0;
    let sec = 4;

    const interval = setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        setBreathPhase(phases[phaseIndex]);
        sec = 4;
      }
      setBreathSeconds(sec);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filtered routines based on studio and level
  const studioRoutines = useMemo(() => {
    return YOGA_AND_HOME_WORKOUTS.filter((item) => {
      const matchStudio = item.subCategory === selectedStudio;
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      return matchStudio && matchLevel;
    });
  }, [selectedStudio, selectedLevel]);

  // Counts for tabs
  const matCount = useMemo(() => YOGA_AND_HOME_WORKOUTS.filter((e) => e.subCategory === 'yoga_mat').length, []);
  const ballCount = useMemo(() => YOGA_AND_HOME_WORKOUTS.filter((e) => e.subCategory === 'exercise_ball').length, []);
  const faceCount = useMemo(() => YOGA_AND_HOME_WORKOUTS.filter((e) => e.subCategory === 'face_yoga').length, []);

  const handleStartStudioSession = () => {
    const routineTitle =
      selectedStudio === 'yoga_mat'
        ? 'Yoga Mat Flow: Full Body Vinyasa'
        : selectedStudio === 'exercise_ball'
        ? 'Stability Ball: Spinal Decompression & Core'
        : 'Face Yoga: 8-Min Jawline & Anti-Aging Sculpt';

    const routineBadge =
      selectedStudio === 'yoga_mat'
        ? 'Yoga Mat Sanctuary'
        : selectedStudio === 'exercise_ball'
        ? 'Stability Ball Studio'
        : 'Face Yoga Facial Sculpt';

    const exercises = studioRoutines.slice(0, 8);

    setGuidedPlan({
      title: routineTitle,
      badge: routineBadge,
      exercises,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HERO ZEN SANCTUARY BANNER */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-obsidian-850 to-amber-950/40 border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Sun className="w-3 h-3 text-emerald-400" />
                No Gym Machinery
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Yoga Mat · Stability Ball · Face Yoga
              </span>
              <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                {YOGA_AND_HOME_WORKOUTS.length} Certified Routines
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Holistic Yoga & Face Sanctuary
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              True yoga is never practiced on gym machines. Unroll your non-slip mat, sit upon your stability ball, or practice facial fascia sculpt with mindful Ujjayi breathing.
            </p>
          </div>

          {/* Quick Action Start Flow */}
          <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0">
            <button
              onClick={handleStartStudioSession}
              className="gold-btn py-3 px-6 rounded-2xl text-sm font-black shadow-gold-glow flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 15-Min Flow</span>
            </button>
            <span className="text-[10px] text-center text-slate-400 font-mono">
              8 Poses · Diaphragmatic Breathwave
            </span>
          </div>
        </div>
      </div>

      {/* 2. PRANAYAMA BREATHWAVE LIVE SYNC BAR */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Wind className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Live Pranayama Breathwave
            </span>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{breathPhase}</span>
              <span className="font-mono text-emerald-300 font-extrabold bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-500/30">
                0{breathSeconds}s
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
          <span>4-4-4-4 Box Breath Rhythm for Parasympathetic Calm</span>
        </div>
      </div>

      {/* 3. THREE DEDICATED STUDIO ROOMS (MAT, BALL & FACE) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Choose Sanctuary Studio Room:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Room 1: Yoga Mat */}
          <button
            onClick={() => setSelectedStudio('yoga_mat')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] flex items-start gap-3.5 ${
              selectedStudio === 'yoga_mat'
                ? 'bg-gradient-to-br from-amber-500/20 to-obsidian-900 border-amber-400 shadow-gold-glow-sm ring-2 ring-amber-400'
                : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0 font-extrabold text-xl shadow-inner">
              🧘‍♀️
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">Yoga Mat Asanas</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-bold">
                  {matCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Surya Namaskar, Warrior flows, Downward Dog, and restorative Yin poses on non-slip mat.
              </p>
              <span className="text-[10px] text-amber-400 font-bold block pt-1">
                Equipment: Non-Slip Yoga Mat
              </span>
            </div>
          </button>

          {/* Room 2: Stability Ball */}
          <button
            onClick={() => setSelectedStudio('exercise_ball')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] flex items-start gap-3.5 ${
              selectedStudio === 'exercise_ball'
                ? 'bg-gradient-to-br from-emerald-500/20 to-obsidian-900 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400'
                : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 font-extrabold text-xl shadow-inner">
              ⚪
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">Stability Ball Yoga</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-emerald-300 font-bold">
                  {ballCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Spinal decompression, ball child pose stretches, pelvic rocks, and heart openers.
              </p>
              <span className="text-[10px] text-emerald-400 font-bold block pt-1">
                Equipment: 55-65cm Stability Ball
              </span>
            </div>
          </button>

          {/* Room 3: Face Yoga */}
          <button
            onClick={() => setSelectedStudio('face_yoga')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] flex items-start gap-3.5 ${
              selectedStudio === 'face_yoga'
                ? 'bg-gradient-to-br from-purple-500/20 to-obsidian-900 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-2 ring-purple-400'
                : 'bg-obsidian-900/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 font-extrabold text-xl shadow-inner">
              ✨
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">Face Yoga & Sculpt</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-purple-300 font-bold">
                  {faceCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Mandibular jawline sculpt, cheek volume, double chin erase & lymphatic drainage.
              </p>
              <span className="text-[10px] text-purple-400 font-bold block pt-1">
                Equipment: Hands, Breath & Mirror
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. LEVEL FILTER PILLS */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border ${
                selectedLevel === lvl
                  ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow-sm'
                  : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'All Difficulty Levels' : lvl}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono shrink-0">
          {studioRoutines.length} Routines
        </span>
      </div>

      {/* 5. ROUTINE LISTING CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {studioRoutines.map((pose) => (
          <div
            key={pose.id}
            onClick={() => setSelectedPose(pose)}
            className="p-4 rounded-2xl bg-obsidian-850 border border-white/10 hover:border-amber-400/50 transition duration-200 cursor-pointer group flex flex-col justify-between space-y-3 shadow-md active:scale-[0.99]"
          >
            <div className="flex items-start gap-3.5">
              {/* 3D Motion Preview Stage */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-black/80 overflow-hidden border border-white/5 shrink-0 flex items-center justify-center p-1.5">
                <img
                  src={pose.gifUrl}
                  alt={pose.name}
                  onError={(e) => {
                    if (!e.currentTarget.dataset.err) {
                      e.currentTarget.dataset.err = 'true';
                      e.currentTarget.src =
                        'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif';
                    }
                  }}
                  className="w-full h-full object-contain dark-3d-animation group-hover:scale-105 transition"
                  loading="lazy"
                />
              </div>

              {/* Title, Sanskrit & Equipment Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pose.equipmentLabel}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {pose.level}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition mt-1 truncate">
                  {pose.name}
                </h4>

                {pose.sanskritName && (
                  <span className="text-[11px] text-amber-400/90 font-serif italic block truncate">
                    {pose.sanskritName}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              {pose.tagline}
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {pose.environment}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-0.5 transition">
                <span>View Asana</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. GUIDED SESSION RUNNER MODAL */}
      {guidedPlan && (
        <GuidedWorkoutPlayerModal
          isOpen={!!guidedPlan}
          onClose={() => setGuidedPlan(null)}
          routineTitle={guidedPlan.title}
          planBadge={guidedPlan.badge}
          exercises={guidedPlan.exercises}
        />
      )}

      {/* 7. ASANA DETAIL & BIOMECHANICAL INSPECTION MODAL */}
      {selectedPose && (
        <WorkoutDetailModal
          exercise={selectedPose}
          onClose={() => setSelectedPose(null)}
        />
      )}
    </div>
  );
}
