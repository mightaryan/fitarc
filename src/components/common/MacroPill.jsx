import React from 'react';

export function MacroPill({ label, value, unit = 'g', color = 'amber' }) {
  const colorStyles = {
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    blue: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  };

  return (
    <div className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm ${colorStyles[color] || colorStyles.amber}`}>
      <span className="text-slate-400 font-normal">{label}:</span>
      <span className="font-semibold">{value}{unit}</span>
    </div>
  );
}
