import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { RealisticBiomechanicsPlayer } from './RealisticBiomechanicsPlayer';

export function Anatomical3DPlayer({ exercise, isMini = false }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState('3d_gif'); // '3d_gif' | 'angle_simulator'
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const gifUrl = exercise?.gifUrl;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-[#08090C] shadow-2xl flex flex-col group">
      {/* Top View Selector Bar */}
      {!isMini && (
        <div className="p-3 sm:px-4 bg-obsidian-900/95 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('3d_gif')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                viewMode === '3d_gif'
                  ? 'bg-amber-500 text-black shadow-gold-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Anatomical Motion (Dark Mode)</span>
            </button>
            <button
              onClick={() => setViewMode('angle_simulator')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'angle_simulator'
                  ? 'bg-amber-500 text-black shadow-gold-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Angle & Joint Shear Simulator</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300">
              ⚡ {exercise.muscleCategory || 'Primary'} Target
            </span>
          </div>
        </div>
      )}

      {/* Main View Area: Seamless Dark Obsidian Chamber */}
      <div className="relative w-full overflow-hidden bg-[#08090C] flex items-center justify-center min-h-[220px] sm:min-h-[380px]">
        {viewMode === '3d_gif' && gifUrl && !imgError ? (
          <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-[#0c0d14] via-[#08090C] to-[#050608]">
            {/* Ambient gold radial glow */}
            <div className="absolute inset-0 bg-radial-gold opacity-25 pointer-events-none" />

            {/* Skeleton loading indicator */}
            {!imgLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-obsidian-900 z-10">
                <div className="w-9 h-9 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <span className="text-xs font-medium text-amber-300/80 tracking-wider">
                  Loading 3D Muscle Anatomy...
                </span>
              </div>
            )}

            {/* 3D Anatomical GIF Image with Dark Mode Transformation Filter */}
            <img
              src={gifUrl}
              alt={exercise.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setViewMode('angle_simulator');
              }}
              className="max-h-[360px] w-auto object-contain rounded-2xl transition duration-300 dark-3d-animation"
            />

            {/* Floating Telemetry Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-black/80 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Active 3D Muscle Highlight
              </span>

              {exercise.primaryMuscles?.[0] && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/70 border border-white/10 text-slate-300 backdrop-blur-md">
                  Target: {exercise.primaryMuscles[0].name} ({exercise.primaryMuscles[0].percentage}%)
                </span>
              )}
            </div>

            {/* Equipment Tag */}
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider bg-black/80 border border-white/10 text-slate-400 backdrop-blur-md">
                {exercise.equipment || 'Gym Machine'}
              </span>
            </div>
          </div>
        ) : (
          <RealisticBiomechanicsPlayer exercise={exercise} isMini={isMini} />
        )}
      </div>

      {/* Caption & Target Muscle Fiber Indicator */}
      {!isMini && viewMode === '3d_gif' && (
        <div className="p-3 bg-obsidian-900/90 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Illuminated Fibers:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {exercise.primaryMuscles?.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300"
                >
                  ⚡ {m.name}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setViewMode('angle_simulator')}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
          >
            <span>Angle Shear Analysis</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
}
