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
} from 'lucide-react';
import { MASSIVE_FITNESS_CATALOG, BRANDS } from '../../data/massiveFitnessDatabase';
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '../../data/fitnessData';
import { GlassCard } from '../common/GlassCard';
import { RealisticBiomechanicsPlayer } from './RealisticBiomechanicsPlayer';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { useApp } from '../../context/AppContext';

export function FitnessSection() {
  const {
    user,
    todaysWorkouts,
    totalCaloriesBurned,
    totalWorkoutMinutes,
    deleteWorkout,
    setIsWeightModalOpen,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('All Muscles');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Filter 1,000+ exercises with memoization for 60fps performance
  const filteredCatalog = useMemo(() => {
    return MASSIVE_FITNESS_CATALOG.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesMuscle =
        selectedMuscle === 'All Muscles' ||
        item.muscleCategory === selectedMuscle ||
        item.primaryMuscles.some((m) => m.name.toLowerCase().includes(selectedMuscle.toLowerCase()));
      const matchesBrand =
        selectedBrand === 'All Brands' ||
        item.equipmentBrand === selectedBrand;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.equipmentBrand && item.equipmentBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.muscleCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesMuscle && matchesBrand && matchesSearch;
    });
  }, [selectedCategory, selectedMuscle, selectedBrand, searchQuery]);

  const displayedItems = filteredCatalog.slice(0, visibleCount);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Magazine Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-amber-500/25 p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1,000+ Heavy Gym Equipment & Biomechanics Vault
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Calibrated to {user.currentWeight}kg Mass
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            1,000+ <span className="gold-gradient-text">GYM MACHINES & EXERCISES</span> ARCHIVE
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mb-6">
            The ultimate encyclopedia for fitness freaks and bodybuilders. Explore over 1,000+ real-world gym machines across <strong>Hammer Strength, Cybex, Prime Fitness, Arsenal, Panatta, Watson, Nautilus, and Rogue</strong>. Realistic anatomical biomechanics reveal exact joint angles, correct vs wrong flaring traps, progressive overload ratios, and weight-to-bodyweight multipliers.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Today's Calorie Burn</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
                <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                {totalCaloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Workout Time</div>
              <div className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-5 h-5 text-amber-400" />
                {totalWorkoutMinutes} <span className="text-xs font-normal text-slate-400">min</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Vault Capacity</div>
              <div className="text-xl sm:text-2xl font-black text-amber-200 flex items-center gap-1.5 mt-0.5">
                <Layers className="w-5 h-5 text-amber-400" />
                {MASSIVE_FITNESS_CATALOG.length}+ <span className="text-xs font-normal text-slate-400">items</span>
              </div>
            </div>

            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 transition text-left flex flex-col justify-between group"
            >
              <div className="text-[11px] text-amber-300 uppercase tracking-wider font-bold flex items-center justify-between">
                <span>Daily Weight</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-1">
                {user.currentWeight} kg Logged
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EXERCISE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setVisibleCount(24);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition flex items-center gap-2 border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-gold-glow-sm'
                  : 'bg-obsidian-850/80 text-slate-300 border-white/5 hover:border-amber-500/30 hover:text-white'
              }`}
            >
              {cat.id === 'machines' && <Dumbbell className="w-4 h-4" />}
              {cat.id === 'cardio' && <Flame className="w-4 h-4" />}
              {cat.id === 'all' && <Sparkles className="w-4 h-4" />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Muscle & Brand Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 1,000+ machines, angles, brands..."
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
              <Filter className="w-3.5 h-3.5 text-amber-400" /> Muscle:
            </span>
            <select
              value={selectedMuscle}
              onChange={(e) => {
                setSelectedMuscle(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-200 cursor-pointer"
            >
              {MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group} className="bg-obsidian-900 text-white">
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Brand Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Brand:
            </span>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-200 cursor-pointer"
            >
              <option value="All Brands" className="bg-obsidian-900 text-white">
                All Equipment Brands ({BRANDS.length})
              </option>
              {BRANDS.map((b) => (
                <option key={b} value={b} className="bg-obsidian-900 text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter notification */}
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>
            Showing <strong className="text-amber-300">{displayedItems.length}</strong> of{' '}
            <strong className="text-white">{filteredCatalog.length}</strong> filtered exercises & machines
          </span>
          <span className="text-[11px] font-mono text-amber-400/80">
            Click any item for 3D Angle Simulator & Progressive Overload
          </span>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => {
          const burnPreview = Math.round((item.metScore * 3.5 * (user.currentWeight || 75) / 200) * 20);

          return (
            <GlassCard
              key={item.id}
              className="flex flex-col justify-between border-amber-500/15 group cursor-pointer"
              onClick={() => setSelectedExercise(item)}
            >
              {/* Card Mini Realistic Biomechanics Visual */}
              <div className="relative overflow-hidden bg-black/60 rounded-t-2xl">
                <RealisticBiomechanicsPlayer exercise={item} isMini={true} />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 border border-amber-500/30 text-amber-300 backdrop-blur-md">
                    {item.equipmentBrand || item.badge || item.level}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {item.muscleCategory}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[10px] text-slate-400 font-mono">MET {item.metScore}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition tracking-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Primary Muscle Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.primaryMuscles?.slice(0, 2).map((m, idx) => (
                    <span
                      key={idx}
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
                    <span>Inspect Biomechanics</span>
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
            className="gold-btn-outline px-8 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg"
          >
            Load More Machines ({filteredCatalog.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filteredCatalog.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-amber-500/15">
          <Dumbbell className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No machines match your query</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting category, brand or muscle filters.</p>
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
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
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
