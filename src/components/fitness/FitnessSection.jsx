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
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { MASTER_EXERCISE_CATALOG, DIFFICULTY_LEVELS } from '../../data/allExercisesMaster';
import { YOGA_AND_HOME_WORKOUTS } from '../../data/yogaAndHomeWorkouts';
import { EXERCISE_CATEGORIES } from '../../data/fitnessData';
import { GlassCard } from '../common/GlassCard';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { useApp } from '../../context/AppContext';

const EQUIPMENT_FILTERS = [
  { id: 'all', label: 'All Equipment' },
  { id: 'dumbbell', label: 'Free Weight Dumbbells' },
  { id: 'barbell', label: 'Olympic Barbells & EZ' },
  { id: 'machine', label: 'Gym Machines & Lever' },
  { id: 'cable', label: 'Cables & Bands' },
  { id: 'smith', label: 'Smith Machine' },
  { id: 'bodyweight', label: 'Calisthenics & Bodyweight' },
  { id: 'sled', label: 'Sled, Kettlebell & Functional' },
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
    setIsPlanModalOpen,
  } = useApp();

  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('All Muscles');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Combined catalog of 3D Gym Lifts, Full Body Yoga, Face Yoga & Home Workouts
  const fullExerciseCatalog = useMemo(() => {
    return [...YOGA_AND_HOME_WORKOUTS, ...MASTER_EXERCISE_CATALOG];
  }, []);

  // Active filter count for badge
  const activeFilterCount =
    (selectedDifficulty !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedMuscle !== 'All Muscles' ? 1 : 0) +
    (selectedEquipment !== 'all' ? 1 : 0);

  // Filter exercises with fast memoization
  const filteredCatalog = useMemo(() => {
    return fullExerciseCatalog.filter((item) => {
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
      let matchesCategory = selectedCategory === 'all';
      if (!matchesCategory) {
        if (selectedCategory === 'yoga') {
          matchesCategory = item.category === 'yoga';
        } else if (selectedCategory === 'face_yoga') {
          matchesCategory = item.category === 'face_yoga' || item.muscleCategory === 'Face & Neck';
        } else if (selectedCategory === 'home_workout') {
          matchesCategory = item.category === 'home_workout' || item.equipment === 'bodyweight';
        } else if (selectedCategory === 'mobility') {
          matchesCategory =
            item.category === 'mobility' ||
            item.category === 'yoga' ||
            item.muscleCategory === 'Core' ||
            item.equipment === 'band' ||
            (item.name && (item.name.toLowerCase().includes('stretch') || item.name.toLowerCase().includes('mobility')));
        } else {
          matchesCategory = item.category === selectedCategory;
        }
      }

      // Muscle filter
      const matchesMuscle =
        selectedMuscle === 'All Muscles' ||
        item.muscleCategory?.toLowerCase() === selectedMuscle.toLowerCase() ||
        (item.muscle && item.muscle.toLowerCase().includes(selectedMuscle.toLowerCase()));

      // Equipment filter
      let matchesEquipment = true;
      if (selectedEquipment === 'machine') {
        matchesEquipment = item.equipment === 'machine' || item.equipment === 'lever';
      } else if (selectedEquipment === 'cable') {
        matchesEquipment = item.equipment === 'cable' || item.equipment === 'band';
      } else if (selectedEquipment === 'barbell') {
        matchesEquipment = item.equipment === 'barbell' || item.equipment === 'ez-bar';
      } else if (selectedEquipment === 'sled') {
        matchesEquipment = item.equipment === 'sled' || item.equipment === 'kettlebell' || item.equipment === 'other';
      } else if (selectedEquipment !== 'all') {
        matchesEquipment = item.equipment === selectedEquipment;
      }

      // Search query: multi-token matching
      const q = searchQuery.toLowerCase().trim();
      const searchTerms = q.split(/\s+/).filter(Boolean);
      const matchesSearch =
        searchTerms.length === 0 ||
        searchTerms.every(
          (t) =>
            (item.name && item.name.toLowerCase().includes(t)) ||
            (item.muscle && item.muscle.toLowerCase().includes(t)) ||
            (item.muscleCategory && item.muscleCategory.toLowerCase().includes(t)) ||
            (item.equipment && item.equipment.toLowerCase().includes(t)) ||
            (item.equipmentBrand && item.equipmentBrand.toLowerCase().includes(t))
        );

      return matchesDiff && matchesCategory && matchesMuscle && matchesEquipment && matchesSearch;
    });
  }, [fullExerciseCatalog, selectedDifficulty, selectedCategory, selectedMuscle, selectedEquipment, searchQuery]);

  const displayedItems = filteredCatalog.slice(0, visibleCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sleek, Elegant Header (Minimalist Luxury Aesthetic) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {fullExerciseCatalog.length.toLocaleString()}+ Exercises & 220+ Yogas
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              3D Anatomical Biomechanics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            Movement <span className="gold-gradient-text font-extrabold">Archive</span>
          </h1>
        </div>

        {/* Compact Daily Status Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{totalCaloriesBurned} <span className="text-[10px] text-slate-400 font-normal">kcal</span></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 border border-white/10 text-xs font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalWorkoutMinutes}m</span>
          </div>

          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-300 hover:text-amber-300 transition active:scale-95"
            title="Log Today's Body Weight"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{user.currentWeight}kg</span>
          </button>
        </div>
      </div>

      {/* ACTIVE TRANSFORMATION GOAL PLAN BANNER (30 / 60 / 90 DAYS) */}
      {user.activePlan && (
        <div
          onClick={() => setIsPlanModalOpen(true)}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-obsidian-850 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400 active:scale-[0.99] transition-all shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold shadow-gold-glow-sm shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Active Goal Plan
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {user.activePlan.durationDays} Days · {user.activePlan.badge || 'Sprint'}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition mt-0.5">
                {user.activePlan.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 shrink-0">
            <span className="hidden sm:inline">Change Goal Plan</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      )}

      {/* SEARCH & STREAMLINED FILTER CONTROLS */}
      <div className="space-y-3">
        {/* Search Input + Quick Filter Toggle Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${fullExerciseCatalog.length.toLocaleString()}+ movements (e.g., sun salutation, sofa squat, bench, jawline)...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 border border-amber-500/20 focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 sm:px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0 ${
              showFilters || activeFilterCount > 0
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-amber-500/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black font-extrabold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Horizontal Swipeable Category Chips (Single Clean Row with Yoga, Face Yoga & Home Workouts) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {[
            { id: 'all', label: 'All Movements' },
            { id: 'yoga', label: `🧘 Full Body Yoga (185+)` },
            { id: 'face_yoga', label: `✨ Face Yoga (35)` },
            { id: 'home_workout', label: '🏠 Home Workouts' },
            { id: 'machines', label: 'Gym Machines' },
            { id: 'freeweights', label: 'Free Weights & Dumbbells' },
            { id: 'bodyweight', label: 'Calisthenics' },
            { id: 'cardio', label: 'Cardio & HIIT' },
            { id: 'mobility', label: 'Mobility' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setVisibleCount(24);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 font-bold shadow-gold-glow-sm'
                  : 'bg-obsidian-850/90 text-slate-300 border-white/5 hover:border-amber-500/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Collapsible Deeper Filters Panel (Difficulty, Muscle, Equipment) */}
        {showFilters && (
          <div className="p-4 rounded-2xl bg-obsidian-850/95 border border-amber-500/25 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Detailed Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedDifficulty('all');
                    setSelectedCategory('all');
                    setSelectedMuscle('All Muscles');
                    setSelectedEquipment('all');
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Difficulty */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setVisibleCount(24);
                  }}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-200 cursor-pointer"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-obsidian-900 text-white">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Muscle Target */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Target Muscle
                </label>
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

              {/* Equipment */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Equipment Type
                </label>
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
          </div>
        )}

        {/* Counter Info */}
        <div className="text-xs text-slate-400 flex items-center justify-between px-0.5">
          <span>
            Showing <strong className="text-amber-300">{displayedItems.length}</strong> of{' '}
            <strong className="text-white">{filteredCatalog.length}</strong> exercises
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedCategory('all');
                setSelectedMuscle('All Muscles');
                setSelectedEquipment('all');
                setSearchQuery('');
              }}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Clear filters
            </button>
          )}
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
                  key={item.id || item.gifUrl}
                  src={item.gifUrl}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif';
                  }}
                  className="max-h-full w-auto object-contain transition duration-500 group-hover:scale-105 dark-3d-animation"
                />

                {/* Ambient glow highlight */}
                <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />

                {/* Difficulty level badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${item.level === 'Beginner'
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
                  <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 truncate">
                      ⚡ Active: {item.muscle || item.muscleCategory}
                    </span>
                    <span className="text-slate-600 shrink-0">·</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">MET {item.metScore}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition tracking-tight line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Primary Muscle Pills */}
                <div className="flex items-center gap-1.5 flex-wrap overflow-hidden">
                  {item.primaryMuscles?.slice(0, 2).map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-200 border border-amber-500/20 truncate max-w-[150px]"
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
