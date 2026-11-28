import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell } from 'lucide-react';

function getFallbackGif(exercise) {
  if (exercise?.fallbackGif) return exercise.fallbackGif;
  const cat = (exercise?.category || '').toLowerCase();
  const muscle = (exercise?.muscleCategory || exercise?.muscle || '').toLowerCase();
  const name = (exercise?.name || '').toLowerCase();

  if (exercise?.subCategory === 'exercise_ball' || exercise?.equipment === 'exercise_ball') {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/back-extension-on-exercise-ball.gif';
  }
  if (cat === 'yoga' || exercise?.equipment === 'yogamat' || name.includes('yoga') || name.includes('surya') || name.includes('flow')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif';
  }
  if (cat === 'cardio' || exercise?.subCategory === 'hiit_cardio' || name.includes('burpee') || name.includes('jack')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif';
  }
  if (muscle.includes('core') || muscle.includes('abs') || name.includes('crunch') || name.includes('plank')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif';
  }
  if (muscle.includes('leg') || muscle.includes('quad') || muscle.includes('glute') || name.includes('squat')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/split-squats.gif';
  }
  if (muscle.includes('back') || muscle.includes('lat') || name.includes('row')) {
    return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/suspended-row.gif';
  }
  return 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif';
}

/**
 * Clean Beginner-Minimalist Exercise Animation Viewer
 */
export function Anatomical3DPlayer({ exercise, isMini = false }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef(null);

  const fallbackSrc = getFallbackGif(exercise);
  const gifUrl = exercise?.gifUrl || fallbackSrc;

  useEffect(() => {
    setImgError(false);
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setImgLoaded(true);
    } else {
      setImgLoaded(false);
      const timer = setTimeout(() => setImgLoaded(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [exercise?.id, gifUrl]);

  const levelBadgeClass =
    exercise?.level === 'Beginner'
      ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40'
      : exercise?.level === 'Advanced'
      ? 'bg-rose-950/85 text-rose-300 border-rose-500/40'
      : 'bg-amber-950/85 text-amber-300 border-amber-500/40';

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-[#08090C] shadow-2xl flex flex-col">
      <div className="relative w-full overflow-hidden bg-[#08090C] flex items-center justify-center min-h-[260px] sm:min-h-[340px]">
        <div className="absolute inset-0 bg-radial-gold opacity-10 pointer-events-none" />

        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-obsidian-950/90 z-10">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-slate-300">Loading exercise demo...</span>
          </div>
        )}

        <div className="relative w-full h-full flex items-center justify-center p-3">
          <img
            ref={imgRef}
            key={exercise?.id || gifUrl}
            src={imgError ? fallbackSrc : gifUrl}
            alt={exercise?.name || 'Exercise demonstration'}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              if (!imgError) {
                setImgError(true);
                e.currentTarget.src = fallbackSrc;
              }
            }}
            className="h-[240px] sm:h-[310px] w-auto max-w-full object-contain dark-3d-animation"
          />

          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${levelBadgeClass}`}>
              {exercise?.level || 'Beginner'}
            </span>
          </div>

          <div className="absolute top-3 right-3 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/80 border border-white/10 text-slate-300 flex items-center gap-1">
              <Dumbbell className="w-3 h-3 text-amber-400" />
              <span>{exercise?.equipmentLabel || exercise?.equipment || 'Bodyweight'}</span>
            </span>
          </div>
        </div>
      </div>

      {!isMini && exercise?.primaryMuscles?.length > 0 && (
        <div className="px-4 py-2.5 bg-obsidian-900/90 border-t border-white/5 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Focus Areas:</span>
          {exercise.primaryMuscles.slice(0, 3).map((m, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/15 border border-amber-500/25 text-amber-200"
            >
              {m.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
export default Anatomical3DPlayer;
