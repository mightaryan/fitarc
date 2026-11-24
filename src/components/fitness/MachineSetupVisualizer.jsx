import React, { useState } from 'react';
import {
  CheckCircle2,
  Settings,
  Sliders,
  Check,
  ShieldCheck,
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function MachineSetupVisualizer({ exercise }) {
  const [inclineAngle, setInclineAngle] = useState(30);
  const [seatPin, setSeatPin] = useState('Pin 2 (Standard)');
  const [checkedSteps, setCheckedSteps] = useState({});

  const toggleCheck = (idx) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const INCLINE_PRESETS = [
    { angle: 0, label: '0° Flat', focus: 'Mid Pectoralis Major', icon: '⎯' },
    { angle: 30, label: '30° Low Incline', focus: 'Clavicular Upper Chest (Peak Alignment)', icon: '⟋' },
    { angle: 45, label: '45° Steep Incline', focus: 'Upper Chest & Front Delts', icon: '▲' },
    { angle: 75, label: '75° Shoulder Press', focus: 'Anterior & Medial Deltoids', icon: '⎮' },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Equipment Calibration Deck */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-black border border-amber-500/25 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-500/15 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Equipment Setup & Ergonomics
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {exercise?.equipment || 'Gym Machine'} Calibration
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                Pre-Set Machine Adjustments & Axis Alignment
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ergonomic Cam Cleared</span>
          </div>
        </div>

        {/* Visual Incline Angle Calibration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              Adjust Bench Backrest / Arm Angle:
            </span>
            <span className="text-amber-300 font-bold font-mono">{inclineAngle}° Incline Track</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INCLINE_PRESETS.map((preset) => {
              const isSelected = inclineAngle === preset.angle;
              return (
                <button
                  key={preset.angle}
                  onClick={() => setInclineAngle(preset.angle)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-gold-glow-sm'
                      : 'bg-black/50 border-white/5 hover:border-amber-500/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                      {preset.label}
                    </span>
                    <span className="text-sm font-mono text-amber-400">{preset.icon}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {preset.focus}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seat Pin Position */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              Seat Height Pin Selection:
            </span>
            <span className="text-amber-300 font-mono text-xs">{seatPin}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['Pin 1 (Low / Tall Athletes)', 'Pin 2 (Standard / Mid)', 'Pin 3 (High / Shorter Reach)'].map((pin) => (
              <button
                key={pin}
                onClick={() => setSeatPin(pin)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                  seatPin === pin
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'bg-obsidian-850 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {pin.split(' ')[0]} {pin.split(' ')[1]}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            *Ensure handles or dumbbells rest at mid-sternum height at the bottom of the movement.
          </p>
        </div>

        {/* Pre-Set Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Interactive Setup Checkpoints (Tap to verify before lifting):
          </h4>

          <div className="space-y-2">
            {(exercise?.setupSteps && exercise.setupSteps.length > 0
              ? exercise.setupSteps
              : [
                  'Adjust bench angle to selected incline pocket (30° recommended).',
                  'Lock seat pin to ensure feet rest firmly flat on the floor.',
                  'Retract scapulae and drive shoulder blades into pad padding.',
                  'Maintain firm neutral wrist alignment over working dumbbells or handles.',
                ]
            ).map((step, idx) => {
              const isChecked = checkedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3.5 rounded-2xl border transition flex items-center gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-obsidian-850/80 border-white/5 hover:border-amber-500/20 text-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-slate-600 bg-black/40'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">{step}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
