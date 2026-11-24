import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Dumbbell,
  Flame,
  Zap,
  Activity,
  ArrowRight,
  Scale,
  Clock,
  Trash2,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { MASTER_EXERCISE_CATALOG, DIFFICULTY_LEVELS } from '../../data/allExercisesMaster';
import { EXERCISE_CATEGORIES } from '../../data/fitnessData';
import { GlassCard } from '../common/GlassCard';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { useApp } from '../../context/AppContext';

const EQUIPMENT_FILTERS = [
  { id: 'all', label: 'All Equipment' },
  { id: 'machine', label: 'Gym Machines & Lever' },
  { id: 'cable', label: 'Cables & Pulleys' },
  { id: 'smith', label: 'Smith Machine' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'dumbbell', label: 'Dumbbell' },
  { id: 'bodyweight', label: 'Calisthenics & Bodyweight' },
  { id: 'sled', label: 'Sled & Functional' },
];

const MUSCLE_FILTER_OPTIONS = [
  'All Muscles',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio',
  'Full Body',
];

export function FitnessSection() {
  const {
    user,
    todaysWorkouts,
    totalCaloriesBurned,
    totalWorkoutMinutes,
    deleteWorkout,
    setIsWeightModalOpen,
  } = useApp();

  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('All Muscles');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Filter 2,400+ exercises with fast memoization
  const filteredCatalog = useMemo(() => {
    return MASTER_EXERCISE_CATALOG.filter((item) => {
      // Difficulty filter
      let matchesDiff = true;
      if (selectedDifficulty === 'beginner') {
        matchesDiff = item.level === 'Beginner';
      } else if (selectedDifficulty === 'intermediate') {
        matchesDiff = item.level === 'Intermediate';
      } else if (selectedDifficulty === 'advanced') {
        matchesDiff = item.level === 'Advanced';
      }

      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Muscle filter
      const matchesMuscle =
        selectedMuscle === 'All Muscles' ||
        item.muscleCategory?.toLowerCase() === selectedMuscle.toLowerCase() ||
        item.muscle?.toLowerCase().includes(selectedMuscle.toLowerCase());

      // Equipment filter
      let matchesEquipment = true;
      if (selectedEquipment === 'machine') {
        matchesEquipment = item.equipment === 'machine' || item.equipment === 'lever';
      } else if (selectedEquipment !== 'all') {
        matchesEquipment = item.equipment === selectedEquipment;
      }

      // Search query
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.muscle && item.muscle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.equipment && item.equipment.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDiff && matchesCategory && matchesMuscle && matchesEquipment && matchesSearch;
    });
  }, [selectedDifficulty, selectedCategory, selectedMuscle, selectedEquipment, searchQuery]);

  const displayedItems = filteredCatalog.slice(0, visibleCount);

  // Counts for difficulty levels
  const beginnerCount = useMemo(() => MASTER_EXERCISE_CATALOG.filter(e => e.level === 'Beginner').length, []);
  const intermediateCount = useMemo(() => MASTER_EXERCISE_CATALOG.filter(e => e.level === 'Intermediate').length, []);
  const advancedCount = useMemo(() => MASTER_EXERCISE_CATALOG.filter(e => e.level === 'Advanced').length, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Magazine Hero Banner (Refined Rich Aesthetic) */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-amber-500/20 p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {MASTER_EXERCISE_CATALOG.length.toLocaleString()}+ Exercises: Simple to Advanced Master Vault
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Illuminated Muscle Activation
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight leading-snug mb-3">
            {MASTER_EXERCISE_CATALOG.length.toLocaleString()}+ <span className="gold-gradient-text font-bold">3D Biomechanics</span> & Exercise Archive
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mb-6">
            From <strong>foundational simple movements</strong> (wall push-ups, air squats, machine guidance) to <strong>intermediate hypertrophy</strong> and <strong>advanced pro lifts</strong> (Olympic snatches, dragon flags, ring muscle-ups). Every exercise features dark-mode 3D anatomical animations, progressive overload pyramid calculators, and joint angle telemetry calibrated to your <strong className="text-amber-300">{user.currentWeight} kg</strong> body weight.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Today's Calorie Burn</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                {totalCaloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Workout Time</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-amber-400" />
                {totalWorkoutMinutes} <span className="text-xs font-normal text-slate-400">min</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Master Vault Size</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-200 flex items-center gap-1.5 mt-0.5">
                <Layers className="w-4 h-4 text-amber-400" />
                {MASTER_EXERCISE_CATALOG.length}+ <span className="text-xs font-normal text-slate-400">exercises</span>
              </div>
            </div>

            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition text-left flex flex-col justify-between group"
            >
              <div className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold flex items-center justify-between">
                <span>Daily Weight</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {user.currentWeight} kg Logged
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BAR 1: DIFFICULTY LEVEL (SIMPLE TO ADVANCED) */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block mb-2">
            Filter by Movement Difficulty (Simple to Advanced):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DIFFICULTY_LEVELS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDifficulty(d.id);
                  setVisibleCount(24);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition flex items-center gap-2 border ${
                  selectedDifficulty === d.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-gold-glow-sm font-bold'
                    : 'bg-obsidian-850/80 text-slate-300 border-white/5 hover:border-amber-500/30 hover:text-white'
                }`}
              >
                <span>{d.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/40 border border-white/10 font-mono">
                  {d.id === 'all'
                    ? MASTER_EXERCISE_CATALOG.length
                    : d.id === 'beginner'
                    ? beginnerCount
                    : d.id === 'intermediate'
                    ? intermediateCount
                    : advancedCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EXERCISE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setVisibleCount(24);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition flex items-center gap-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-obsidian-850 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {cat.id === 'machines' && <Dumbbell className="w-3.5 h-3.5" />}
              {cat.id === 'cardio' && <Flame className="w-3.5 h-3.5" />}
              {cat.id === 'all' && <Sparkles className="w-3.5 h-3.5" />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Muscle & Equipment Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${MASTER_EXERCISE_CATALOG.length.toLocaleString()}+ exercises (wall push-up, lat pulldown, snatch, hack squat)...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Muscle Group Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> Target:
            </span>
            <select
              value={selectedMuscle}
              onChange={(e) => {
                setSelectedMuscle(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-200 cursor-pointer"
            >
              {MUSCLE_FILTER_OPTIONS.map((group) => (
                <option key={group} value={group} className="bg-obsidian-900 text-white">
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> Equipment:
            </span>
            <select
              value={selectedEquipment}
              onChange={(e) => {
                setSelectedEquipment(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-200 cursor-pointer"
            >
              {EQUIPMENT_FILTERS.map((b) => (
                <option key={b.id} value={b.id} className="bg-obsidian-900 text-white">
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>
            Showing <strong className="text-amber-300">{displayedItems.length}</strong> of{' '}
            <strong className="text-white">{filteredCatalog.length}</strong> filtered exercises
          </span>
          <span className="text-[11px] font-mono text-amber-400/80">
            Dark 3D anatomical animations · Simple to Advanced
          </span>
        </div>
      </div>

      {/* 3D Anatomical Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item, idx) => {
          const burnPreview = Math.round((item.metScore * 3.5 * (user.currentWeight || 75) / 200) * 20);

          return (
            <GlassCard
              key={item.uniqueKey || `${item.id}-${idx}`}
              className="flex flex-col justify-between border-amber-500/15 group cursor-pointer"
              onClick={() => setSelectedExercise(item)}
            >
              {/* Card Mini 3D Animated Thumbnail with Dark Gold Obsidian Frame */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-b from-[#141824] via-[#0a0c12] to-[#06070a] rounded-t-2xl flex items-center justify-center p-3">
                <img
                  src={item.gifUrl || 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/archer-push-up.gif'}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/archer-push-up.gif';
                  }}
                  className="max-h-full w-auto object-contain transition duration-500 group-hover:scale-105 dark-3d-animation"
                />

                {/* Ambient glow highlight */}
                <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />

                {/* Difficulty level badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${
                      item.level === 'Beginner'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : item.level === 'Advanced'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {item.level === 'Beginner' ? '🟢 Simple' : item.level === 'Advanced' ? '🔴 Advanced' : '🟡 Intermediate'}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                    {item.equipment}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                      ⚡ Active: {item.muscle || item.muscleCategory}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[10px] text-slate-400 font-mono">MET {item.metScore}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition tracking-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Primary Muscle Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.primaryMuscles?.slice(0, 2).map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-200 border border-amber-500/20"
                    >
                      {m.name} ({m.percentage}%)
                    </span>
                  ))}
                </div>

                {/* Impact Preview Metrics */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{burnPreview} kcal <span className="text-[10px] text-slate-400 font-normal">/ 20m</span></span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition">
                    <span>Inspect 3D Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Pagination Load More Button */}
      {visibleCount < filteredCatalog.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="gold-btn-outline px-8 py-3 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg"
          >
            Load More Exercises ({filteredCatalog.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filteredCatalog.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-amber-500/15">
          <Dumbbell className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No exercises match your query</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting difficulty, equipment or muscle filters.</p>
        </div>
      )}

      {/* Today's Logged Workouts Tray */}
      {todaysWorkouts.length > 0 && (
        <div className="p-6 rounded-3xl glass-panel-glow border border-amber-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Today's Completed Sessions</h3>
                <p className="text-xs text-slate-400">
                  {todaysWorkouts.length} logged workout{todaysWorkouts.length > 1 ? 's' : ''} today · Total{' '}
                  <strong className="text-amber-300">{totalCaloriesBurned} kcal</strong> burned
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaysWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      {workout.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{workout.loggedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{workout.exerciseName}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-amber-300 font-semibold">{workout.durationMinutes} min</span>
                    <span>·</span>
                    <span className="text-amber-400 font-semibold">{workout.caloriesBurned} kcal</span>
                    <span>·</span>
                    <span className="text-slate-300">+{workout.muscleGrowthScore} pts growth</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteWorkout(workout.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-80 group-hover:opacity-100"
                  title="Remove from today's log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Detail & Calculator Modal */}
      {selectedExercise && (
        <WorkoutDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
