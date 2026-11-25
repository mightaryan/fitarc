import React, { useState } from 'react';
import {
  X,
  Flame,
  Zap,
  Shield,
  Activity,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Target,
  Award,
  Home,
  Dumbbell,
  Sun,
  MapPin,
} from 'lucide-react';
import { TARGET_AREAS, TRANSFORMATION_PLANS, WORKOUT_LOCATIONS } from '../../data/transformationPlans';
import { useApp } from '../../context/AppContext';

export function PlanSelectorModal({ isOpen, onClose }) {
  const { user, selectTransformationPlan } = useApp();
  const [selectedArea, setSelectedArea] = useState(user.activePlan?.targetArea || 'belly_fat');
  const [selectedDuration, setSelectedDuration] = useState(user.activePlan?.durationDays || 30);
  const [selectedLocation, setSelectedLocation] = useState(user.activePlan?.workoutLocation || 'home');

  if (!isOpen) return null;

  const currentPlan = TRANSFORMATION_PLANS.find(
    (p) => p.targetArea === selectedArea && p.durationDays === selectedDuration
  ) || TRANSFORMATION_PLANS[0];

  const handleActivatePlan = () => {
    selectTransformationPlan({
      ...currentPlan,
      workoutLocation: selectedLocation,
    });
    onClose();
  };

  const getAreaIcon = (id) => {
    switch (id) {
      case 'belly_fat': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'hiit_600': return <Zap className="w-4 h-4 text-rose-400" />;
      case 'calisthenics': return <Award className="w-4 h-4 text-amber-400" />;
      case 'thigh_fat': return <Target className="w-4 h-4 text-emerald-400" />;
      case 'back_fat': return <Shield className="w-4 h-4 text-sky-400" />;
      case 'overall_fat': return <Activity className="w-4 h-4 text-rose-400" />;
      case 'yoga_face': return <Sparkles className="w-4 h-4 text-amber-300" />;
      default: return <Target className="w-4 h-4 text-amber-400" />;
    }
  };

  const getLocationIcon = (id) => {
    switch (id) {
      case 'home': return <Home className="w-4 h-4 text-amber-400" />;
      case 'gym': return <Dumbbell className="w-4 h-4 text-sky-400" />;
      case 'calisthenics': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'yoga': return <Sun className="w-4 h-4 text-amber-300" />;
      default: return <MapPin className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-obsidian-900/90 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-gold-glow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Precision Protocols
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Select Your Transformation Plan
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* STEP 1: CHOOSE TARGET FOCUS AREA */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Step 1: Choose Your Target Body Area
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGET_AREAS.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                    selectedArea === area.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-gold-glow-sm'
                      : 'bg-obsidian-850/80 border-white/5 text-slate-300 hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    {getAreaIcon(area.id)}
                    {selectedArea === area.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold leading-tight">{area.label}</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{area.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: CHOOSE TIMELINE (30, 60, 90 DAYS) */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Step 2: Choose Your Plan Duration
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { days: 30, pace: 'High Intensity Sprint', icon: '⚡' },
                { days: 60, pace: 'Sustainable Tone', icon: '🎯' },
                { days: 90, pace: 'Master Metamorphosis', icon: '👑' },
              ].map((d) => (
                <button
                  key={d.days}
                  onClick={() => setSelectedDuration(d.days)}
                  className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                    selectedDuration === d.days
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 font-bold shadow-gold-glow-sm'
                      : 'bg-obsidian-850 border-white/5 text-slate-300 hover:border-amber-500/30'
                  }`}
                >
                  <div className="text-base sm:text-lg font-black">{d.days} Days</div>
                  <div className={`text-[10px] mt-0.5 ${selectedDuration === d.days ? 'text-black/80 font-semibold' : 'text-slate-400'}`}>
                    {d.pace}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: CHOOSE WORKOUT LOCATION */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Step 3: Choose Your Workout Location & Environment
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {WORKOUT_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                    selectedLocation === loc.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-gold-glow-sm'
                      : 'bg-obsidian-850/80 border-white/5 text-slate-300 hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      {getLocationIcon(loc.id)}
                      <span className="text-xs font-bold leading-tight">{loc.label}</span>
                    </div>
                    {selectedLocation === loc.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 border border-white/5 inline-block self-start font-mono">
                    {loc.badge}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{loc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* SELECTED PLAN HIGHLIGHT PREVIEW */}
          {currentPlan && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-amber-500/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentPlan.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {WORKOUT_LOCATIONS.find((l) => l.id === selectedLocation)?.label || 'Home'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">
                    {currentPlan.title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Daily Deficit</span>
                  <span className="text-sm font-black text-amber-300">-{currentPlan.dailyCalorieDeficit} kcal</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPlan.description}
              </p>

              {/* Targets Summary Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Workouts</span>
                  <span className="text-xs font-bold text-amber-300">{currentPlan.workoutDaysPerWeek}x / week</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Daily Sugar</span>
                  <span className="text-xs font-bold text-emerald-300">&lt; {currentPlan.dailySugarLimitGrams}g</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Target</span>
                  <span className="text-xs font-bold text-sky-300">{currentPlan.durationDays} Days</span>
                </div>
              </div>

              {/* Daily Checklist */}
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Daily Protocol Checklist:
                </span>
                {currentPlan.dailyChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 p-4 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleActivatePlan}
            className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-gold-glow active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Activate {currentPlan.durationDays}-Day Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
