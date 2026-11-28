import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { YOGA_AND_HOME_WORKOUTS } from '../../../data/yogaAndHomeWorkouts';
import { HOME_WORKOUTS_EXPANDED } from '../../../data/homeWorkoutsExpanded';
import { CALISTHENICS_EXERCISES } from '../../../data/calisthenicsExercises';
import { MASTER_EXERCISE_CATALOG } from '../../../data/allExercisesMaster';

export function AdminExercisesModule({ onFlash }) {
  const {
    customExercises,
    disabledExerciseIds,
    exerciseOverrides,
    adminUpsertExercise,
    adminToggleExerciseDisabled,
    adminDeleteCustomExercise,
    adminResetExerciseOverride,
  } = useApp();

  const [exQuery, setExQuery] = useState('');
  const [exCat, setExCat] = useState('yoga_mat');
  const [editingExercise, setEditingExercise] = useState(null);

  const catalogList = useMemo(() => {
    const base = [
      ...(customExercises || []),
      ...YOGA_AND_HOME_WORKOUTS,
      ...HOME_WORKOUTS_EXPANDED,
      ...CALISTHENICS_EXERCISES,
      ...MASTER_EXERCISE_CATALOG,
    ].map((ex) => {
      const ov = exerciseOverrides?.[ex.id];
      return ov ? { ...ex, ...ov, hasOverride: true } : ex;
    });

    const q = exQuery.trim().toLowerCase();
    return base
      .filter((ex) => {
        if (exCat === 'custom') return Boolean(ex.isCustom);
        if (exCat === 'hidden') return (disabledExerciseIds || []).includes(ex.id);
        if (exCat !== 'all' && ex.subCategory !== exCat && ex.category !== exCat) return false;
        if (!q) return true;
        return (
          (ex.name || '').toLowerCase().includes(q) ||
          (ex.category || '').toLowerCase().includes(q) ||
          (ex.muscleCategory || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 60);
  }, [customExercises, exerciseOverrides, disabledExerciseIds, exCat, exQuery]);

  const handleSave = (e) => {
    e.preventDefault();
    adminUpsertExercise(editingExercise);
    onFlash(`Saved "${editingExercise.name}" live across Fitness frontend!`);
    setEditingExercise(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={exQuery}
            onChange={(e) => setExQuery(e.target.value)}
            placeholder="Search Yoga, Home, Calisthenics, Gym, or Custom movements..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={exCat}
            onChange={(e) => setExCat(e.target.value)}
            className="px-3 py-2.5 rounded-xl glass-input text-xs font-bold text-slate-200"
          >
            <option className="bg-obsidian-900" value="yoga_mat">Mat Yoga Asanas</option>
            <option className="bg-obsidian-900" value="exercise_ball">Stability Ball Yoga</option>
            <option className="bg-obsidian-900" value="home_workout">Home Workouts</option>
            <option className="bg-obsidian-900" value="calisthenics">Calisthenics</option>
            <option className="bg-obsidian-900" value="machines">Gym Machines</option>
            <option className="bg-obsidian-900" value="freeweights">Free Weights</option>
            <option className="bg-obsidian-900" value="custom">Admin Custom ({customExercises?.length || 0})</option>
            <option className="bg-obsidian-900" value="hidden">Hidden Items ({disabledExerciseIds?.length || 0})</option>
            <option className="bg-obsidian-900" value="all">All Catalog</option>
          </select>

          <button
            onClick={() =>
              setEditingExercise({
                name: '',
                category: 'home_workout',
                subCategory: 'home_workout',
                level: 'Intermediate',
                muscleCategory: 'Core',
                equipment: 'bodyweight',
                metScore: 6.0,
                tagline: '',
                gifUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif',
                proTip: '',
              })
            }
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Exercise</span>
          </button>
        </div>
      </div>

      {editingExercise && (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-obsidian-900 border border-amber-400/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase">
              {editingExercise.id ? `Editing: ${editingExercise.name}` : 'Create Custom Exercise'}
            </span>
            <button type="button" onClick={() => setEditingExercise(null)} className="text-xs text-slate-400">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input
              required
              type="text"
              placeholder="Exercise Name"
              value={editingExercise.name || ''}
              onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={editingExercise.category || 'home_workout'}
              onChange={(e) => {
                const val = e.target.value;
                setEditingExercise({
                  ...editingExercise,
                  category: val === 'yoga_mat' || val === 'exercise_ball' ? 'yoga' : val,
                  subCategory: val,
                });
              }}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="home_workout">Home Workout</option>
              <option className="bg-obsidian-900" value="yoga_mat">Yoga Mat Asana</option>
              <option className="bg-obsidian-900" value="exercise_ball">Stability Ball Yoga</option>
              <option className="bg-obsidian-900" value="calisthenics">Calisthenics</option>
              <option className="bg-obsidian-900" value="machines">Gym Machine</option>
              <option className="bg-obsidian-900" value="freeweights">Free Weights</option>
            </select>
            <select
              value={editingExercise.level || 'Intermediate'}
              onChange={(e) => setEditingExercise({ ...editingExercise, level: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="Beginner">Beginner</option>
              <option className="bg-obsidian-900" value="Intermediate">Intermediate</option>
              <option className="bg-obsidian-900" value="Advanced">Advanced</option>
            </select>
            <input
              type="text"
              placeholder="Target Muscle (e.g. Core, Chest, Glutes)"
              value={editingExercise.muscleCategory || ''}
              onChange={(e) => setEditingExercise({ ...editingExercise, muscleCategory: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              step="0.1"
              placeholder="MET Score"
              value={editingExercise.metScore ?? 5.5}
              onChange={(e) => setEditingExercise({ ...editingExercise, metScore: parseFloat(e.target.value) || 4 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="text"
              placeholder="GIF / Visual URL"
              value={editingExercise.gifUrl || ''}
              onChange={(e) => setEditingExercise({ ...editingExercise, gifUrl: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
          <input
            type="text"
            placeholder="Tagline / Coaching Cue"
            value={editingExercise.tagline || ''}
            onChange={(e) => setEditingExercise({ ...editingExercise, tagline: e.target.value })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
          />
          <button type="submit" className="gold-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Save Exercise Live</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {catalogList.map((ex) => {
          const isHidden = (disabledExerciseIds || []).includes(ex.id);
          return (
            <div
              key={ex.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                isHidden ? 'bg-obsidian-950 border-white/5 opacity-60' : 'bg-obsidian-900 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={ex.gifUrl}
                  alt={ex.name}
                  className="w-12 h-12 rounded-xl object-contain bg-black shrink-0 dark-3d-animation"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-amber-400">
                      {ex.subCategory || ex.category}
                    </span>
                    <span className="text-[10px] text-slate-500">· {ex.level} · MET {ex.metScore}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{ex.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{ex.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setEditingExercise(ex)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300 transition"
                  title="Edit exercise"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    adminToggleExerciseDisabled(ex.id);
                    onFlash(`${ex.name} ${isHidden ? 'restored to' : 'hidden from'} frontend`);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition"
                  title={isHidden ? 'Show exercise' : 'Hide exercise'}
                >
                  {isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                {ex.hasOverride && !ex.isCustom && (
                  <button
                    onClick={() => {
                      adminResetExerciseOverride(ex.id);
                      onFlash(`Reset override for ${ex.name}`);
                    }}
                    className="p-2 rounded-xl bg-white/5 text-sky-300"
                    title="Reset override"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                {ex.isCustom && (
                  <button
                    onClick={() => {
                      adminDeleteCustomExercise(ex.id);
                      onFlash(`Deleted custom exercise ${ex.name}`);
                    }}
                    className="p-2 rounded-xl bg-rose-500/15 text-rose-300"
                    title="Delete custom exercise"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
