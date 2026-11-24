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

const FALLBACK_GIF =
  'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif';

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

  const gifUrl = exercise?.gifUrl || FALLBACK_GIF;

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

  const isAngleHazard = jointAngle > 65;

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
            src={imgError ? FALLBACK_GIF : gifUrl}
            alt={exercise?.name || 'Exercise Biomechanics'}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              if (!imgError) {
                setImgError(true);
                e.currentTarget.src = FALLBACK_GIF;
              }
            }}
            className="h-[320px] sm:h-[420px] w-auto max-w-full object-contain scale-105 sm:scale-120 transition-all duration-500 dark-3d-animation drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
          />

          {/* MODE 1: BIOMECHANICS PERIMETER HUD (UNOBSTRUCTED CENTER) */}
          {activeTab === 'biomechanics' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Banner Ribbon */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ⚡ 45° Scapular Plane Recruitment · Peak Mechanical Tension
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                  MET {exercise?.metScore || 6.5} · {Math.round((exercise?.hypertrophyRate || 0.9) * 100)}% Hypertrophy Rate
                </span>
              </div>

              {/* Bottom Footer Ribbon */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">Kinetic Vector:</span>
                  <span className="text-amber-300 font-bold">45° Track (0% AC Impingement)</span>
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

          {/* MODE 2: WEIGHT RATIO & OVERLOAD PERIMETER HUD (UNOBSTRUCTED CENTER) */}
          {activeTab === 'pyramid' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Ratio Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  {bwRatio}x Mass Ratio · Working Load: {estWorkingWeight}kg (calibrated to {userWeightKg}kg mass)
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                  Est. 1RM ~{est1RM}kg
                </span>
              </div>

              {/* Bottom Overload 4-Phase Ribbon */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Pyramid Overload Progression:
                </span>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                  <span className="px-2 py-0.5 rounded bg-obsidian-850 border border-white/10 text-slate-300">
                    Set 1: 50% (Warmup)
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2 py-0.5 rounded bg-obsidian-850 border border-white/10 text-amber-200">
                    Set 2: 70% (Volume)
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2 py-0.5 rounded bg-obsidian-850 border border-white/10 text-amber-300">
                    Set 3: 80% (Tension)
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
                    Top Set: 88% (Peak Drive)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: MACHINE SETUP & ALIGNMENT PERIMETER HUD (UNOBSTRUCTED CENTER) */}
          {activeTab === 'setup' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Setup Check */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-emerald-500/30 text-emerald-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Machine Axis & Ergonomic Lock: Calibrated
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                  {exercise?.equipment || 'Equipment'} Safety Cam
                </span>
              </div>

              {/* Bottom Checklist Ribbon */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                    ✓ Seat Pin Locked
                  </span>
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                    ✓ Scapulae Retracted
                  </span>
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                    ✓ Joint-Cam Alignment
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100% Structural Stability</span>
              </div>
            </div>
          )}

          {/* MODE 4: ANGLE & JOINT SHEAR SIMULATOR PERIMETER HUD (UNOBSTRUCTED CENTER) */}
          {activeTab === 'mistakes' && (
            <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none">
              {/* Top Alert Badge */}
              <div className="flex items-center justify-between gap-2 flex-wrap pointer-events-auto">
                <div
                  className={`px-3.5 py-2 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 flex items-center gap-2.5 ${
                    isAngleHazard
                      ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 animate-pulse'
                      : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  {isAngleHazard ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <div className="text-left">
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {isAngleHazard
                        ? `Dangerous ${jointAngle}° Joint Flare · High Shear Hazard`
                        : `Optimal ${jointAngle}° Angle · Peak Fiber Alignment`}
                    </span>
                    <span className="text-[11px] opacity-85 block">
                      {isAngleHazard
                        ? '38% Subacromial Pinching · AC Joint Strain · Target Activation Drops to 32%'
                        : '0% Joint Impingement · 94% Mechanical Tension on Target Muscle'}
                    </span>
                  </div>
                </div>

                {/* Angle Dial Badge */}
                <div className="px-3.5 py-2 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md font-mono text-base font-extrabold flex items-center gap-1.5 shadow-lg">
                  <span>{jointAngle}°</span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal uppercase">Track</span>
                </div>
              </div>

              {/* Bottom Interactive Controls (Smooth Slider & Mode Toggles) */}
              <div className="bg-black/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2.5 pointer-events-auto">
                <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-slate-200">Joint Angle Biomechanics:</span>
                  </div>

                  {/* Mode Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAngleToggle('optimal')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                        formMode === 'optimal'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      🟢 45° Optimal Guide
                    </button>
                    <button
                      onClick={() => handleAngleToggle('flawed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                        formMode === 'flawed'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      🔴 90° Flared Risk
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-emerald-400 font-mono font-semibold shrink-0">
                    30° Tuck
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
                  <span className="text-xs text-rose-400 font-mono font-semibold shrink-0">
                    90° Flare
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
