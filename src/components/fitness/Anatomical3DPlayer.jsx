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
  'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif';

export function Anatomical3DPlayer({
  exercise,
  isMini = false,
  activeTab = 'biomechanics',
  onTabChange,
  userWeightKg = 75,
}) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [jointAngle, setJointAngle] = useState(45); // default 45° optimal angle
  const [formMode, setFormMode] = useState('optimal'); // 'optimal' | 'flawed'

  // Reset image load state whenever active exercise changes
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [exercise?.id, gifUrl]);

  // Sync internal mode when parent changes active tab
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
      if (activeTab === 'mistakes') {
        setJointAngle(90);
        setFormMode('flawed');
      } else if (activeTab === 'biomechanics') {
        setJointAngle(45);
        setFormMode('optimal');
      }
    }
  }, [activeTab]);

  const handleTabSelect = (tabId) => {
    setCurrentTab(tabId);
    if (tabId === 'mistakes') {
      setJointAngle(90);
      setFormMode('flawed');
    } else if (tabId === 'biomechanics') {
      setJointAngle(45);
      setFormMode('optimal');
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleAngleToggle = (mode) => {
    setFormMode(mode);
    if (mode === 'optimal') {
      setJointAngle(45);
    } else {
      setJointAngle(90);
    }
  };

  const gifUrl = exercise?.gifUrl || FALLBACK_GIF;
  const isAngleHazard = jointAngle > 65;

  // Working weight ratio calculation for pyramid mode
  const estWorkingWeight = Math.round(userWeightKg * (exercise?.metScore > 7 ? 1.15 : 0.85));
  const est1RM = Math.round(estWorkingWeight * 1.25);
  const bwRatio = (estWorkingWeight / userWeightKg).toFixed(2);

  const TABS = [
    { id: 'biomechanics', label: '3D Motion & Vectors', icon: Compass },
    { id: 'pyramid', label: 'Weight Ratio & Overload', icon: TrendingUp },
    { id: 'setup', label: 'Machine Setup & Alignment', icon: Settings },
    { id: 'mistakes', label: 'Angle & Joint Shear Simulator', icon: AlertTriangle },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 bg-[#08090C] shadow-2xl flex flex-col group">
      {/* Top 4-in-1 Biomechanics Telemetry Mode Bar */}
      {!isMini && (
        <div className="p-2 sm:p-3 bg-obsidian-900/95 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs z-10">
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-white/10 overflow-x-auto max-w-full scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition text-xs ${
                    isActive
                      ? tab.id === 'mistakes'
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md font-bold'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              ⚡ {exercise?.muscleCategory || 'Primary'} Target
            </span>
          </div>
        </div>
      )}

      {/* Main View Chamber: Unified Dark Obsidian Chamber displaying Authentic 3D Anatomical Animation */}
      <div className="relative w-full overflow-hidden bg-[#08090C] flex items-center justify-center min-h-[300px] sm:min-h-[420px]">
        {/* Ambient gold radial glow */}
        <div className="absolute inset-0 bg-radial-gold opacity-20 pointer-events-none" />

        {/* Loading skeleton */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-obsidian-900 z-10">
            <div className="w-9 h-9 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-amber-300/80 tracking-wider">
              Loading 3D Muscle Anatomy Engine...
            </span>
          </div>
        )}

        {/* 3D Anatomical GIF Image with Dark Mode Transformation Filter */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            key={exercise?.id || gifUrl}
            src={imgError ? FALLBACK_GIF : gifUrl}
            alt={exercise?.name || 'Exercise'}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              if (!imgError) {
                setImgError(true);
                e.currentTarget.src = FALLBACK_GIF;
              }
            }}
            className="max-h-[360px] sm:max-h-[400px] w-auto object-contain rounded-2xl transition duration-500 dark-3d-animation drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />

          {/* MODE 1: BIOMECHANICS & ANGLE VECTORS HUD OVERLAY */}
          {currentTab === 'biomechanics' && (
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              {/* Top Vector Indicators */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Optimal 45° Scapular Plane Recruitment
                </span>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                  MET {exercise?.metScore || 6.5} · Hypertrophy Stimulus
                </span>
              </div>

              {/* Angle Vector Arc SVG Overlay */}
              <div className="relative w-full h-32 flex items-center justify-center">
                <svg className="w-44 h-44 pointer-events-none opacity-80" viewBox="0 0 100 100">
                  <line x1="50" y1="50" x2="85" y2="50" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="50" y1="50" x2="78" y2="22" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="3.5" fill="#fbbf24" />
                  <circle cx="78" cy="22" r="3" fill="#f59e0b" />
                  <path d="M 68 50 A 18 18 0 0 0 63 37" fill="none" stroke="#10b981" strokeWidth="2" />
                  <text x="70" y="42" fill="#34d399" fontSize="7" fontWeight="bold">45°</text>
                </svg>
              </div>

              {/* Bottom Muscle Recruitment Pill */}
              <div className="bg-black/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">Kinetic Load Vector:</span>
                  <span className="text-amber-300 font-bold">45° Scapular Track (0% AC Impingement)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {exercise?.primaryMuscles?.slice(0, 2).map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-200">
                      {m.name} ({m.percentage}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: WEIGHT RATIO & PYRAMID OVERLOAD HUD OVERLAY */}
          {currentTab === 'pyramid' && (
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              {/* Top Ratio Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  {bwRatio}x Mass Ratio · Working Load: {estWorkingWeight}kg
                </span>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                  Est. 1RM ~{est1RM}kg
                </span>
              </div>

              {/* Overload Pyramid Graphic */}
              <div className="relative w-full flex items-center justify-center">
                <div className="bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-amber-500/25 space-y-1.5 max-w-sm w-full text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Pyramid Tension Overload Track
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                    <div className="p-1.5 rounded bg-obsidian-850 border border-white/5">
                      <span className="block text-slate-400">Set 1</span>
                      <strong className="text-slate-200">50% · 15r</strong>
                    </div>
                    <div className="p-1.5 rounded bg-obsidian-850 border border-white/5">
                      <span className="block text-slate-400">Set 2</span>
                      <strong className="text-amber-200">70% · 12r</strong>
                    </div>
                    <div className="p-1.5 rounded bg-obsidian-850 border border-white/5">
                      <span className="block text-slate-400">Set 3</span>
                      <strong className="text-amber-300">80% · 10r</strong>
                    </div>
                    <div className="p-1.5 rounded bg-amber-500/20 border border-amber-500/40">
                      <span className="block text-amber-300 font-bold">Top Set</span>
                      <strong className="text-amber-400 font-black">88% · 6-8r</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Load Bar */}
              <div className="bg-black/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Target Stimulus: High-Threshold Type IIb Motor Units</span>
                <span className="text-xs font-bold text-amber-300">RPE 8.5 - 9.0 Peak Drive</span>
              </div>
            </div>
          )}

          {/* MODE 3: MACHINE SETUP & ALIGNMENT HUD OVERLAY */}
          {currentTab === 'setup' && (
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              {/* Top Setup Check */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-black/85 border border-emerald-500/30 text-emerald-300 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Machine Axis & Ergonomic Lock: Calibrated
                </span>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                  {exercise?.equipment || 'Machine'} Checkpoint
                </span>
              </div>

              {/* Alignment Vector Crosshair */}
              <div className="relative w-full h-32 flex items-center justify-center">
                <svg className="w-40 h-40 pointer-events-none opacity-80" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="20" y1="50" x2="80" y2="50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50" y1="20" x2="50" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="4" fill="#10b981" />
                  <text x="54" y="47" fill="#34d399" fontSize="6" fontWeight="bold">Pivot Axis</text>
                </svg>
              </div>

              {/* Bottom Checklist */}
              <div className="bg-black/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                    ✓ Seat Pin Locked
                  </span>
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                    ✓ Scapulae Retracted
                  </span>
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                    ✓ Joint-Cam Alignment
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100% Structural Safety</span>
              </div>
            </div>
          )}

          {/* MODE 4: ANGLE & JOINT SHEAR SIMULATOR HUD OVERLAY */}
          {currentTab === 'mistakes' && (
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
                  <line
                    x1="50"
                    y1="50"
                    x2="90"
                    y2="50"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((-jointAngle * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((-jointAngle * Math.PI) / 180)}
                    stroke={isAngleHazard ? '#f43f5e' : '#fbbf24'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="4" fill={isAngleHazard ? '#f43f5e' : '#fbbf24'} />
                  <path
                    d={`M 70 50 A 20 20 0 0 0 ${50 + 20 * Math.cos((-jointAngle * Math.PI) / 180)} ${
                      50 + 20 * Math.sin((-jointAngle * Math.PI) / 180)
                    }`}
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
                      onClick={() => handleAngleToggle('optimal')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                        formMode === 'optimal'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      🟢 45° Optimal Guide
                    </button>
                    <button
                      onClick={() => handleAngleToggle('flawed')}
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
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold shrink-0">
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
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-rose-400 font-mono font-semibold shrink-0">
                    90° Flare
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Caption & Target Muscle Fiber Indicator */}
      {!isMini && (
        <div className="p-3 bg-obsidian-900/90 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Active Muscle Fibers:</span>
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
            Mode: <span className="text-amber-400 font-semibold">{TABS.find(t => t.id === currentTab)?.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
