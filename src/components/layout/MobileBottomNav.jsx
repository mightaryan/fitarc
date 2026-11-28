import React from 'react';
import {
  Home,
  Dumbbell,
  Utensils,
  Camera,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    setIsMealScannerOpen,
    siteSettings,
    t,
  } = useApp();

  const shopEnabled = siteSettings?.shopEnabled !== false;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-obsidian-950/95 backdrop-blur-2xl border-t border-amber-500/30 px-2 pt-1.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-[0_-14px_45px_rgba(0,0,0,0.96)]"
      aria-label="Mobile Bottom Navigation"
    >
      {/* 5 equal symmetric columns so the center Scan FAB stays strictly dead center */}
      <div className="max-w-lg mx-auto grid grid-cols-5 items-center relative">
        {/* 1. HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 relative ${
            activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
          aria-label="Home Tab"
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'scale-110 text-amber-400' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">{t?.('nav.home') || 'Home'}</span>
          {activeTab === 'home' && (
            <span className="absolute -bottom-0.5 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.85)]" />
          )}
        </button>

        {/* 2. FITNESS */}
        <button
          onClick={() => setActiveTab('fitness')}
          className={`min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 relative ${
            activeTab === 'fitness' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
          aria-label="Fitness Movement Archive"
        >
          <Dumbbell className={`w-5 h-5 ${activeTab === 'fitness' ? 'scale-110 text-amber-400' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">{t?.('nav.fitness') || 'Fitness'}</span>
          {activeTab === 'fitness' && (
            <span className="absolute -bottom-0.5 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.85)]" />
          )}
        </button>

        {/* 3. DEAD-CENTER ELEVATED FLOATING ACTION BUTTON: AI MEAL SCANNER */}
        <div className="relative -mt-6 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsMealScannerOpen(true)}
            className="w-12 h-12 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 shadow-[0_0_24px_rgba(245,158,11,0.65)] active:scale-90 transition-all duration-200 group flex items-center justify-center"
            title="Instant AI Meal Photo Scanner"
            aria-label="Scan Meal with AI"
          >
            <div className="w-full h-full rounded-full bg-obsidian-950 flex items-center justify-center border border-amber-300/40 group-hover:bg-amber-500/20 transition">
              <Camera className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            </div>
          </button>
          <span className="text-[9px] font-bold tracking-wider uppercase text-amber-400/90 mt-1 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            {t?.('nav.scan') || 'Scan'}
          </span>
        </div>

        {/* 4. FOOD */}
        <button
          onClick={() => setActiveTab('food')}
          className={`min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 relative ${
            activeTab === 'food' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
          aria-label="Food & Nutrition Tab"
        >
          <Utensils className={`w-5 h-5 ${activeTab === 'food' ? 'scale-110 text-amber-400' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">{t?.('nav.food') || 'Food'}</span>
          {activeTab === 'food' && (
            <span className="absolute -bottom-0.5 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.85)]" />
          )}
        </button>

        {/* 5. SHOP (or Overview fallback when Shop is hidden so Scan stays centered) */}
        {shopEnabled ? (
          <button
            onClick={() => setActiveTab('shop')}
            className={`min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 relative ${
              activeTab === 'shop' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-emerald-300 font-medium'
            }`}
            aria-label="Trustified Supplement Shop"
          >
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'shop' ? 'scale-110 text-emerald-400' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">{t?.('nav.shop') || 'Shop'}</span>
            {activeTab === 'shop' && (
              <span className="absolute -bottom-0.5 w-6 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.85)]" />
            )}
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 relative ${
              activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
            aria-label="Overview Tab"
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'scale-110 text-amber-400' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">{t?.('nav.dashboard') || 'Overview'}</span>
            {activeTab === 'dashboard' && (
              <span className="absolute -bottom-0.5 w-6 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.85)]" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
