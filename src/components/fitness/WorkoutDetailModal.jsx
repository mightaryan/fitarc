import React, { useState, useEffect } from 'react';
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

function getMovementVectorBiomechanics(exercise) {
  const muscleCat = (exercise?.muscleCategory || exercise?.muscle || '').toLowerCase();
  const name = (exercise?.name || '').toLowerCase();
  const cat = (exercise?.category || '').toLowerCase();

  const isYoga =
    cat === 'yoga' ||
    cat === 'face_yoga' ||
    exercise?.equipment === 'yogamat' ||
    exercise?.equipment === 'exercise_ball' ||
    name.includes('yoga') ||
    name.includes('surya') ||
    name.includes('flow');
  const isFace = cat === 'face_yoga' || muscleCat.includes('face') || name.includes('jawline');
  const isCore =
    muscleCat.includes('core') ||
    muscleCat.includes('abs') ||
    name.includes('crunch') ||
    name.includes('plank') ||
    name.includes('hollow') ||
    name.includes('twist');
  const isLegs =
    muscleCat.includes('leg') ||
    muscleCat.includes('quad') ||
    muscleCat.includes('glute') ||
    muscleCat.includes('hamstring') ||
    muscleCat.includes('calf') ||
    name.includes('squat') ||
    name.includes('lunge');
  const isBack =
    muscleCat.includes('back') ||
    muscleCat.includes('lat') ||
    name.includes('row') ||
    name.includes('pull-up') ||
    name.includes('chin-up') ||
    name.includes('pulldown');
  const isCalisthenics =
    cat === 'calisthenics' ||
    name.includes('planche') ||
    name.includes('human flag') ||
    name.includes('muscle-up') ||
    name.includes('l-sit') ||
    name.includes('dragon flag') ||
    name.includes('dip');

  if (isFace) {
    return {
      optimalTitle: '25° Upward Glide / Zygomaticus Lift',
      optimalDesc:
        'Stimulates lymphatic micro-circulation and dermal tone. Eliminates skin dragging and delivers 96% fascial release across the platysma.',
      flawedTitle: '55° Downward Drag / Excessive Tugging',
      flawedDesc:
        'Tugs fragile subcutaneous facial tissue downward, aggravating nasolabial creasing and inhibiting lymphatic clearance.',
    };
  }

  if (isYoga) {
    return {
      optimalTitle: 'Axial Spine Elongation / Decompressed Neutral',
      optimalDesc:
        'Zero facet joint impingement. Decompresses intervertebral discs with continuous 4-second Ujjayi nasal breath synchrony.',
      flawedTitle: 'Forced Hyperextension / Pinched Lumbar Spine',
      flawedDesc:
        'Pinches facet joints and restricts diaphragmatic expansion, causing reflex muscular guarding and breath restriction.',
    };
  }

  if (isCore) {
    return {
      optimalTitle: '30° - 45° Thoracic Flexion / Posterior Pelvic Tilt',
      optimalDesc:
        'Channels 94% direct mechanical tension into rectus abdominis & obliques while maintaining 0% shear on L4-S1 lumbar discs.',
      flawedTitle: 'Cervical Neck Yanking & Lumbar Hyperextension',
      flawedDesc:
        'Pulling cervical spine with hands spikes neck torque by 340%, disengaging abdominal fibers and forcing hip flexors (psoas) to overcompensate.',
    };
  }

  if (isLegs) {
    return {
      optimalTitle: 'Knee Tracking Over 2nd Toe / Neutral Pelvic Hinge',
      optimalDesc:
        'Maximizes mechanical tension across quadriceps and gluteus maximus while maintaining 0% knee valgus shear strain.',
      flawedTitle: 'Inward Knee Valgus Collapse & Heel Elevation',
      flawedDesc:
        'Shifts compressive stress onto the meniscus and ACL ligaments. Target quadriceps recruitment plummets from 92% to 34%.',
    };
  }

  if (isCalisthenics) {
    return {
      optimalTitle: 'Protracted Scapulae & Locked Hollow-Body Arc',
      optimalDesc:
        'Transfers 100% relative kinetic power through shoulder stabilizers and core levers with rock-solid joint integrity.',
      flawedTitle: 'Sagging Core Levers & Retracted Scapula Collapse',
      flawedDesc:
        'Dumps high rotational shear directly into fragile anterior deltoid capsules and rotator cuff ligaments.',
    };
  }

  if (isBack) {
    return {
      optimalTitle: 'Scapular Depression & Retraction / Elbows to Hips',
      optimalDesc:
        'Places peak mechanical tension across latissimus dorsi and rhomboids with zero lumbar hyperextension.',
      flawedTitle: 'Excessive Torso Swing & Bicep Over-Engagement',
      flawedDesc:
        'Momentum bypasses back musculature and spikes spinal shear along lower lumbar vertebrae by 4.2x.',
    };
  }

  // Default: Push / Chest / Shoulders / Free Weights
  return {
    optimalTitle: '45° - 60° Tucked Elbows / Optimal Scapular Track',
    optimalDesc:
      'Maximizes alignment with target pectoral fibers. Eliminates rotational torque on joint capsules and places 88%+ direct tension on prime movers.',
    flawedTitle: '90° Flared Elbows / Flawed Trajectory',
    flawedDesc:
      'Subacromial space compresses significantly, increasing joint shear stress. Target muscle activation plummets, forcing secondary stabilizers to bear excessive load.',
  };
}

