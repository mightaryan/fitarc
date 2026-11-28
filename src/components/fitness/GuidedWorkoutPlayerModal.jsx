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
  Mic,
  MicOff,
  Plus,
  Video,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

// Simple Web Audio API Synthesizer for workout beeps & chimes
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
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === 'go') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'cheer') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.55);
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
  challengeDayNumber = null,
}) {
  const { logWorkout, completeChallengeDay } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('workout'); // 'get_ready' | 'workout' | 'rest' | 'complete'
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  const [coachSubtitle, setCoachSubtitle] = useState('');
  const [heartRate, setHeartRate] = useState(128);
  const halfwaySpokenRef = useRef(-1);

  const currentExercise = exercises[currentIndex] || null;
  const nextExercise = exercises[currentIndex + 1] || null;

  const speakCoachCue = (text) => {
    if (!text) return;
    setCoachSubtitle(text);
    if (isMuted || !voiceCoachEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.03;
      utter.pitch = 1.0;
      utter.volume = 0.9;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // ignore speech synthesis restrictions
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Exercise duration calculation
  const getExerciseTargetSeconds = (ex) => {
    if (!ex) return 30;
    if (ex.defaultDuration && String(ex.defaultDuration).toLowerCase().includes('sec')) {
      const num = parseInt(ex.defaultDuration, 10);
      if (!isNaN(num)) return num;
    }
    return 35;
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      setCurrentIndex(0);
      setPhase('get_ready');
      setSecondsRemaining(5);
      setTotalSecondsElapsed(0);
      setIsPlaying(true);
      halfwaySpokenRef.current = -1;
      if (!isMuted) playSoundCue('beep');
      speakCoachCue(
        `Get ready! Starting with ${exercises[0]?.name || 'Warm Up'}. ${exercises[0]?.voiceCue || ''}`
      );
    } else if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen, exercises]);

  // Halfway coach encouragement
  useEffect(() => {
    if (!isOpen || phase !== 'workout' || !currentExercise) return;
    const targetSec = getExerciseTargetSeconds(currentExercise);
    if (
      targetSec >= 24 &&
      secondsRemaining === Math.floor(targetSec / 2) &&
      halfwaySpokenRef.current !== currentIndex
    ) {
      halfwaySpokenRef.current = currentIndex;
      speakCoachCue(`Halfway through ${currentExercise.name}! Stay strong and keep breathing.`);
    }
  }, [secondsRemaining, phase, currentIndex, isOpen, currentExercise]);

  // Main timer tick
  useEffect(() => {
    if (!isOpen || !isPlaying || phase === 'complete') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        if (prev <= 4 && prev > 1 && !isMuted) {
          playSoundCue('beep');
        }
        return prev - 1;
      });

      if (phase === 'workout') {
        setTotalSecondsElapsed((prev) => prev + 1);
        setHeartRate((prev) => Math.min(172, Math.max(118, prev + Math.floor(Math.random() * 3 - 1))));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, phase, currentIndex, isMuted, voiceCoachEnabled, exercises]);

  const handlePhaseTransition = () => {
    if (phase === 'get_ready') {
      if (!isMuted) playSoundCue('go');
      setPhase('workout');
      const sec = getExerciseTargetSeconds(currentExercise);
      setSecondsRemaining(sec);
      speakCoachCue(
        `Begin ${currentExercise?.name}! ${currentExercise?.voiceCue || currentExercise?.proTip || 'Keep crisp form.'}`
      );
    } else if (phase === 'workout') {
      if (!isMuted) playSoundCue('go');
      if (currentIndex + 1 < exercises.length) {
        setPhase('rest');
        setSecondsRemaining(restDurationSeconds);
        speakCoachCue(
          `Rest for ${restDurationSeconds} seconds. Next up: ${nextExercise?.name || 'Next exercise'}.`
        );
      } else {
        handleCompleteWorkout();
      }
    } else if (phase === 'rest') {
      if (!isMuted) playSoundCue('go');
      const nextIdx = currentIndex + 1;
      const nextEx = exercises[nextIdx];
      setCurrentIndex(nextIdx);
      setPhase('workout');
      setSecondsRemaining(getExerciseTargetSeconds(nextEx));
      speakCoachCue(
        `Go! ${nextEx?.name || 'Next exercise'}. ${nextEx?.voiceCue || nextEx?.proTip || 'Maintain steady breath.'}`
      );
    }
  };

  const handleSkipForward = () => {
    if (phase === 'rest') {
      const nextIdx = currentIndex + 1;
      const nextEx = exercises[nextIdx];
      setCurrentIndex(nextIdx);
      setPhase('workout');
      setSecondsRemaining(getExerciseTargetSeconds(nextEx));
      speakCoachCue(`Go! ${nextEx?.name}. ${nextEx?.voiceCue || ''}`);
    } else if (currentIndex + 1 < exercises.length) {
      setPhase('rest');
      setSecondsRemaining(restDurationSeconds);
      speakCoachCue(`Quick rest. Next up: ${nextExercise?.name}.`);
    } else {
      handleCompleteWorkout();
    }
  };

  const handleSkipBack = () => {
    if (currentIndex > 0) {
      const prevEx = exercises[currentIndex - 1];
      setCurrentIndex((prev) => prev - 1);
      setPhase('workout');
      setSecondsRemaining(getExerciseTargetSeconds(prevEx));
      speakCoachCue(`Restarting ${prevEx?.name}.`);
    } else {
      setSecondsRemaining(getExerciseTargetSeconds(currentExercise));
    }
  };

  const handleCompleteWorkout = () => {
    setPhase('complete');
    setIsPlaying(false);
    if (!isMuted) playSoundCue('cheer');
    speakCoachCue(`Incredible finish! You completed all ${exercises.length} guided intervals.`);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#f43f5e', '#ffffff'],
      });
    } catch (e) {}

    const totalMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    const avgMet = exercises.reduce((s, e) => s + (Number(e.metScore) || 8.0), 0) / (exercises.length || 1);
    const estimatedBurn = Math.round(totalMinutes * avgMet * 1.1);

    logWorkout({
      exerciseName: routineTitle,
      category: 'cardio',
      durationMinutes: totalMinutes,
      intensity: 'high',
      caloriesBurned: estimatedBurn,
      muscleGrowthScore: 52,
      primaryMuscles: ['Core & Transverse', 'Cardiovascular Engine', 'Full Body Conditioning'],
    });
    if (challengeDayNumber && completeChallengeDay) {
      completeChallengeDay(challengeDayNumber);
    }
  };

  if (!isOpen) return null;

  const totalExercisesCount = exercises.length;
  const progressPercent =
    totalExercisesCount > 0 ? Math.round(((currentIndex + (phase === 'complete' ? 1 : 0)) / totalExercisesCount) * 100) : 0;

  const totalMin = Math.floor(totalSecondsElapsed / 60);
  const totalSec = totalSecondsElapsed % 60;
  const formattedElapsed = `${totalMin}:${totalSec < 10 ? '0' : ''}${totalSec}`;
  const liveBurnEstimate = Math.max(1, Math.round((totalSecondsElapsed / 60) * 9.5));

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-0 sm:p-4 bg-black/92 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[95vh] bg-[#08090C] sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-obsidian-900/95 border-b border-amber-500/15 shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
              aria-label="Exit Workout"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  {planBadge}
                </span>
                {isLowImpact && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Knee Safe
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight truncate mt-0.5">
                {routineTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextVal = !voiceCoachEnabled;
                setVoiceCoachEnabled(nextVal);
                if (!nextVal && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition ${
                voiceCoachEnabled && !isMuted
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
              title="Toggle Voice Coach Instructions"
            >
              {voiceCoachEnabled && !isMuted ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Voice Coach</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-white/10 transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
              <span>{heartRate}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

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
                Completed {totalExercisesCount} voice-guided intervals. Today&apos;s Activity Rings, Health Points, and challenge streak are updated!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-amber-500/20 text-center">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-lg font-black text-amber-300 block">
                  ~{Math.max(25, liveBurnEstimate)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">kcal Burned</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-amber-500/20 text-center">
                <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-lg font-black text-emerald-300 block">{formattedElapsed}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Time</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-amber-500/20 text-center">
                <CheckCircle2 className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <span className="text-lg font-black text-sky-300 block">{totalExercisesCount} / {totalExercisesCount}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Intervals</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="gold-btn w-full max-w-md py-3.5 rounded-2xl text-sm font-black shadow-gold-glow uppercase tracking-wider"
            >
              Finish &amp; Return to Studio
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto space-y-3.5">
            {/* Interval Status Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Interval {currentIndex + 1} of {totalExercisesCount}
                  </span>
                  {currentExercise?.phaseLabel && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-[9px] font-bold text-amber-300">
                      {currentExercise.phaseLabel}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
                  {phase === 'get_ready'
                    ? `Get Ready: ${currentExercise?.name}`
                    : phase === 'rest'
                    ? 'Active Rest & Recovery'
                    : currentExercise?.name || 'Guided Movement'}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  {formattedElapsed} · ~{liveBurnEstimate} kcal
                </span>
                <span className="text-[10px] text-slate-400">
                  {phase === 'workout' ? currentExercise?.defaultReps || 'Work Interval' : 'Deep Breath'}
                </span>
              </div>
            </div>

            {/* HD Motion Video & Voice Coach HUD Stage */}
            <div className="relative w-full h-60 sm:h-72 rounded-3xl bg-black/75 border border-white/10 flex items-center justify-center p-3 overflow-hidden shadow-inner">
              {phase === 'rest' ? (
                <div className="text-center space-y-3 p-3 animate-in fade-in duration-200 w-full max-w-sm">
                  <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono animate-pulse">
                    00:{secondsRemaining < 10 ? '0' : ''}{secondsRemaining}
                  </div>
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
                    Sip water · Next movement loading
                  </span>

                  {nextExercise && (
                    <div className="p-2.5 rounded-2xl bg-obsidian-850 border border-white/10 flex items-center gap-3 text-left">
                      <img
                        src={nextExercise.gifUrl}
                        alt={nextExercise.name}
                        className="w-12 h-12 rounded-xl object-contain dark-3d-animation bg-black/80 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                          Next Up:
                        </span>
                        <div className="text-xs font-bold text-white truncate">{nextExercise.name}</div>
                        <span className="text-[10px] text-slate-400">{nextExercise.defaultDuration || '40 Sec'}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSecondsRemaining((s) => s + 15)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> 15s Rest
                    </button>
                    <button
                      type="button"
                      onClick={handleSkipForward}
                      className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition active:scale-95"
                    >
                      Skip Rest →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={currentExercise?.gifUrl}
                    alt={currentExercise?.name}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = 'true';
                        e.currentTarget.src =
                          currentExercise?.fallbackGif ||
                          (currentExercise?.subCategory === 'exercise_ball'
                            ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/back-extension-on-exercise-ball.gif'
                            : 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif');
                      }
                    }}
                    className="w-full h-full object-contain dark-3d-animation"
                  />

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 border border-amber-500/35 text-[10px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Video className="w-3 h-3 text-rose-400" />
                    <span>HD MOTION DEMO</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-base font-black flex items-center gap-1.5 shadow-xl">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>00:{secondsRemaining < 10 ? '0' : ''}{secondsRemaining}</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-200">
                    Target: {currentExercise?.muscleCategory || 'Core'}
                  </div>
                </div>
              )}
            </div>

            {/* Live Voice Coach Script & Form Tip */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200 leading-snug">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-amber-300">
                  {voiceCoachEnabled ? 'Coach FitArc Voice Cue:' : 'Trainer Form Cue:'}
                </div>
                <p className="text-amber-100/90">
                  {coachSubtitle || currentExercise?.voiceCue || currentExercise?.proTip || 'Keep core braced and move with controlled breathing.'}
                </p>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between gap-3 pt-1 shrink-0">
              <button
                onClick={handleSkipBack}
                disabled={currentIndex === 0 && phase === 'workout'}
                className="p-3.5 rounded-2xl bg-obsidian-850 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95 disabled:opacity-40"
                title="Previous Exercise"
              >
                <SkipBack className="w-5 h-5" />
              </button>

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

              <button
                onClick={handleSkipForward}
                className="p-3.5 rounded-2xl bg-obsidian-850 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95"
                title="Skip Interval"
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
export default GuidedWorkoutPlayerModal;
