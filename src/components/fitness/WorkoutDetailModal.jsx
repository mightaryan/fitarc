import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Dumbbell,
  Clock,
  Sun,
  Volume2,
  VolumeX,
  Lock,
} from 'lucide-react';
import { Anatomical3DPlayer } from './Anatomical3DPlayer';
import { calculateWorkoutImpact } from '../../data/fitnessData';
import { useApp } from '../../context/AppContext';

export function WorkoutDetailModal({ exercise, onClose }) {
  const { user, logWorkout, hasPaidPlan, advancedUnlocked, openPlanUpgradeModal } = useApp();
  const [minutes, setMinutes] = useState(exercise?.defaultMinutes || 15);
  const [intensity, setIntensity] = useState('moderate');
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'tips'
  const [isLogged, setIsLogged] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setActiveTab('steps');
    setIsSpeaking(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [exercise?.id]);

  if (!exercise) return null;

  const isLockedAdvanced = exercise.level === 'Advanced' && !(advancedUnlocked ?? hasPaidPlan);

  const toggleVoiceCoachBrief = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cueText = `${exercise.name}. ${exercise.voiceCue || exercise.tagline || ''}. ${
      (exercise.formSteps || []).slice(0, 2).join(' ')
    } Tip: ${exercise.proTip || ''}`;
    const utter = new SpeechSynthesisUtterance(cueText);
    utter.rate = 1.0;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const isYoga =
    exercise.category === 'yoga' ||
    exercise.equipment === 'yogamat' ||
    exercise.equipment === 'exercise_ball';

  const currentWeightKg = user.currentWeight || 75;
  const impact = calculateWorkoutImpact(exercise, minutes, currentWeightKg, intensity);

  const handleLogToJournal = () => {
    logWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      durationMinutes: minutes,
      intensity,
      sets: exercise.defaultSets || 3,
      reps: exercise.defaultReps || 12,
      caloriesBurned: impact.caloriesBurned,
      muscleGrowthScore: impact.muscleGrowthScore,
      primaryMuscles: (exercise.primaryMuscles || []).map((m) => m.name),
    });
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/25 text-slate-100 shadow-2xl flex flex-col">
        {/* Clean Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-obsidian-900/95 backdrop-blur-md border-b border-white/10 gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isYoga
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              }`}
            >
              {isYoga ? <Sun className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-bold text-amber-300">{exercise.level || 'Beginner'}</span>
                <span>·</span>
                <span className="truncate">{exercise.defaultReps || exercise.defaultDuration || '3 Sets x 12 Reps'}</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight truncate mt-0.5">
                {exercise.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimalistic Beginner Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Voice Coach Trigger + Visual Demo */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Movement Preview
              </span>
              <button
                type="button"
                onClick={toggleVoiceCoachBrief}
                className={`px-3 py-1 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition ${
                  isSpeaking
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Voice' : 'Listen to Guide'}</span>
              </button>
            </div>

            {isLockedAdvanced ? (
              <div className="p-6 rounded-3xl bg-black/70 border border-amber-500/30 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Advanced Workout Locked</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  You are currently on the Free plan. Switch from Free to a Paid plan (starting at ₹99/mo or yearly pass) to unlock all Advanced workouts and programs.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openPlanUpgradeModal(`Switch to Paid Plan to unlock "${exercise.name}"`);
                  }}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-black shadow-gold-glow-sm"
                >
                  Switch Free → Paid Plan (From ₹99)
                </button>
              </div>
            ) : (
              <Anatomical3DPlayer exercise={exercise} />
            )}
          </div>

          {!isLockedAdvanced && (
            <>
              {exercise.tagline && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{exercise.tagline}</p>
              )}

              {/* Simple 2-Tab Navigation */}
              <div className="flex border-b border-white/10 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('steps')}
                  className={`pb-2.5 px-2 text-xs sm:text-sm font-bold border-b-2 -mb-[1px] transition ${
                    activeTab === 'steps'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  How to Do It
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tips')}
                  className={`pb-2.5 px-2 text-xs sm:text-sm font-bold border-b-2 -mb-[1px] transition ${
                    activeTab === 'tips'
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Form Mistakes to Avoid
                </button>
              </div>

              {activeTab === 'steps' ? (
                <div className="space-y-4">
                  {/* Numbered Simple Steps */}
                  <div className="space-y-2">
                    {[...(exercise.setupSteps || []).slice(0, 1), ...(exercise.formSteps || []).slice(0, 3)].map(
                      (step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/45 border border-white/10 text-xs sm:text-sm text-slate-200"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      )
                    )}
                  </div>

                  {exercise.proTip && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 flex items-start gap-2.5 text-xs">
                      <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-300 font-bold">Quick Tip: </strong>
                        <span>{exercise.proTip}</span>
                      </div>
                    </div>
                  )}

                  {/* Simple Duration & Calories Logger */}
                  <div className="p-4 rounded-2xl bg-obsidian-850/90 border border-amber-500/20 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Time: <strong className="text-white">{minutes} min</strong></span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                        {['light', 'moderate', 'high'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setIntensity(lvl)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                              intensity === lvl ? 'bg-amber-500 text-black' : 'text-slate-400'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={minutes}
                      onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-obsidian-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300">Estimated Burn:</span>
                        <span className="font-black text-amber-300 text-base">{impact.caloriesBurned} kcal</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogToJournal}
                        className="gold-btn px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isLogged ? 'Logged!' : 'Log Workout'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(exercise.commonMistakes && exercise.commonMistakes.length > 0
                    ? exercise.commonMistakes
                    : ['Move slowly with steady breathing instead of rushing.', 'Stop immediately if you feel sharp joint pain.']
                  ).map((mistake, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-950/25 border border-rose-500/25 text-rose-200 text-xs sm:text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default WorkoutDetailModal;
