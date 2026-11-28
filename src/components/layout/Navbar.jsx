import React from 'react';
import {
  Home,
  Dumbbell,
  Utensils,
  ShoppingBag,
  LayoutDashboard,
  Scale,
  Flame,
  Camera,
  ChevronDown,
  Megaphone,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FitArcLogo } from '../common/FitArcLogo';

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    user,
    totalCaloriesBurned,
    setIsWeightModalOpen,
    openAuthModal,
    setIsMealScannerOpen,
    siteSettings,
    hasPaidPlan,
    t,
  } = useApp();

  const shopEnabled = siteSettings?.shopEnabled !== false;

  return (
    <>
      {siteSettings?.maintenanceMode && (
        <div className="w-full bg-rose-950/90 border-b border-rose-500/40 text-rose-200 text-[11px] font-bold px-4 py-1.5 flex items-center justify-center gap-2 z-50">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Scheduled Platform Maintenance Active — Public services temporarily paused</span>
        </div>
      )}

      {siteSettings?.announcementEnabled && siteSettings?.announcementText && !hasPaidPlan && (
        <div className="hidden md:flex w-full bg-gradient-to-r from-amber-950/80 via-obsidian-900 to-emerald-950/70 border-b border-amber-500/20 text-amber-200 text-[11px] px-4 py-1.5 items-center justify-center gap-2.5 z-40">
          <Megaphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate font-semibold">{siteSettings.announcementText}</span>
          {shopEnabled && (
            <button
              onClick={() => setActiveTab('shop')}
              className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold hover:bg-amber-500/30 transition shrink-0"
            >
              Visit Shop →
            </button>
          )}
        </div>
      )}

      <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
          {/* Artistic Emblem & Editorial Brand Wordmark */}
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group shrink-0 active:scale-95 transition"
          >
            <FitArcLogo
              brandName={siteSettings?.brandName || 'FITARC'}
              tagline={siteSettings?.tagline || 'Golden Standard Fitness & Nutrition'}
              logoStyle={siteSettings?.logoStyle || 'kinetic_arc'}
              customLogoUrl={siteSettings?.customLogoUrl || ''}
              showTagline
            />
          </div>

          {/* PRIMARY DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/55 p-1.5 rounded-2xl border border-amber-500/20 shadow-inner">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 relative ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-black' : 'text-amber-400'}`} />
              <span>{t?.('nav.home') || 'HOME'}</span>
            </button>

            <button
              onClick={() => setActiveTab('fitness')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 relative ${
                activeTab === 'fitness'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${activeTab === 'fitness' ? 'text-black' : 'text-amber-400'}`} />
              <span>{t?.('nav.fitness') || 'FITNESS'}</span>
            </button>

            <button
              onClick={() => setActiveTab('food')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 relative ${
                activeTab === 'food'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Utensils className={`w-4 h-4 ${activeTab === 'food' ? 'text-black' : 'text-amber-400'}`} />
              <span>{t?.('nav.food') || 'FOOD'}</span>
            </button>

            {shopEnabled && (
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 relative ${
                  activeTab === 'shop'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.4)] font-bold'
                    : 'text-emerald-300 hover:text-white hover:bg-emerald-500/10'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'shop' ? 'text-black' : 'text-emerald-400'}`} />
                <span>{t?.('nav.shop') || 'SHOP'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-black shadow-gold-glow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t?.('nav.dashboard') || 'OVERVIEW'}</span>
            </button>
          </nav>

          {/* Compact Tablet Switcher (md only) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 bg-black/55 p-1 rounded-2xl border border-amber-500/20">
            {[
              { id: 'home', label: t?.('nav.home') || 'Home' },
              { id: 'fitness', label: t?.('nav.fitness') || 'Fit' },
              { id: 'food', label: t?.('nav.food') || 'Food' },
              ...(shopEnabled ? [{ id: 'shop', label: t?.('nav.shop') || 'Shop' }] : []),
              { id: 'dashboard', label: t?.('nav.dashboard') || 'Stats' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === item.id ? 'bg-amber-500 text-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex md:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{totalCaloriesBurned}</span>
            </div>

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

            <button
              onClick={() => setIsMealScannerOpen(true)}
              className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition items-center gap-1.5 active:scale-95"
              title="Upload or snap photo of your food"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline text-xs font-semibold">Scan Food</span>
            </button>

            <button
              onClick={() => openAuthModal('biometrics')}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-amber-500/40 transition active:scale-95"
              title="Athlete Vault & Profile Settings"
              aria-label="Athlete Vault Settings"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold text-[11px] sm:text-xs flex items-center justify-center shadow-gold-glow-sm overflow-hidden shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.slice(0, 2).toUpperCase() || 'AV'
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
