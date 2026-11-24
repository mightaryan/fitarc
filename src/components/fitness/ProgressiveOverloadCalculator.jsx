import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Zap,
  Layers,
  Flame,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

export function ProgressiveOverloadCalculator({ exercise, userWeightKg = 75 }) {
  // Base working weight relative to user bodyweight and exercise level
  const defaultWorkingWeight = Math.round(userWeightKg * (exercise.metScore > 7 ? 1.1 : 0.85));
  const [workingWeight, setWorkingWeight] = useState(defaultWorkingWeight);
  const [setsCount, setSetsCount] = useState(4);

  // Compute 1RM estimate: WorkingWeight * (1 + 0.0333 * 8 reps)
  const estimated1RM = Math.round(workingWeight * 1.25);
  const weightToBwRatio = (workingWeight / userWeightKg).toFixed(2);

  // Classification
  let strengthTier = 'Intermediate';
  let tierColor = 'text-amber-400';
  if (weightToBwRatio < 0.75) {
    strengthTier = 'Foundation / Novice';
    tierColor = 'text-slate-300';
  } else if (weightToBwRatio >= 0.75 && weightToBwRatio < 1.25) {
    strengthTier = 'Solid Hypertrophy Lifter';
    tierColor = 'text-amber-300';
  } else if (weightToBwRatio >= 1.25 && weightToBwRatio < 1.65) {
    strengthTier = 'Elite Strength Freak';
    tierColor = 'text-amber-400';
  } else {
    strengthTier = 'National Competitive Beast';
    tierColor = 'text-yellow-300';
  }

  // Progressive Pyramid Sets Engine
  const pyramidSets = [
    {
      setNum: 1,
      name: 'Neural Warmup & Flow',
      percentage: 50,
      weight: Math.round(estimated1RM * 0.50),
      targetReps: '12 - 15',
      rpe: 'RPE 5.5 (Warmup)',
      purpose: 'Elevate joint synovial lubrication and groove motor pattern',
      badge: 'Primer',
    },
    {
      setNum: 2,
      name: 'Hypertrophy Feeder',
      percentage: 70,
      weight: Math.round(estimated1RM * 0.70),
      targetReps: '10 - 12',
      rpe: 'RPE 7.0 (Moderate)',
      purpose: 'Activate high-threshold fast twitch Type II muscle fibers',
      badge: 'Volume',
    },
    {
      setNum: 3,
      name: 'Mechanical Tension Anchor',
      percentage: 80,
      weight: Math.round(estimated1RM * 0.80),
      targetReps: '8 - 10',
      rpe: 'RPE 8.5 (Heavy)',
      purpose: 'Maximum micro-trauma and intracellular anabolic signaling',
      badge: 'Hypertrophy',
    },
    {
      setNum: 4,
      name: 'Top Overload / Peak Set',
      percentage: 88,
      weight: Math.round(estimated1RM * 0.88),
      targetReps: '6 - 8',
      rpe: 'RPE 9.5 (Near-Failure)',
      purpose: 'Progressive overload driver to stimulate neurological adaptation',
      badge: 'Peak Driver',
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-black border border-amber-500/25 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-500/15 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Pyramid Protocol
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {userWeightKg}kg Mass Calibration
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Progressive Overload & Weight-to-Bodyweight Ratio
            </h3>
          </div>
        </div>

        {/* Strength Tier Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30">
          <Award className="w-4 h-4 text-amber-400" />
          <div className="text-left text-xs">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Tier</span>
            <span className={`font-black ${tierColor}`}>{strengthTier}</span>
          </div>
        </div>
      </div>

      {/* Weight Ratio Metric Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Working Weight</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="2.5"
              min="5"
              max="400"
              value={workingWeight}
              onChange={(e) => setWorkingWeight(parseFloat(e.target.value) || 0)}
              className="w-24 text-xl font-black text-amber-300 bg-obsidian-800 border border-amber-500/30 rounded-lg px-2 py-0.5 text-center focus:outline-none"
            />
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Weight-to-Body Ratio</span>
          <div className="text-xl font-black text-amber-300 flex items-baseline gap-1">
            {weightToBwRatio}x
            <span className="text-[10px] text-slate-400 font-normal">of your {userWeightKg}kg mass</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Estimated 1-Rep Max</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            ~{estimated1RM}
            <span className="text-xs text-slate-400 font-normal">kg 1RM</span>
          </div>
        </div>
      </div>

      {/* Set-by-Set Pyramid Progression Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Set-by-Set Progression (Overload Each Set)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Increase weight every set</span>
        </div>

        <div className="space-y-2.5">
          {pyramidSets.slice(0, setsCount).map((set) => (
            <div
              key={set.setNum}
              className="p-3.5 rounded-2xl bg-obsidian-850/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/25 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  #{set.setNum}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{set.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {set.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{set.purpose}</p>
                </div>
              </div>

              {/* Set Weight & Target Reps */}
              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                <div className="text-left sm:text-right">
                  <div className="text-xs sm:text-sm font-black text-amber-300">
                    {set.weight} kg <span className="text-[10px] text-slate-400 font-normal">({set.percentage}%)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{set.targetReps} reps</div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/60 border border-white/10 text-slate-300 whitespace-nowrap">
                  {set.rpe}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
