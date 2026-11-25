import React, { useState } from 'react';
import {
  Scale,
  X,
  BellOff,
  Clock,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function DailyWeightModal({ isOpen, onClose }) {
  const { user, weightHistory, logDailyWeight, snoozeWeightReminder, snoozeUntil } = useApp();
  const [weight, setWeight] = useState(user.currentWeight || 78.5);
  const [note, setNote] = useState('Morning fasted weigh-in');
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

  if (!isOpen) return null;

  const lastEntry = weightHistory[weightHistory.length - 1];
  const previousWeight = lastEntry?.weight || user.currentWeight;
  const delta = Math.round((weight - previousWeight) * 10) / 10;
  const targetDelta = Math.round((weight - user.targetWeight) * 10) / 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    logDailyWeight(weight, note);
  };

  const handleSnooze = (days) => {
    snoozeWeightReminder(days);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass-panel-glow rounded-t-3xl sm:rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl p-5 sm:p-8 space-y-6">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-gold-glow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Daily Check-In
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Log Today's Body Weight
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

        {/* Weight Input Box */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl bg-black/50 border border-amber-500/20 text-center space-y-3">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Current Weight Reading
            </div>

            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || '')}
                className="w-36 text-center text-4xl sm:text-5xl font-black text-amber-300 bg-transparent border-b-2 border-amber-400 focus:outline-none focus:border-amber-300 pb-1"
                autoFocus
              />
              <span className="text-xl font-bold text-slate-400 self-end mb-2">
                {user.unit || 'kg'}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={Math.max(40, Math.floor(user.currentWeight - 10))}
              max={Math.ceil(user.currentWeight + 10)}
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-obsidian-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            {/* Delta vs Previous */}
            <div className="flex justify-center items-center gap-4 text-xs pt-1">
              <span className="text-slate-400">
                vs Previous:{' '}
                <strong className={delta <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                  {delta > 0 ? `+${delta}` : delta} kg
                </strong>
              </span>
              <span>·</span>
              <span className="text-slate-400">
                To Target ({user.targetWeight}kg):{' '}
                <strong className="text-amber-300">
                  {targetDelta > 0 ? `${targetDelta} kg to go` : 'Goal achieved!'}
                </strong>
              </span>
            </div>
          </div>

          {/* Quick Context Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quick Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Fasted morning, post sauna, heavy dinner yesterday"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full gold-btn py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-gold-glow"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Log {weight} {user.unit || 'kg'}</span>
          </button>
        </form>

        {/* Snooze Reminder Section */}
        <div className="pt-2 border-t border-white/5">
          {!showSnoozeOptions ? (
            <button
              onClick={() => setShowSnoozeOptions(true)}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-amber-300 flex items-center justify-center gap-1.5 transition"
            >
              <BellOff className="w-3.5 h-3.5" />
              <span>Snooze weight reminder for next few days...</span>
            </button>
          ) : (
            <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Choose Snooze Duration:
                </span>
                <button
                  onClick={() => setShowSnoozeOptions(false)}
                  className="text-slate-500 hover:text-slate-300 text-[11px]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: '1 Day', days: 1 },
                  { label: '2 Days', days: 2 },
                  { label: '3 Days', days: 3 },
                  { label: '1 Week', days: 7 },
                ].map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => handleSnooze(opt.days)}
                    className="py-2 px-2.5 rounded-xl text-xs font-bold bg-obsidian-800 border border-white/10 hover:border-amber-400 hover:text-amber-300 transition text-center"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
