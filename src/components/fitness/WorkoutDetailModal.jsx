import React, { useState } from 'react';
import { X, Flame, Zap, CheckCircle2, AlertTriangle, Lightbulb, Dumbbell, Clock, Activity } from 'lucide-react';
import { MachineVisualPlayer } from './MachineVisualPlayer';
import { calculateWorkoutImpact } from '../../data/fitnessData';
import { useApp } from '../../context/AppContext';

export function WorkoutDetailModal({ exercise, onClose }) {
  const { user, logWorkout } = useApp();
  const [minutes, setMinutes] = useState(exercise.defaultMinutes || 20);
  const [intensity, setIntensity] = useState('moderate');
  const [sets, setSets] = useState(exercise.defaultSets || 4);
  const [reps, setReps] = useState(exercise.defaultReps || 10);
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'calculator' | 'mistakes'
  const [isLogged, setIsLogged] = useState(false);

  if (!exercise) return null;

  const currentWeightKg = user.currentWeight || 75;
  const impact = calculateWorkoutImpact(exercise, minutes, currentWeightKg, intensity);

  const handleLogToJournal = () => {
    logWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      durationMinutes: minutes,
      intensity,
      sets,
      reps,
      caloriesBurned: impact.caloriesBurned,
      muscleGrowthScore: impact.muscleGrowthScore,
      primaryMuscles: exercise.primaryMuscles.map((m) => m.name),
    });
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-obsidian-900/90 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {exercise.category}
                </span>
                <span className="text-xs text-slate-400">{exercise.level}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {exercise.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Animated Visual Motion Player */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                Live Animated Kinematic Form Guide
              </h3>
              <span className="text-xs text-slate-400">Target Muscle Biomechanics</span>
            </div>
            <MachineVisualPlayer exercise={exercise} />
          </div>

          {/* Interactive Calorie & Muscle Growth Calculator Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-obsidian-850 to-obsidian-900 border border-amber-500/30 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-amber-500/15">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Dynamic Calorie & Muscle Growth Predictor
                </h4>
                <p className="text-xs text-slate-400">
                  Calibrated to your logged body weight: <strong className="text-amber-300">{currentWeightKg} kg</strong>
                </p>
              </div>

              {/* Intensity Picker */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                {['light', 'moderate', 'high', 'maximum'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      intensity === level
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider for Duration */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Session Duration
                </span>
                <span className="font-extrabold text-amber-300 text-lg">{minutes} Minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="w-full h-2.5 bg-obsidian-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>5 min</span>
                <span>20 min (Warmup/Short)</span>
                <span>45 min (Standard)</span>
                <span>90 min (Max Endurance)</span>
              </div>
            </div>

            {/* Live Predicted Outcomes: Calorie Burn & Muscle Growth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Calories Burned */}
              <div className="p-4 rounded-xl bg-obsidian-900/80 border border-amber-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                    Estimated Calorie Loss
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-baseline gap-1">
                    {impact.caloriesBurned}
                    <span className="text-xs font-bold text-slate-400">kcal burned</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Based on MET score {exercise.metScore} for {currentWeightKg}kg body mass
                  </p>
                </div>
              </div>

              {/* Muscle Growth Stimulus */}
              <div className="p-4 rounded-xl bg-obsidian-900/80 border border-amber-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                    Hypertrophy Growth Stimulus
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-baseline gap-1">
                    +{impact.muscleGrowthScore}
                    <span className="text-xs font-bold text-slate-400">/100 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mechanical tension & metabolic micro-tear index
                  </p>
                </div>
              </div>
            </div>

            {/* Target Muscle Stimulus Breakdown */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-xs font-semibold text-slate-300 mb-2 block">
                Targeted Muscle Breakdown:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {impact.muscleImpact.map((muscle, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate">{muscle.name}</span>
                      <span className="text-amber-400 font-bold">+{muscle.stimulusPoints} pts</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300"
                        style={{ width: `${muscle.activationPercentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 text-right">
                      {muscle.activationPercentage}% activation
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Instruction Content */}
          <div className="flex border-b border-white/10 gap-2">
            {[
              { id: 'guide', label: 'How to Use & Form Guide' },
              { id: 'setup', label: 'Machine Setup & Adjustments' },
              { id: 'mistakes', label: 'Mistakes & Pro Tips' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 -mb-[1px] ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">{exercise.overview}</p>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Repetition Cadence & Breathing Cues
                </h5>
                <div className="space-y-2">
                  {exercise.formSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-850/60 border border-white/5"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Pre-Set Machine Adjustments
              </h5>
              {exercise.setupSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-obsidian-850/70 border border-amber-500/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  Common Pitfalls & Injury Hazards
                </h5>
                <div className="space-y-2">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs sm:text-sm"
                    >
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>

              {exercise.proTip && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                      Elite Coach Pro Tip
                    </strong>
                    <p className="text-xs sm:text-sm leading-relaxed">{exercise.proTip}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Estimated burn: <span className="text-amber-300 font-bold">{impact.caloriesBurned} kcal</span> ·{' '}
            <span className="text-amber-400 font-semibold">+{impact.muscleGrowthScore} pts hypertrophy</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
            >
              Close
            </button>
            <button
              onClick={handleLogToJournal}
              disabled={isLogged}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              {isLogged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Workout Logged!
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Log to Today's Workout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
