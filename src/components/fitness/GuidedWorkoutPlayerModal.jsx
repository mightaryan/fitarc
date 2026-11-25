import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Heart,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { YogaAnatomicalCanvas } from './YogaAnatomicalCanvas';

// Simple Web Audio API Synthesizer for workout beeps & chimes (Zero external assets needed)
const playSoundCue = (type = 'beep') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'beep') {
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'go') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'cheer') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.5); // C6
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    // Audio context silently ignored if blocked by browser policy
  }
};

export function GuidedWorkoutPlayerModal({
  isOpen,
  onClose,
  routineTitle = 'Lose Belly Fat - Day 5',
  planBadge = '30-Day Trouble Zone',
  exercises = [],
  restDurationSeconds = 15,
  isLowImpact = false,
}) {
  const { logWorkout, triggerConfetti } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('workout'); // 'get_ready' | 'workout' | 'rest' | 'complete'
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [heartRate, setHeartRate] = useState(128);

  const currentExercise = exercises[currentIndex] || null;
  const nextExercise = exercises[currentIndex + 1] || null;

  // Exercise duration calculation
  const getExerciseTargetSeconds = (ex) => {
    if (!ex) return 30;
    if (ex.defaultDuration && ex.defaultDuration.includes('Sec')) {
      const num = parseInt(ex.defaultDuration);
      if (!isNaN(num)) return num;
    }
    return 30;
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      setCurrentIndex(0);
      setPhase('get_ready');
      setSecondsRemaining(5);
      setTotalSecondsElapsed(0);
      setIsPlaying(true);
      if (!isMuted) playSoundCue('beep');
    }
  }, [isOpen, exercises]);

  // Main timer tick
  useEffect(() => {
    if (!isOpen || !isPlaying || phase === 'complete') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        // Sound cue at 3, 2, 1 seconds
        if (prev <= 4 && prev > 1 && !isMuted) {
          playSoundCue('beep');
        }
        return prev - 1;
      });

      if (phase === 'workout') {
        setTotalSecondsElapsed((prev) => prev + 1);
        // Realistic simulated workout heart rate variance
        setHeartRate((prev) => Math.min(168, Math.max(118, prev + Math.floor(Math.random() * 3 - 1))));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, phase, currentIndex, isMuted, exercises]);

  const handlePhaseTransition = () => {
    if (phase === 'get_ready') {
      // Start exercise 1
      if (!isMuted) playSoundCue('go');
      setPhase('workout');
      setSecondsRemaining(getExerciseTargetSeconds(currentExercise));
    } else if (phase === 'workout') {
      if (!isMuted) playSoundCue('go');
      if (currentIndex + 1 < exercises.length) {
        // Go to rest
        setPhase('rest');
        setSecondsRemaining(restDurationSeconds);
      } else {
        // All exercises complete!
        handleCompleteWorkout();
      }
    } else if (phase === 'rest') {
      if (!isMuted) playSoundCue('go');
      // Advance to next exercise
      setCurrentIndex((prev) => prev + 1);
      setPhase('workout');
      const nextEx = exercises[currentIndex + 1];
      setSecondsRemaining(getExerciseTargetSeconds(nextEx));
    }
  };

  const handleSkipForward = () => {
    if (phase === 'rest') {
      setCurrentIndex((prev) => prev + 1);
      setPhase('workout');
      const nextEx = exercises[currentIndex + 1];
      setSecondsRemaining(getExerciseTargetSeconds(nextEx));
    } else if (currentIndex + 1 < exercises.length) {
      setPhase('rest');
      setSecondsRemaining(restDurationSeconds);
    } else {
      handleCompleteWorkout();
    }
  };

  const handleSkipBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setPhase('workout');
      setSecondsRemaining(getExerciseTargetSeconds(exercises[currentIndex - 1]));
    } else {
      setSecondsRemaining(getExerciseTargetSeconds(currentExercise));
    }
  };

  const handleCompleteWorkout = () => {
    setPhase('complete');
    setIsPlaying(false);
    if (!isMuted) playSoundCue('cheer');
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#f43f5e', '#ffffff'],
      });
    } catch (e) {}

    // Auto-log to today's workouts in AppContext
    const totalMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    const estimatedBurn = Math.round(totalMinutes * 7.5);

    logWorkout({
      exerciseName: routineTitle,
      category: 'calisthenics',
      durationMinutes: totalMinutes,
      intensity: 'high',
      caloriesBurned: estimatedBurn,
      muscleGrowthScore: 48,
      primaryMuscles: ['Core & Transverse', 'Pectoralis Major', 'Full Body Conditioning'],
    });
  };

  if (!isOpen) return null;

  const totalExercisesCount = exercises.length;
  const progressPercent =
    totalExercisesCount > 0 ? Math.round(((currentIndex + (phase === 'complete' ? 1 : 0)) / totalExercisesCount) * 100) : 0;

  const totalMin = Math.floor(totalSecondsElapsed / 60);
  const totalSec = totalSecondsElapsed % 60;
  const formattedElapsed = `${totalMin}:${totalSec < 10 ? '0' : ''}${totalSec}`;

  const currentSecondsTotal =
    phase === 'get_ready' ? 5 : phase === 'rest' ? restDurationSeconds : getExerciseTargetSeconds(currentExercise);
  const ringProgress = currentSecondsTotal > 0 ? (secondsRemaining / currentSecondsTotal) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-full sm:h-auto sm:max-h-[95vh] bg-[#08090C] sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 bg-obsidian-900/90 border-b border-amber-500/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Exit Workout"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  {planBadge}
                </span>
                {isLowImpact && (
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    No Jumping Mode
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-white tracking-tight leading-none mt-0.5">
                {routineTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-white/10 transition"
              title={isMuted ? 'Unmute Sound Cues' : 'Mute Sound Cues'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Live Simulated Heart Rate Monitor */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
              <span>{heartRate} <span className="text-[9px] text-slate-400 font-normal">BPM</span></span>
            </div>
          </div>
        </div>

        {/* Progress Bar Across Top */}
        <div className="w-full h-1.5 bg-slate-800 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* ======================================================== */}
        {/* PHASE: WORKOUT COMPLETE SUMMARY */}
        {/* ======================================================== */}
        {phase === 'complete' ? (
          <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-bounce">
              <Award className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Session Accomplished!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Outstanding Effort!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                You crushed all {totalExercisesCount} zero-equipment exercises. Your today's Activity Rings & streak have been credited!
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-amber-500/20 text-center">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-lg font-black text-amber-300 block">
                  ~{Math.round(Math.max(1, Math.round(totalSecondsElapsed / 60)) * 7.5)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Calories Burned</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-amber-500/20 text-center">
                <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-lg font-black text-emerald-300 block">{formattedElapsed}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-amber-500/20 text-center">
                <CheckCircle2 className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <span className="text-lg font-black text-sky-300 block">{totalExercisesCount} / {totalExercisesCount}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Exercises Done</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="gold-btn w-full max-w-md py-3.5 rounded-2xl text-sm font-black shadow-gold-glow uppercase tracking-wider"
            >
              Finish & Return to Hub
            </button>
          </div>
        ) : (
          /* ======================================================== */
          /* PHASE: ACTIVE RUNNER OR REST INTERVAL */
          /* ======================================================== */
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Exercise Counter & Title */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Exercise {currentIndex + 1} of {totalExercisesCount}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {phase === 'rest' ? 'Rest Interval' : currentExercise?.name || 'Home Exercise'}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  Total Time: {formattedElapsed}
                </span>
                <span className="text-[10px] text-slate-400">
                  {phase === 'workout' ? currentExercise?.defaultReps || '30s Work' : 'Breathe & Reset'}
                </span>
              </div>
            </div>

            {/* 3D Motion Stage */}
            <div className="relative w-full h-56 sm:h-72 rounded-3xl bg-black/60 border border-white/10 flex items-center justify-center p-3 overflow-hidden shadow-inner">
              {phase === 'rest' ? (
                /* Rest Stage */
                <div className="text-center space-y-3 p-4 animate-in fade-in duration-200">
                  <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono animate-pulse">
                    00:{secondsRemaining < 10 ? '0' : ''}{secondsRemaining}
                  </div>
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
                    Take a deep breath & hydrate
                  </span>

                  {nextExercise && (
                    <div className="p-3 rounded-2xl bg-obsidian-850 border border-white/10 max-w-sm mx-auto flex items-center gap-3 text-left">
                      {(nextExercise.category === 'face_yoga' || nextExercise.subCategory === 'face_yoga' || nextExercise.equipment === 'face_hands') ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#08090C] shrink-0">
                          <YogaAnatomicalCanvas exercise={nextExercise} compact />
                        </div>
                      ) : (
                        <img
                          src={nextExercise.gifUrl}
                          alt={nextExercise.name}
                          className="w-12 h-12 rounded-xl object-contain dark-3d-animation bg-black/80 shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                          Next Up:
                        </span>
                        <div className="text-xs font-bold text-white truncate">{nextExercise.name}</div>
                        <span className="text-[10px] text-slate-400">{nextExercise.defaultReps || '30s'}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSkipForward}
                    className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition active:scale-95"
                  >
                    Skip Rest (+20s)
                  </button>
                </div>
              ) : (
                /* Active Exercise 3D Stage */
                <div className="relative w-full h-full flex items-center justify-center">
                  {(currentExercise?.category === 'face_yoga' || currentExercise?.subCategory === 'face_yoga' || currentExercise?.equipment === 'face_hands') ? (
                    <YogaAnatomicalCanvas exercise={currentExercise} />
                  ) : (
                    <img
                      src={currentExercise?.gifUrl}
                      alt={currentExercise?.name}
                      onError={(e) => {
                        if (!e.currentTarget.dataset.fallback) {
                          e.currentTarget.dataset.fallback = 'true';
                          e.currentTarget.src =
                            currentExercise?.subCategory === 'exercise_ball' || currentExercise?.equipment === 'exercise_ball'
                              ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/back-extension-on-exercise-ball.gif'
                              : currentExercise?.category === 'yoga' || currentExercise?.equipment === 'yogamat'
                              ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif'
                              : 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif';
                        }
                      }}
                      className="w-full h-full object-contain dark-3d-animation"
                    />
                  )}

                  {/* Countdown Overlay Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-base font-black flex items-center gap-1.5 shadow-xl">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>00:{secondsRemaining < 10 ? '0' : ''}{secondsRemaining}</span>
                  </div>

                  {/* Muscle Target Tag */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-200">
                    Target: {currentExercise?.muscleCategory || 'Core'}
                  </div>
                </div>
              )}
            </div>

            {/* Form Cue Callout */}
            {phase === 'workout' && currentExercise?.proTip && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200 leading-snug">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300 font-bold">Trainer Tip: </strong>
                  {currentExercise.proTip}
                </span>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between gap-4 pt-2 shrink-0">
              {/* Previous */}
              <button
                onClick={handleSkipBack}
                disabled={currentIndex === 0 && phase === 'workout'}
                className="p-3.5 rounded-2xl bg-obsidian-850 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95 disabled:opacity-40"
                title="Previous Exercise"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Big Play / Pause Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm tracking-wide shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>RESUME</span>
                  </>
                )}
              </button>

              {/* Next / Skip */}
              <button
                onClick={handleSkipForward}
                className="p-3.5 rounded-2xl bg-obsidian-850 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95"
                title="Skip Exercise"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