export function WorkoutDetailModal({ exercise, onClose }) {
  const { user, logWorkout } = useApp();
  const [minutes, setMinutes] = useState(exercise.defaultMinutes || 20);
  const [intensity, setIntensity] = useState('moderate');
  const [sets, setSets] = useState(exercise.defaultSets || 4);
  const [reps, setReps] = useState(exercise.defaultReps || 10);
  const [activeTab, setActiveTab] = useState('biomechanics'); // 'biomechanics' | 'pyramid' | 'setup' | 'mistakes'
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setActiveTab('biomechanics');
  }, [exercise?.id]);

  if (!exercise) return null;

  const isYoga =
    exercise.category === 'yoga' ||
    exercise.category === 'face_yoga' ||
    exercise.equipment === 'yogamat' ||
    exercise.equipment === 'exercise_ball' ||
    exercise.equipment === 'face_hands';
  const isFace = exercise.category === 'face_yoga' || exercise.equipment === 'face_hands';
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
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
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
              activeTab={isYoga ? 'biomechanics' : activeTab}
              userWeightKg={currentWeightKg}
            />
          </div>

          {/* Navigation Tabs (Removed for Yoga / Ball Yoga / Face Yoga; Full 4 Biomechanical Tabs for Gym & Home Strength) */}
          {!isYoga && (
            <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'biomechanics', label: '3D Motion & Vectors', icon: Compass },
                { id: 'pyramid', label: 'Weight Ratio & Overload', icon: TrendingUp },
                { id: 'setup', label: 'Machine Setup & Alignment', icon: CheckCircle2 },
                { id: 'mistakes', label: 'Angle & Joint Shear Simulator', icon: AlertTriangle },
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
          )}

          {/* TAB 1 (Or Unified View for Yoga): MUSCLE MOTION, BREATH & HOLD PROGRESSION & SETUP */}
          {(isYoga || activeTab === 'biomechanics') && (
            <div className="space-y-6">
              {/* Angle Recruitment Breakdown */}
              {(() => {
                const biomechanicsVector = getMovementVectorBiomechanics(exercise);
                return (
                  <div className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-400" />
                      Muscular Recruitment by Movement Vector
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-1">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {biomechanicsVector.optimalTitle}
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {biomechanicsVector.optimalDesc}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                        <span className="font-bold text-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> {biomechanicsVector.flawedTitle}
                        </span>
                        <p className="text-rose-200/90 text-[11px] leading-relaxed">
                          {biomechanicsVector.flawedDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

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

              {/* Clean Fixed Breath & Hold Cadence + Form Steps for Yoga / Face Yoga / Ball Yoga */}
              {isYoga && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-obsidian-850 border border-amber-500/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      Breath & Hold Cadence Guide
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-[10px] text-slate-400 block">Phase 1 · Warmup</span>
                        <span className="font-bold text-slate-200">4s Inhale / 4s Hold</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-[10px] text-slate-400 block">Phase 2 · Flow</span>
                        <span className="font-bold text-amber-200">8 Breath Cycles</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-[10px] text-slate-400 block">Phase 3 · Lengthen</span>
                        <span className="font-bold text-amber-300">12 Breath Cycles</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                        <span className="text-[10px] text-amber-400 block">Deep Release Hold</span>
                        <span className="font-bold text-white">15 Breaths (60s)</span>
                      </div>
                    </div>
                  </div>

                  {exercise.formSteps?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-obsidian-850 border border-emerald-500/20 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Guided Posture & Breath Execution
                      </h4>
                      <div className="space-y-2">
                        {exercise.formSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {exercise.proTip && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                          Mindful Technique Tip
                        </strong>
                        <p className="text-xs leading-relaxed">{exercise.proTip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROGRESSIVE OVERLOAD & PYRAMID WEIGHT CALCULATOR (Strength / Gym / Home / Calisthenics Only) */}
          {!isYoga && activeTab === 'pyramid' && (
            <ProgressiveOverloadCalculator
              exercise={exercise}
              userWeightKg={currentWeightKg}
            />
          )}

          {/* TAB 3: MACHINE SETUP & ALIGNMENT (Strength / Gym / Home / Calisthenics Only) */}
          {!isYoga && activeTab === 'setup' && (
            <MachineSetupVisualizer exercise={exercise} />
          )}

          {/* TAB 4: LIVE ANGLE & JOINT SHEAR SIMULATOR (Strength / Gym / Home / Calisthenics Only) */}
          {!isYoga && activeTab === 'mistakes' && (
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
