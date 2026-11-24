import React from 'react';
import {
  TrendingDown,
  Flame,
  Utensils,
  Scale,
  Award,
  Zap,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Dumbbell,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';

export function OverviewDashboard() {
  const {
    user,
    weightHistory,
    totalCaloriesBurned,
    totalCaloriesConsumed,
    netCalories,
    todaysWorkouts,
    todaysMeals,
    setActiveTab,
    setIsWeightModalOpen,
    setIsMealScannerOpen,
  } = useApp();

  // Weight trajectory analytics
  const firstEntry = weightHistory[0];
  const lastEntry = weightHistory[weightHistory.length - 1];
  const totalWeightLoss = Math.round(((firstEntry?.weight || 82) - (lastEntry?.weight || 78.5)) * 10) / 10;
  const targetRemaining = Math.round(((lastEntry?.weight || 78.5) - (user.targetWeight || 74)) * 10) / 10;

  // Render SVG spline chart for weight history
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 35;
  const weights = weightHistory.map((w) => w.weight);
  const minWeight = Math.min(...weights, user.targetWeight) - 0.8;
  const maxWeight = Math.max(...weights) + 0.8;

  const points = weightHistory.map((item, index) => {
    const x = padding + (index / (weightHistory.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((item.weight - minWeight) / (maxWeight - minWeight)) * (chartHeight - padding * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Target line Y coordinate
  const targetY =
    chartHeight - padding - ((user.targetWeight - minWeight) / (maxWeight - minWeight)) * (chartHeight - padding * 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-glow border border-amber-500/20">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Biometric Performance Summary
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            DAILY METABOLIC COMMAND
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Welcome back, <strong className="text-amber-300">{user.name}</strong> · Focus today:{' '}
            <span className="capitalize text-slate-200">{user.goal.replace('_', ' ')}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="gold-btn-outline px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            <span>Log Weight ({user.currentWeight}kg)</span>
          </button>
          <button
            onClick={() => setIsMealScannerOpen(true)}
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold-glow"
          >
            <Utensils className="w-4 h-4" />
            <span>Scan Meal</span>
          </button>
        </div>
      </div>

      {/* Triad Energy Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calories Ingested */}
        <GlassCard className="p-6 border-amber-500/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Food & Ingestion
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              {totalCaloriesConsumed}
              <span className="text-xs text-slate-400 font-normal">/ {user.dailyCalorieTarget} kcal</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {todaysMeals.length} meal{todaysMeals.length !== 1 ? 's' : ''} logged today
            </p>
          </div>

          <button
            onClick={() => setActiveTab('food')}
            className="pt-3 border-t border-white/5 text-xs font-bold text-amber-400 flex items-center justify-between group"
          >
            <span>Open Food & Recipes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </GlassCard>

        {/* Calories Burned */}
        <GlassCard className="p-6 border-amber-500/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kinetic Energy Burned
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-amber-300 flex items-baseline gap-1">
              {totalCaloriesBurned}
              <span className="text-xs text-slate-400 font-normal">kcal burned</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {todaysWorkouts.length} workout{todaysWorkouts.length !== 1 ? 's' : ''} completed
            </p>
          </div>

          <button
            onClick={() => setActiveTab('fitness')}
            className="pt-3 border-t border-white/5 text-xs font-bold text-amber-400 flex items-center justify-between group"
          >
            <span>Open Fitness & Machines</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </GlassCard>

        {/* Net Calorie Balance */}
        <GlassCard className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-obsidian-850 to-obsidian-900 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Net Caloric Flux
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-amber-300 flex items-baseline gap-1">
              {netCalories >= 0 ? `+${netCalories}` : netCalories}
              <span className="text-xs text-slate-400 font-normal">kcal net</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {netCalories < user.dailyCalorieTarget
                ? `In a controlled deficit (${user.dailyCalorieTarget - netCalories} kcal buffer)`
                : 'Exceeding target maintenance'}
            </p>
          </div>

          <div className="pt-3 border-t border-amber-500/20 text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Optimal rate for {user.goal.replace('_', ' ')}</span>
          </div>
        </GlassCard>
      </div>

      {/* Weight History Trajectory Chart */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border border-amber-500/25 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Biometric Timeline
            </span>
            <h3 className="text-xl font-black text-white">Weight Progression Trajectory</h3>
            <p className="text-xs text-slate-400">
              Consistent downward trend · Lost <strong className="text-emerald-400">{totalWeightLoss} kg</strong> since inception
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-slate-300">Logged Weight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400/50 border-t border-dashed border-amber-400" />
              <span className="text-slate-400">Target ({user.targetWeight}kg)</span>
            </div>
          </div>
        </div>

        {/* SVG Spline Chart */}
        <div className="w-full overflow-x-auto pb-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-48 sm:h-60 block overflow-visible"
          >
            {/* Grid horizontal lines */}
            {[0.25, 0.5, 0.75].map((ratio, i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + ratio * (chartHeight - padding * 2)}
                x2={chartWidth - padding}
                y2={padding + ratio * (chartHeight - padding * 2)}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Target line */}
            <line
              x1={padding}
              y1={targetY}
              x2={chartWidth - padding}
              y2={targetY}
              stroke="#fbbf24"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <text
              x={chartWidth - padding + 5}
              y={targetY + 4}
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
            >
              Goal
            </text>

            {/* Glowing Golden Spline Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.7))"
            />

            {/* Data Points */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#fbbf24"
                  stroke="#08090c"
                  strokeWidth="2.5"
                />
                {/* Tooltip text */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {p.weight}
                </text>
                <text
                  x={p.x}
                  y={chartHeight - 10}
                  fill="#64748b"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {p.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Milestone Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Start Weight</span>
            <div className="text-base font-black text-white">{user.startWeight || 82} kg</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Current</span>
            <div className="text-base font-black text-amber-300">{user.currentWeight} kg</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Target Goal</span>
            <div className="text-base font-black text-amber-400">{user.targetWeight} kg</div>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</span>
            <div className="text-base font-black text-emerald-400">{targetRemaining} kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
