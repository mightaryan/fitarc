import React from 'react';
import {
  Dumbbell,
  Utensils,
  Camera,
  Scale,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    user,
    setIsWeightModalOpen,
    setIsAuthModalOpen,
    setIsMealScannerOpen,
  } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-obsidian-950/95 backdrop-blur-2xl border-t border-amber-500/25 px-2 pt-1.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-[0_-12px_40px_rgba(0,0,0,0.95)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* 1. FITNESS / WORKOUTS */}
        <button
          onClick={() => setActiveTab('fitness')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 relative ${
            activeTab === 'fitness'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
          aria-label="Fitness Tab"
        >
          <div className="relative">
            <Dumbbell
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'fitness' ? 'scale-110 text-amber-400' : 'text-slate-400'
              }`}
            />
            {activeTab === 'fitness' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Fitness</span>
          {activeTab === 'fitness' && (
            <span className="absolute -bottom-1 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
        </button>

        {/* 2. FOOD / NUTRITION */}
        <button
          onClick={() => setActiveTab('food')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 relative ${
            activeTab === 'food'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
          aria-label="Food & Nutrition Tab"
        >
          <div className="relative">
            <Utensils
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'food' ? 'scale-110 text-amber-400' : 'text-slate-400'
              }`}
            />
            {activeTab === 'food' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Food</span>
          {activeTab === 'food' && (
            <span className="absolute -bottom-1 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
        </button>

        {/* 3. CENTER ELEVATED FLOATING ACTION BUTTON: AI MEAL SCANNER */}
        <div className="relative -mt-6 flex flex-col items-center">
          <button
            onClick={() => setIsMealScannerOpen(true)}
            className="w-13 h-13 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.65)] hover:shadow-[0_0_35px_rgba(245,158,11,0.9)] active:scale-90 transition-all duration-200 group flex items-center justify-center"
            title="Instant AI Meal Photo Scanner"
            aria-label="Scan Meal with AI"
          >
            <div className="w-12 h-12 rounded-full bg-obsidian-950 flex flex-col items-center justify-center border border-amber-300/40 group-hover:bg-amber-500/20 transition">
              <Camera className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            </div>
          </button>
          <span className="text-[9px] font-bold tracking-wider uppercase text-amber-400/90 mt-1 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            AI Scan
          </span>
        </div>

        {/* 4. DAILY WEIGHT CHECK-IN */}
        <button
          onClick={() => setIsWeightModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-400 hover:text-amber-300 transition-all duration-200 active:scale-90 relative"
          aria-label="Log Weight"
        >
          <div className="relative">
            <Scale className="w-5 h-5 text-slate-400 hover:text-amber-400 transition" />
          </div>
          <span className="text-[10px] mt-1 font-semibold text-slate-300 tracking-tight">
            {user.currentWeight ? `${user.currentWeight}kg` : 'Weight'}
          </span>
        </button>

        {/* 5. ATHLETE VAULT & PROFILE */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-400 hover:text-amber-300 transition-all duration-200 active:scale-90 relative"
          aria-label="Athlete Profile & Vault"
        >
          <div className="relative">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold text-[9px] flex items-center justify-center shadow-gold-glow-sm">
              {user.name?.slice(0, 2).toUpperCase() || 'AV'}
            </div>
          </div>
          <span className="text-[10px] mt-1 font-semibold text-slate-300 tracking-tight">
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
}
