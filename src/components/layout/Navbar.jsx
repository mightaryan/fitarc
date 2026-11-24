import React from 'react';
import {
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
    setIsWeightModalOpen,
    setIsAuthModalOpen,
    setIsMealScannerOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo (Rich Luxury Aesthetic) */}
        <div
          onClick={() => setActiveTab('fitness')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-obsidian-900 rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-bold text-amber-400">⚡</span>
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1">
              FIT<span className="gold-gradient-text font-extrabold">ARC</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-amber-400/90 font-semibold -mt-0.5 hidden sm:block">
              Golden Standard Fitness & Nutrition
            </div>
          </div>
        </div>

        {/* PRIMARY TWO SECTIONS ON TOP: FITNESS & FOOD (PLUS OVERVIEW) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-black/50 p-1.5 rounded-2xl border border-amber-500/20 shadow-inner">
          {/* FITNESS SECTION */}
          <button
            onClick={() => setActiveTab('fitness')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center gap-2 relative ${
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
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition flex items-center gap-2 relative ${
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
            className={`hidden md:flex px-4 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition items-center gap-1.5 ${
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
          {/* Quick Weight Status Pill */}
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

          {/* Quick Meal Photo Scan Button */}
          <button
            onClick={() => setIsMealScannerOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition flex items-center gap-1.5"
            title="Upload or snap photo of your food"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline text-xs font-semibold">Scan Food</span>
          </button>

          {/* Profile Avatar / Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-amber-500/40 transition"
            title="Account & Goals"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold text-xs flex items-center justify-center shadow-gold-glow-sm">
              {user.name?.slice(0, 2).toUpperCase() || 'AV'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
