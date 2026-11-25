import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Compass,
  TrendingUp,
  Settings,
  Layers,
  Scale,
  Zap,
} from 'lucide-react';

function getFallbackGif(exercise) {
  const cat = (exercise?.category || '').toLowerCase();
  const muscle = (exercise?.muscleCategory || exercise?.muscle || '').toLowerCase();
  const name = (exercise?.name || '').toLowerCase();

  if (cat === 'face_yoga' || muscle.includes('face') || name.includes('jawline')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/levator-scapulae/neck-side-stretch.gif';
  }
  if (cat === 'yoga' || exercise?.equipment === 'yogamat' || exercise?.equipment === 'exercise_ball' || name.includes('yoga') || name.includes('surya') || name.includes('flow')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/back-extension-on-exercise-ball.gif';
  }
  if (muscle.includes('core') || muscle.includes('abs') || name.includes('crunch') || name.includes('plank')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif';
  }
  if (muscle.includes('leg') || muscle.includes('quad') || muscle.includes('glute') || name.includes('squat')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/dumbbell-single-leg-split-squat.gif';
  }
  if (muscle.includes('back') || muscle.includes('lat') || name.includes('row')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/suspended-row.gif';
  }
  return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif';
}

function getMuscleTelemetry(exercise, jointAngle) {
  const muscleGroup = (exercise?.muscleCategory || exercise?.muscle || '').toLowerCase();
  const category = (exercise?.category || '').toLowerCase();
  const name = (exercise?.name || '').toLowerCase();

  const isCore =
    muscleGroup.includes('core') ||
    muscleGroup.includes('abs') ||
    name.includes('crunch') ||
    name.includes('plank');
  const isLegs =
    muscleGroup.includes('legs') ||
    muscleGroup.includes('quad') ||
    muscleGroup.includes('glute') ||
    muscleGroup.includes('hamstring') ||
    name.includes('squat') ||
    name.includes('lunge');
  const isBack =
    muscleGroup.includes('back') ||
    muscleGroup.includes('lat') ||
    name.includes('row') ||
    name.includes('pull');
  const isYogaOrFace =
    category === 'yoga' ||
    category === 'face_yoga' ||
    muscleGroup.includes('face') ||
    name.includes('yoga') ||
    name.includes('jawline');

  if (isCore) {
    return {
      vectorLabel: 'Kinetic Vector:',
      optimalVector: '45° Torso Flexion (0% Cervical Shear)',
      optimalBadge: '45° Optimal Guide',
      flawedBadge: '90° Spinal Strain',
      sliderMin: '30° Safe',
      sliderMax: '90° Strain',
      hazardTitle: `Excessive ${jointAngle}° Flexion · Lumbar & Cervical Strain`,
      hazardDesc: 'Spinal shear hazard · Target abdominal engagement drops to 32%',
      optimalTitle: `Optimal ${jointAngle}° Flexion · Peak Core Recruitment`,
      optimalDesc: '0% Spinal Strain · 94% Tension on Rectus & Obliques',
      topBanner: '⚡ 45° Torso Flexion Alignment · Peak Core Tension',
    };
  } else if (isLegs) {
    return {
      vectorLabel: 'Joint Trajectory:',
      optimalVector: 'Patellar Tracking Line (0% Knee Shear)',
      optimalBadge: '45° Tracking Guide',
      flawedBadge: '90° Knee Shear Risk',
      sliderMin: '30° Safe',
      sliderMax: '90° Valgus',
      hazardTitle: `Dangerous ${jointAngle}° Knee Flare · High Patellar Shear`,
      hazardDesc: 'Joint shearing hazard · Quad/Glute tension drops',
      optimalTitle: `Optimal ${jointAngle}° Knee-Toe Vector · Quad & Glute Lock`,
      optimalDesc: '0% Ligament Shear · 95% Mechanical Tension on Quads',
      topBanner: '⚡ Ergonomic Patellar Tracking · 0% Knee Shear Stress',
    };
  } else if (isBack) {
    return {
      vectorLabel: 'Scapular Plane:',
      optimalVector: 'Retracted Scapulae (0% Lumbar Strain)',
      optimalBadge: 'Retracted Scapula Guide',
      flawedBadge: 'Spinal Kyphosis Risk',
      sliderMin: '30° Neutral',
      sliderMax: '90° Rounded',
      hazardTitle: `Deviated ${jointAngle}° Torso Angle · High Spinal Shear`,
      hazardDesc: 'Erector spinae strain · Latissimus recruitment drops',
      optimalTitle: `Optimal ${jointAngle}° Scapular Plane · Peak Latissimus Tension`,
      optimalDesc: '0% Spinal Shear · 93% Mechanical Tension across Lats',
      topBanner: '⚡ Scapular Retraction Vector · 0% Spinal Shear',
    };
  } else if (isYogaOrFace) {
    return {
      vectorLabel: 'Fascial Track:',
      optimalVector: 'Gentle Elongation (0% Pinching)',
      optimalBadge: 'Optimal Gentle Glide',
      flawedBadge: 'Excessive Tension Risk',
      sliderMin: '30° Soft',
      sliderMax: '90° Strain',
      hazardTitle: `Excessive ${jointAngle}° Force · Tissue Pinching Hazard`,
      hazardDesc: 'Connective tissue strain · Reduces lymphatic drainage',
      optimalTitle: `Optimal ${jointAngle}° Fascial Track · Collagen & Fiber Release`,
      optimalDesc: '0% Pinching · 96% Lymphatic Drainage Alignment',
      topBanner: '⚡ Fascial Elongation Arc · Zero Joint Compression',
    };
  }

  // Default (Chest / Shoulders / Arms)
  return {
    vectorLabel: 'Kinetic Vector:',
    optimalVector: '45° Scapular Track (0% AC Impingement)',
    optimalBadge: '45° Optimal Guide',
    flawedBadge: '90° Flared Risk',
    sliderMin: '30° Tuck',
    sliderMax: '90° Flare',
    hazardTitle: `Dangerous ${jointAngle}° Joint Flare · High Shear Hazard`,
    hazardDesc: '38% Subacromial Pinching · Target activation drops to 32%',
    optimalTitle: `Optimal ${jointAngle}° Angle · Peak Fiber Alignment`,
    optimalDesc: '0% Joint Impingement · 94% Mechanical Tension',
    topBanner: '⚡ 45° Scapular Plane Recruitment · Peak Mechanical Tension',
  };
}

