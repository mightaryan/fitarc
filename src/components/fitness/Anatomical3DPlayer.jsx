import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  ShieldAlert,
  Flame,
  Zap,
} from 'lucide-react';

const FALLBACK_GIF = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif';

export function Anatomical3DPlayer({ exercise, isMini = false, defaultMode = '3d_gif' }) {
  const [viewMode, setViewMode] = useState(defaultMode); // '3d_gif' | 'angle_simulator'
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [jointAngle, setJointAngle] = useState(45); // default 45° optimal angle
  const [formMode, setFormMode] = useState('optimal'); // 'optimal' | 'flawed'

  const gifUrl = exercise?.gifUrl || FALLBACK_GIF;
  const isAngleHazard = jointAngle > 65;

  const handleModeToggle = (mode) => {
    setFormMode(mode);
    if (mode === 'optimal') {
      setJointAngle(45);
    } else {
      setJointAngle(90);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 bg-[#08090C] shadow-2xl flex flex-col group">
      {/* Top View Selector Bar */}
      {!isMini && (
        <div className="p-3 sm:px-4 bg-obsidian-900/95 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('3d_gif')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                viewMode === '3d_gif'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Anatomical Motion (Dark Mode)</span>
            </button>

            <button
              onClick={() => setViewMode('angle_simulator')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'angle_simulator'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Angle & Joint Shear Simulator</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              ⚡ {exercise.muscleCategory || 'Primary'} Target
            </span>
          </div>
        </div>
      )}

      {/* Main View Area: Unified Dark Obsidian Chamber displaying Authentic 3D Anatomical Animation */}
      <div className="relative w-full overflow-hidden bg-[#08090C] flex items-center justify-center min-h-[260px] sm:min-h-[400px]">
        {/* Ambient gold radial glow */}
        <div className="absolute inset-0 bg-radial-gold opacity-20 pointer-events-none" />

        {/* Loading skeleton */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-obsidian-900 z-10">
            <div className="w-9 h-9 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-amber-300/80 tracking-wider">
              Loading 3D Muscle Anatomy...
            </span>
          </div>
        )}

        {/* 3D Anatomical GIF Image with Dark Mode Transformation Filter */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={imgError ? FALLBACK_GIF : gifUrl}
            alt={exercise.name}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              if (!imgError) {
                setImgError(true);
                e.currentTarget.src = FALLBACK_GIF;
              }
            }}
            className="max-h-[380px] w-auto object-contain rounded-2xl transition duration-500 dark-3d-animation drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          />

          {/* SIMULATOR HUD OVERLAY: ACTIVE WHEN IN ANGLE SIMULATOR MODE */}
          {viewMode === 'angle_simulator' && (
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              {/* Top Alert Badge */}
              <div className="flex items-center justify-between gap-2 pointer-events-auto">
                <div
                  className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 flex items-center gap-2 ${
                    isAngleHazard
                      ? 'bg-rose-950/85 border-rose-500/50 text-rose-200 animate-pulse'
                      : 'bg-emerald-950/85 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  {isAngleHazard ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <div className="text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider block">
                      {isAngleHazard
                        ? `Dangerous ${jointAngle}° Joint Flare · High Shear Hazard`
                        : `Optimal ${jointAngle}° Angle · Peak Fiber Alignment`}
                    </span>
                    <span className="text-[10px] opacity-80 block">
                      {isAngleHazard
                        ? '38% Subacromial Pinching · AC Joint Strain · Target Activation Drops to 32%'
                        : '0% Joint Impingement · 94% Mechanical Tension on Target Muscle'}
                    </span>
                  </div>
                </div>

                {/* Angle Dial Badge */}
                <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-amber-500/30 text-amber-300 backdrop-blur-md font-mono text-sm font-extrabold flex items-center gap-1 shadow-lg">
                  <span>{jointAngle}°</span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal">Track</span>
                </div>
              </div>

              {/* Angle Line Vector Overlay Graphics */}
              <div className="relative w-full h-32 flex items-center justify-center">
                <svg className="w-48 h-48 pointer-events-none opacity-85" viewBox="0 0 100 100">
                  {/* Base reference line */}
                  <line x1="50" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Dynamic angle trajectory line */}
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((-jointAngle * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((-jointAngle * Math.PI) / 180)}
                    stroke={isAngleHazard ? '#f43f5e' : '#fbbf24'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Center joint pivot node */}
                  <circle cx="50" cy="50" r="4" fill={isAngleHazard ? '#f43f5e' : '#fbbf24'} />
                  {/* Angle arc */}
                  <path
                    d={`M 70 50 A 20 20 0 0 0 ${50 + 20 * Math.cos((-jointAngle * Math.PI) / 180)} ${50 + 20 * Math.sin((-jointAngle * Math.PI) / 180)}`}
                    fill="none"
                    stroke={isAngleHazard ? '#f43f5e' : '#10b981'}
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Bottom Angle Controls Overlay */}
              <div className="bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 pointer-events-auto">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-slate-200">Joint Angle Biomechanics:</span>
                  </div>

                  {/* Mode Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleModeToggle('optimal')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                        formMode === 'optimal'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      🟢 45° Optimal Guide
                    </button>
                    <button
                      onClick={() => handleModeToggle('flawed')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
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
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold shrink-0">30° Tuck</span>
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
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-rose-400 font-mono font-semibold shrink-0">90° Flare</span>
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT FLOATING BADGES (When in 3D Motion Mode) */}
          {viewMode === '3d_gif' && (
            <>
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-black/80 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Active 3D Muscle Highlight
                </span>

                {exercise.primaryMuscles?.[0] && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/70 border border-white/10 text-slate-300 backdrop-blur-md">
                    Target: {exercise.primaryMuscles[0].name} ({exercise.primaryMuscles[0].percentage}%)
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 pointer-events-none">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider bg-black/80 border border-white/10 text-slate-400 backdrop-blur-md">
                  {exercise.equipment || 'Gym Machine'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Caption & Target Muscle Fiber Indicator */}
      {!isMini && (
        <div className="p-3 bg-obsidian-900/90 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Illuminated Target Fibers:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {exercise.primaryMuscles?.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300"
                >
                  ⚡ {m.name} ({m.percentage}%)
                </span>
              ))}
            </div>
          </div>

          {viewMode === '3d_gif' ? (
            <button
              onClick={() => setViewMode('angle_simulator')}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 ml-auto"
            >
              <span>Switch to Angle & Joint Shear Telemetry</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </button>
          ) : (
            <button
              onClick={() => setViewMode('3d_gif')}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 ml-auto"
            >
              <span>Back to 3D Muscle Motion</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
