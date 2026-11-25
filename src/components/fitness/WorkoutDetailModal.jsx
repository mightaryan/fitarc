import React, { useState } from 'react';
import {
  X,
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Dumbbell,
  Clock,
  Activity,
  Layers,
  Compass,
  TrendingUp,
  Sun,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { Anatomical3DPlayer } from './Anatomical3DPlayer';
import { ProgressiveOverloadCalculator } from './ProgressiveOverloadCalculator';
import { MachineSetupVisualizer } from './MachineSetupVisualizer';
import { calculateWorkoutImpact } from '../../data/fitnessData';
import { useApp } from '../../context/AppContext';

export function WorkoutDetailModal({ exercise, onClose }) {
  const { user, logWorkout } = useApp();
  const [minutes, setMinutes] = useState(exercise.defaultMinutes || 20);
  const [intensity, setIntensity] = useState('moderate');
  const [sets, setSets] = useState(exercise.defaultSets || 4);
  const [reps, setReps] = useState(exercise.defaultReps || 10);
  const [activeTab, setActiveTab] = useState('biomechanics'); // 'biomechanics' | 'pyramid' | 'setup' | 'mistakes'
  const [isLogged, setIsLogged] = useState(false);

  if (!exercise) return null;

  const isYoga = exercise.category === 'yoga' || exercise.category === 'face_yoga';
  const isFace = exercise.category === 'face_yoga';
  const isBall = exercise.equipment === 'exercise_ball';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 sm:p-6 bg-obsidian-900/95 backdrop-blur-md border-b border-amber-500/15 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className={`p-2 sm:p-2.5 rounded-xl border shrink-0 ${
              isYoga
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}>
              {isYoga ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  isYoga
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {exercise.equipmentLabel || (isYoga ? (isFace ? 'Hands, Breath & Mirror' : (isBall ? 'Stability & Exercise Ball' : 'Non-Slip Yoga Mat')) : exercise.category)}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 shrink-0">{exercise.level}</span>
                {exercise.sanskritName && (
                  <span className="text-[10px] text-amber-400 font-serif italic hidden md:inline truncate">
                    · {exercise.sanskritName}
                  </span>
                )}
                {exercise.equipmentBrand && (
                  <span className="text-[10px] text-amber-400 font-mono hidden md:inline truncate">
                    · {exercise.equipmentBrand}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-2xl font-black text-white tracking-tight mt-0.5 break-words line-clamp-2">
                {exercise.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Authentic 3D Anatomical Visual Motion Player (Shared across all 4 modes) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                {isYoga ? 'Holistic Asana Alignment & Illuminated Muscles' : '3D Anatomical Muscle Motion & Biomechanical Guidance'}
              </h3>
              <span className="text-[11px] text-slate-400">
                {isYoga ? (isBall ? 'Stability Ball Decompression' : isFace ? 'Face Fascia Sculpt' : 'Yoga Mat Flow') : 'GymVisual 3D Engine · Illuminated Muscle Fibers'}
              </span>
            </div>
            <Anatomical3DPlayer
              exercise={exercise}
              activeTab={activeTab}
              userWeightKg={currentWeightKg}
            />
          </div>

          {/* Navigation Tabs for Biomechanical Modalities */}
          <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'biomechanics', label: isYoga ? 'Asana Flow & Alignment' : '3D Motion & Vectors', icon: Compass },
              { id: 'pyramid', label: isYoga ? 'Breath & Hold Progression' : 'Weight Ratio & Overload', icon: TrendingUp },
              { id: 'setup', label: isYoga ? (isFace ? 'Facial Space & Mirror' : (isBall ? 'Stability Ball Setup' : 'Yoga Mat Grounding')) : 'Machine Setup & Alignment', icon: CheckCircle2 },
              { id: 'mistakes', label: isYoga ? 'Joint Angle & Spine Ease' : 'Angle & Joint Shear Simulator', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? tab.id === 'mistakes'
                        ? 'border-rose-500 text-rose-300 font-bold'
                        : 'border-amber-400 text-amber-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: 3D ANATOMICAL MUSCLE MOTION & BIOMECHANICAL GUIDANCE */}
          {activeTab === 'biomechanics' && (
            <div className="space-y-6">
              {/* Angle Recruitment Breakdown */}
              <div className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Muscular Recruitment by Movement Vector
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 45° - 60° Tucked Elbows / Optimal Track
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Maximizes alignment with target muscle fibers. Eliminates rotational torque on joint capsules and places 88%+ direct mechanical tension on prime movers.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> 90° Flared Elbows / Flawed Trajectory
                    </span>
                    <p className="text-rose-200/90 text-[11px] leading-relaxed">
                      Subacromial space compresses significantly, increasing joint shear stress. Target muscle activation plummets, forcing secondary stabilizers to bear excessive load.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Calorie & Hypertrophy Predictor */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-obsidian-850 to-obsidian-900 border border-amber-500/30 shadow-lg space-y-4">
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

                {/* Duration Slider */}
                <div className="space-y-2">
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
                </div>

                {/* Live Outcomes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-obsidian-900/80 border border-amber-500/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                      <Flame className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Estimated Calorie Burn</div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-300">
                        {impact.caloriesBurned} <span className="text-xs font-bold text-slate-400">kcal</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-obsidian-900/80 border border-amber-500/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Hypertrophy Stimulus</div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-300">
                        +{impact.muscleGrowthScore} <span className="text-xs font-bold text-slate-400">/100 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESSIVE OVERLOAD & PYRAMID WEIGHT CALCULATOR */}
          {activeTab === 'pyramid' && (
            <ProgressiveOverloadCalculator
              exercise={exercise}
              userWeightKg={currentWeightKg}
            />
          )}

          {/* TAB 3: MACHINE SETUP / YOGA MAT & STABILITY BALL ALIGNMENT */}
          {activeTab === 'setup' && (
            isYoga ? (
              <div className="p-5 rounded-2xl bg-obsidian-850 border border-emerald-500/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0">
                    {isFace ? '✨' : isBall ? '⚪' : '🧘‍♀️'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {isFace ? 'Face Yoga Studio Setup' : isBall ? 'Stability Ball Setup & Traction' : 'Yoga Mat Grounding & Alignment'}
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      Holistic Environment & Biomechanics
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Step-by-Step Setup:
                  </h4>
                  <div className="space-y-2">
                    {(exercise.setupSteps || [
                      'Unroll a clean, non-slip yoga mat on a quiet flat floor.',
                      'Ground barefoot through all four corners of feet; align pelvic neutrality.',
                      'Engage Ujjayi nasal breath with steady 4-second inhalation and exhalation.',
                    ]).map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {exercise.formSteps && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Mindful Asana Execution:
                    </h4>
                    <div className="space-y-2">
                      {exercise.formSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MachineSetupVisualizer exercise={exercise} />
            )
          )}

          {/* TAB 4: LIVE ANGLE & JOINT SHEAR SIMULATOR / WRONG ANGLES & INJURY TRAPS */}
          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Common Form Pitfalls & Injury Hazards
                </h4>
                <div className="space-y-2">
                  {(exercise.commonMistakes && exercise.commonMistakes.length > 0
                    ? exercise.commonMistakes
                    : [
                        'Using excessive momentum or body swing to complete the repetition.',
                        'Cutting the eccentric negative phase short, eliminating hypertrophy stimulus.',
                        'Flaring joints past natural scapular plane, increasing subacromial shear.',
                      ]
                  ).map((mistake, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-rose-500/20 text-rose-200 text-xs sm:text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>

              {exercise.proTip && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                      Elite Biomechanical Pro Tip
                    </strong>
                    <p className="text-xs sm:text-sm leading-relaxed">{exercise.proTip}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 p-3.5 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Estimated burn: <span className="text-amber-300 font-bold">{impact.caloriesBurned} kcal</span> ·{' '}
            <span className="text-amber-400 font-semibold">+{impact.muscleGrowthScore} pts hypertrophy</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 active:scale-95 transition text-center"
            >
              Close
            </button>
            <button
              onClick={handleLogToJournal}
              disabled={isLogged}
              className="flex-1 sm:flex-initial gold-btn px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95"
            >
              {isLogged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Workout Logged!</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Log Workout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
