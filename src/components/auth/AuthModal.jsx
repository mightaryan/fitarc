import React, { useState } from 'react';
import {
  X,
  User,
  Scale,
  Target,
  Flame,
  Clock,
  RotateCcw,
  CheckCircle2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AuthModal({ isOpen, onClose }) {
  const { user, setUser, resetDemoData, triggerConfetti } = useApp();
  const [formData, setFormData] = useState({
    name: user.name || 'Alex Vance',
    email: user.email || 'alex@fitarc.elite',
    currentWeight: user.currentWeight || 78.5,
    targetWeight: user.targetWeight || 74.0,
    height: user.height || 182,
    goal: user.goal || 'fat_loss',
    dailyCalorieTarget: user.dailyCalorieTarget || 2200,
    dailyWorkoutTargetMin: user.dailyWorkoutTargetMin || 45,
    unit: user.unit || 'kg',
  });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      ...formData,
      currentWeight: parseFloat(formData.currentWeight) || prev.currentWeight,
      targetWeight: parseFloat(formData.targetWeight) || prev.targetWeight,
      height: parseInt(formData.height) || prev.height,
      dailyCalorieTarget: parseInt(formData.dailyCalorieTarget) || prev.dailyCalorieTarget,
      dailyWorkoutTargetMin: parseInt(formData.dailyWorkoutTargetMin) || prev.dailyWorkoutTargetMin,
    }));
    setIsSaved(true);
    triggerConfetti();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo logs and return to default profile?')) {
      resetDemoData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-gold-glow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                User Identity & Biometrics
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Profile & Goals
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          {/* Biometrics */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Weight</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white pr-7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">kg</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Weight</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white pr-7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">kg</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Height</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white pr-7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">cm</span>
              </div>
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Objective</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fat_loss', label: 'Fat Loss (Cut)' },
                { id: 'muscle_gain', label: 'Hypertrophy (Bulk)' },
                { id: 'recomp', label: 'Recomposition' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: g.id })}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    formData.goal === g.id
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                      : 'bg-obsidian-850 text-slate-300 border-white/5 hover:border-amber-500/20'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Calorie Target</label>
              <input
                type="number"
                step="50"
                value={formData.dailyCalorieTarget}
                onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Exercise Target (Min)</label>
              <input
                type="number"
                step="5"
                value={formData.dailyWorkoutTargetMin}
                onChange={(e) => setFormData({ ...formData, dailyWorkoutTargetMin: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition p-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              type="submit"
              className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-gold-glow"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
