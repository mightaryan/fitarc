import React from 'react';
import clsx from 'clsx';

export function GlassCard({ children, className = '', glow = false, hoverEffect = true, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        glow ? 'glass-panel-glow' : 'glass-card',
        hoverEffect && 'hover:border-amber-400/40 hover:shadow-gold-card',
        className
      )}
      {...props}
    >
      {/* Ambient gold glow highlight inside the card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
      {children}
    </div>
  );
}
