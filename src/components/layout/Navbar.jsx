import React, { useMemo } from 'react';
import {
  Home,
  Dumbbell,
  Utensils,
  LayoutDashboard,
  Scale,
  Flame,
  Camera,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    user,
    workoutLogs,
    setIsWeightModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    openAuthModal,
    setIsMealScannerOpen,
  } = useApp();

  const totalCaloriesBurned = useMemo(() => {
    return (workoutLogs || []).reduce((acc, log) => acc + (log.caloriesBurned || 0), 0);
  }, [workoutLogs]);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand & Logo (Rich Luxury Aesthetic) */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 active:scale-95 transition"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-obsidian-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold text-amber-400">⚡</span>
            </div>
          </div>

          <div>
            <div className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1 leading-none">
              FIT<span className="gold-gradient-text font-extrabold">ARC</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-amber-400/90 font-semibold mt-1 hidden sm:block">
              Golden Standard Fitness & Nutrition
            </div>
            <div className="text-[8px] uppercase tracking-wider text-amber-400/80 font-bold block sm:hidden">
              Elite Athlete
            </div>
          </div>
        </div>

        {/* PRIMARY SECTIONS ON DESKTOP: HOME, FITNESS & FOOD (PLUS OVERVIEW) - HIDDEN ON MOBILE (USING BOTTOM DOCK) */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 bg-black/50 p-1.5 rounded-2xl border border-amber-500/20 shadow-inner">
          {/* HOME SECTION */}
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center gap-2 relative ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-black' : 'text-amber-400'}`} />
            <span>HOME</span>
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-300 rounded-full blur-[1px]" />
            )}
          </button>

          {/* FITNESS SECTION */}
          <button
            onClick={() => setActiveTab('fitness')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center gap-2 relative ${
              activeTab === 'fitness'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Dumbbell className={`w-4 h-4 ${activeTab === 'fitness' ? 'text-black' : 'text-amber-400'}`} />
            <span>FITNESS</span>
            {activeTab === 'fitness' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-300 rounded-full blur-[1px]" />
            )}
          </button>

          {/* FOOD SECTION */}
          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center gap-2 relative ${
              activeTab === 'food'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Utensils className={`w-4 h-4 ${activeTab === 'food' ? 'text-black' : 'text-amber-400'}`} />
            <span>FOOD</span>
            {activeTab === 'food' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-300 rounded-full blur-[1px]" />
            )}
          </button>

          {/* OVERVIEW / DASHBOARD */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-black shadow-gold-glow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Calorie Burn Chip (Live Dynamic Metric) */}
          <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{totalCaloriesBurned} <span className="text-[10px] text-slate-400 font-normal">kcal</span></span>
          </div>

          {/* Quick Weight Status Pill (Desktop only, mobile has it in bottom dock) */}
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-850/90 border border-amber-500/25 hover:border-amber-400 hover:bg-amber-500/10 transition group"
            title="Log or adjust today's weight"
          >
            <Scale className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            <div className="text-left leading-none">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Weight</span>
              <span className="text-xs font-bold text-amber-300">{user.currentWeight} kg</span>
            </div>
          </button>

          {/* Quick Meal Photo Scan Button (Desktop only, mobile has floating center action button) */}
          <button
            onClick={() => setIsMealScannerOpen(true)}
            className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition items-center gap-1.5 active:scale-95"
            title="Upload or snap photo of your food"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline text-xs font-semibold">Scan Food</span>
          </button>

          {/* Profile Avatar / Trigger */}
          <button
            onClick={() => openAuthModal('biometrics')}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-amber-500/40 transition active:scale-95"
            title="Athlete Vault & Biometrics"
            aria-label="Athlete Vault Settings"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold text-[11px] sm:text-xs flex items-center justify-center shadow-gold-glow-sm">
              {user.name?.slice(0, 2).toUpperCase() || 'AV'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