export function Anatomical3DPlayer({
  exercise,
  isMini = false,
  activeTab = 'biomechanics',
  userWeightKg = 75,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [jointAngle, setJointAngle] = useState(45); // default 45° optimal angle
  const [formMode, setFormMode] = useState('optimal'); // 'optimal' | 'flawed'

  const fallbackSrc = getFallbackGif(exercise);
  const gifUrl = exercise?.gifUrl || fallbackSrc;
  const isAngleHazard = jointAngle > 65;
  const telemetry = getMuscleTelemetry(exercise, jointAngle);

  // Reset image load state whenever active exercise changes
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [exercise?.id, gifUrl]);

  // Sync angle defaults when tab changes
  useEffect(() => {
    if (activeTab === 'mistakes') {
      setJointAngle(90);
      setFormMode('flawed');
    } else {
      setJointAngle(45);
      setFormMode('optimal');
    }
  }, [activeTab]);

  const handleAngleToggle = (mode) => {
    setFormMode(mode);
    if (mode === 'optimal') {
      setJointAngle(45);
    } else {
      setJointAngle(90);
    }
  };

  // Working weight ratio calculation for pyramid mode
  const estWorkingWeight = Math.round(userWeightKg * (exercise?.metScore > 7 ? 1.15 : 0.85));
  const est1RM = Math.round(estWorkingWeight * 1.25);
  const bwRatio = (estWorkingWeight / userWeightKg).toFixed(2);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 bg-[#08090C] shadow-2xl flex flex-col group">
      {/* Main 3D Display Chamber: Large High-Definition Dark Obsidian Stage */}
      <div className="relative w-full overflow-hidden bg-[#08090C] flex items-center justify-center min-h-[360px] sm:min-h-[460px]">
        {/* Subtle radial gold spotlight glow */}
        <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />

        {/* Loading skeleton */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-obsidian-950/90 z-10">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-amber-300 tracking-wider">
              Loading 3D Muscle Anatomy...
            </span>
          </div>
        )}

        {/* Center 3D Anatomical Athlete Image: Scaled up, crisp, prominent & 100% unobstructed */}
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
          <img
            key={exercise?.id || gifUrl}
            src={imgError ? fallbackSrc : gifUrl}
            alt={exercise?.name || 'Exercise Biomechanics'}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              if (!imgError) {
                setImgError(true);
                e.currentTarget.src = fallbackSrc;
              }
            }}
            className="h-[320px] sm:h-[420px] w-auto max-w-full object-contain scale-105 sm:scale-120 transition-all duration-500 dark-3d-animation drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
          />

          {/* MODE 1: BIOMECHANICS PERIMETER HUD (UNOBSTRUCTED CENTER) */}
          {activeTab === 'biomechanics' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Banner Ribbon */}
              <div className="flex items-center justify-between gap-2 flex-wrap max-w-full">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-2 max-w-full truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span className="truncate">{telemetry.topBanner}</span>
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md shrink-0">
                  MET {exercise?.metScore || 6.5} · {Math.round((exercise?.hypertrophyRate || 0.9) * 100)}% Hypertrophy Rate
                </span>
              </div>

              {/* Bottom Footer Ribbon */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs flex-wrap max-w-full">
                <div className="flex items-center gap-2 truncate max-w-full">
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{telemetry.vectorLabel}</span>
                  <span className="text-amber-300 font-bold truncate">{telemetry.optimalVector}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {exercise?.primaryMuscles?.slice(0, 3).map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-200"
                    >
                      ⚡ {m.name} ({m.percentage}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: WEIGHT RATIO OR BREATH HOLD DURATION HUD */}
          {activeTab === 'pyramid' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Ratio Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap max-w-full">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-2 max-w-full truncate">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {isYogaOrFace
                      ? `Somatic Mind-Body Synchrony · Deep Fascial Elongation`
                      : `${bwRatio}x Mass Ratio · Working Load: ${estWorkingWeight}kg`}
                  </span>
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md shrink-0">
                  {isYogaOrFace ? 'Parasympathetic Focus' : `Est. 1RM ~${est1RM}kg`}
                </span>
              </div>

              {/* Bottom Overload or Breath Duration Ribbon */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs max-w-full">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  {isYogaOrFace ? 'Hold & Breath Progression:' : 'Pyramid Overload Progression:'}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs overflow-x-auto max-w-full py-0.5">
                  <span className="px-2 py-0.5 rounded bg-obsidian-850 border border-white/10 text-slate-300 shrink-0">
                    {isYogaOrFace ? 'Phase 1: 5 Breaths' : 'Set 1: 50%'}
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2 py-0.5 rounded bg-obsidian-850 border border-white/10 text-amber-200 shrink-0">
                    {isYogaOrFace ? 'Phase 2: 8 Breaths' : 'Set 2: 70%'}
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2 py-0.5 rounded bg-obsidian-850 border border-white/10 text-amber-300 shrink-0">
                    {isYogaOrFace ? 'Phase 3: 12 Breaths' : 'Set 3: 80%'}
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold shrink-0">
                    {isYogaOrFace ? 'Deep Hold: 15 Breaths' : 'Top: 88%'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: MACHINE SETUP OR YOGA MAT / BALL ALIGNMENT HUD */}
          {activeTab === 'setup' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Setup Check */}
              <div className="flex items-center justify-between gap-2 flex-wrap max-w-full">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-emerald-500/30 text-emerald-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-2 max-w-full truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {exercise?.equipment === 'exercise_ball'
                      ? 'Stability Ball & Pelvic Traction: Anchored'
                      : exercise?.category === 'face_yoga'
                      ? 'Hands, Mirror & Facial Alignment: Ready'
                      : isYogaOrFace
                      ? 'Non-Slip Yoga Mat & Barefoot Grounding: Aligned'
                      : 'Machine Axis & Ergonomic Lock: Calibrated'}
                  </span>
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md shrink-0">
                  {exercise?.equipmentLabel || (isYogaOrFace ? 'Zen Space' : (exercise?.equipment || 'Equipment'))}
                </span>
              </div>

              {/* Bottom Checklist Ribbon */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs flex-wrap max-w-full">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {exercise?.equipment === 'exercise_ball' ? (
                    <>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Ball Anchored on Mat
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ 360° Axial Decompression
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Core Transverse Balance
                      </span>
                    </>
                  ) : exercise?.category === 'face_yoga' ? (
                    <>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Clean Hands & Slip
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Eye-Level Mirror Symmetry
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Unclenched Jaw Molars
                      </span>
                    </>
                  ) : isYogaOrFace ? (
                    <>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Barefoot Floor Grounding
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Pelvic Mula Bandha Lock
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Ujjayi Breath Rhythm
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Seat Pin Locked
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Scapulae Retracted
                      </span>
                      <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                        ✓ Joint-Cam Alignment
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">100% Stability</span>
              </div>
            </div>
          )}

          {/* MODE 4: ANGLE & JOINT SHEAR SIMULATOR PERIMETER HUD (UNOBSTRUCTED CENTER) */}
          {activeTab === 'mistakes' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Alert Badge */}
              <div className="flex items-center justify-between gap-2 flex-wrap pointer-events-auto max-w-full">
                <div
                  className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-2.5 max-w-[calc(100%-80px)] overflow-hidden ${
                    isAngleHazard
                      ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                      : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  {isAngleHazard ? (
                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  )}
                  <div className="text-left overflow-hidden">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider block truncate">
                      {isAngleHazard ? telemetry.hazardTitle : telemetry.optimalTitle}
                    </span>
                    <span className="text-[10px] sm:text-[11px] opacity-85 block truncate">
                      {isAngleHazard ? telemetry.hazardDesc : telemetry.optimalDesc}
                    </span>
                  </div>
                </div>

                {/* Angle Dial Badge */}
                <div className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md font-mono text-sm sm:text-base font-extrabold flex items-center gap-1.5 shadow-lg shrink-0">
                  <span>{jointAngle}°</span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal uppercase">Track</span>
                </div>
              </div>

              {/* Bottom Interactive Controls (Smooth Slider & Mode Toggles) */}
              <div className="bg-black/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/10 space-y-2 pointer-events-auto max-w-full">
                <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-200 truncate">Joint Angle Biomechanics:</span>
                  </div>

                  {/* Mode Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleAngleToggle('optimal')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                        formMode === 'optimal'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      🟢 {telemetry.optimalBadge}
                    </button>
                    <button
                      onClick={() => handleAngleToggle('flawed')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                        formMode === 'flawed'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      🔴 {telemetry.flawedBadge}
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold shrink-0">
                    {telemetry.sliderMin}
                  </span>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="5"
                    value={jointAngle}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setJointAngle(val);
                      setFormMode(val > 65 ? 'flawed' : 'optimal');
                    }}
                    className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] text-rose-400 font-mono font-semibold shrink-0">
                    {telemetry.sliderMax}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Strip */}
      {!isMini && (
        <div className="p-3 bg-obsidian-900/90 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Target Fibers:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {exercise?.primaryMuscles?.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300"
                >
                  ⚡ {m.name} ({m.percentage}%)
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono ml-auto">
            Engine: <span className="text-amber-400 font-semibold">GymVisual 3D Anatomical Motion</span>
          </div>
        </div>
      )}
    </div>
  );
}
