import React from 'react';
import { Sparkles, Heart, Shield, Dumbbell, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Footer() {
  const { setActiveTab, setIsWeightModalOpen, setIsMealScannerOpen } = useApp();

  return (
    <footer className="w-full border-t border-amber-500/15 bg-obsidian-900/90 backdrop-blur-xl mt-20 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-amber-400">⚡</span>
            <div>
              <div className="text-lg font-black text-white tracking-tight">
                FIT<span className="gold-gradient-text">ARC</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Modern Glassmorphic Dark Gold Fitness & Nutrition Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('fitness')}
              className="hover:text-amber-400 transition"
            >
              Fitness Catalogue
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className="hover:text-amber-400 transition"
            >
              Food & Recipes
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-amber-400 transition"
            >
              Overview & Trajectory
            </button>
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Weight Tracker
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 FITARC Web. Designed with precision glassmorphism dark gold aesthetic.</p>
          <div className="flex items-center gap-2 text-amber-400/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for GitHub Pages, Netlify & Vercel deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
