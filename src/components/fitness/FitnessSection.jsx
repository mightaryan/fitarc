import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  Search,
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
  SlidersHorizontal,
  X,
  Sun,
  Lock,
} from 'lucide-react';
import { MASTER_EXERCISE_CATALOG, DIFFICULTY_LEVELS } from '../../data/allExercisesMaster';
import { YOGA_AND_HOME_WORKOUTS } from '../../data/yogaAndHomeWorkouts';
import { HOME_WORKOUTS_EXPANDED } from '../../data/homeWorkoutsExpanded';
import { CALISTHENICS_EXERCISES } from '../../data/calisthenicsExercises';
import { HIIT_CARDIO_EXERCISES } from '../../data/hiitAndLeapWorkouts';
import { GlassCard } from '../common/GlassCard';
import { mergeManagedCatalog } from '../../utils/adminCatalogHelpers';
import { useApp } from '../../context/AppContext';

const WorkoutDetailModal = lazy(() => import('./WorkoutDetailModal'));
const HomeWorkoutHub = lazy(() => import('./HomeWorkoutHub').then((m) => ({ default: m.HomeWorkoutHub })));
const YogaSanctuaryHub = lazy(() => import('./YogaSanctuaryHub').then((m) => ({ default: m.YogaSanctuaryHub })));
const CalisthenicsHub = lazy(() => import('./CalisthenicsHub').then((m) => ({ default: m.CalisthenicsHub })));
const HiitAndBodyPartStudio = lazy(() => import('./HiitAndBodyPartStudio'));

const EQUIPMENT_FILTERS = [
  { id: 'all', label: 'All Equipment' },
  { id: 'yogamat', label: 'Yoga Mat (Non-Slip)' },
  { id: 'exercise_ball', label: 'Stability & Exercise Ball' },
  { id: 'bodyweight', label: 'Bodyweight (Zero Equipment)' },
  { id: 'dumbbell', label: 'Free Weight Dumbbells' },
  { id: 'barbell', label: 'Olympic Barbells & EZ' },
  { id: 'machine', label: 'Gym Machines & Lever' },
  { id: 'cable', label: 'Cables & Bands' },
  { id: 'smith', label: 'Smith Machine' },
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
    setIsCustomPlanModalOpen,
    hasPaidPlan,
    advancedUnlocked,
    openPlanUpgradeModal,
    t,
    fitnessSubTab: contextFitnessSubTab,
    setFitnessSubTab: contextSetFitnessSubTab,
    customExercises,
    disabledExerciseIds,
    exerciseOverrides,
  } = useApp();

  const [localFitnessSubTab, setLocalFitnessSubTab] = useState('yoga'); // 'yoga' | 'home_hub' | 'archive'
  const fitnessSubTab = contextFitnessSubTab || localFitnessSubTab;
  const setFitnessSubTab = contextSetFitnessSubTab || setLocalFitnessSubTab;
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('All Muscles');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Combined Admin-managed catalog (HIIT, Home, Yoga, Calisthenics, Gym + Custom/Overrides/Disabled)
  const fullExerciseCatalog = useMemo(() => {
    const base = [
      ...HIIT_CARDIO_EXERCISES,
      ...HOME_WORKOUTS_EXPANDED,
      ...YOGA_AND_HOME_WORKOUTS,
      ...CALISTHENICS_EXERCISES,
      ...MASTER_EXERCISE_CATALOG,
    ];
    return mergeManagedCatalog(base, {
      customItems: customExercises,
      disabledIds: disabledExerciseIds,
      overrides: exerciseOverrides,
    });
  }, [customExercises, disabledExerciseIds, exerciseOverrides]);

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
      if (selectedEquipment === 'yogamat') {
        matchesEquipment = item.equipment === 'yogamat' || item.subCategory === 'yoga_mat';
      } else if (selectedEquipment === 'exercise_ball') {
        matchesEquipment =
          item.equipment === 'exercise_ball' ||
          item.subCategory === 'exercise_ball' ||
          (item.name && item.name.toLowerCase().includes('ball')) ||
          (item.gifUrl && item.gifUrl.includes('ball'));
      } else if (selectedEquipment === 'bodyweight') {
        matchesEquipment =
          item.equipment === 'bodyweight' ||
          item.equipment === 'mat' ||
          item.equipment === 'none' ||
          item.category === 'home_workout';
      } else if (selectedEquipment === 'machine') {
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
              {fullExerciseCatalog.length.toLocaleString()}+ Exercises &amp; Yoga
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Step-by-step form guides
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            Workout <span className="gold-gradient-text font-extrabold">Studio</span>
          </h1>
        </div>

        {/* Compact Daily Status Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCustomPlanModalOpen?.(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI &amp; Custom Plan</span>
          </button>

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

      {/* PRIMARY FITNESS NAVIGATION: Full-width responsive grid prevents pill clipping */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1.5 bg-black/60 rounded-2xl border border-white/10 w-full shadow-inner gap-1.5">
        <button
          onClick={() => setFitnessSubTab('hiit_leap')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-center ${
            fitnessSubTab === 'hiit_leap'
              ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className={`w-4 h-4 shrink-0 ${fitnessSubTab === 'hiit_leap' ? 'text-white' : 'text-rose-400'}`} />
          <span className="truncate">30m HIIT &amp; Body Parts</span>
        </button>

        <button
          onClick={() => setFitnessSubTab('yoga')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-center ${
            fitnessSubTab === 'yoga'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sun className={`w-4 h-4 shrink-0 ${fitnessSubTab === 'yoga' ? 'text-white' : 'text-emerald-400'}`} />
          <span className="truncate">Yoga Studio</span>
        </button>

        <button
          onClick={() => setFitnessSubTab('home_hub')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-center ${
            fitnessSubTab === 'home_hub'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className={`w-4 h-4 shrink-0 ${fitnessSubTab === 'home_hub' ? 'text-black fill-current' : 'text-amber-400'}`} />
          <span className="truncate">Home (30 Days)</span>
        </button>

        <button
          onClick={() => setFitnessSubTab('calisthenics')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-center ${
            fitnessSubTab === 'calisthenics'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className={`w-4 h-4 shrink-0 ${fitnessSubTab === 'calisthenics' ? 'text-black' : 'text-amber-400'}`} />
          <span className="truncate">Calisthenics</span>
        </button>

        <button
          onClick={() => setFitnessSubTab('archive')}
          className={`col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-center ${
            fitnessSubTab === 'archive'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-gold-glow-sm font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Dumbbell className={`w-4 h-4 shrink-0 ${fitnessSubTab === 'archive' ? 'text-black' : 'text-amber-400'}`} />
          <span className="truncate">All Exercises ({fullExerciseCatalog.length.toLocaleString()})</span>
        </button>
      </div>

      <Suspense
        fallback={
          <div className="p-10 rounded-3xl bg-obsidian-900 border border-white/10 text-center text-xs text-slate-400">
            Loading workout studio...
          </div>
        }
      >
        {/* VIEW 0: 30-MIN HIIT CARDIO ARENA + BODY-PART & DURATION BUILDER */}
        {fitnessSubTab === 'hiit_leap' && <HiitAndBodyPartStudio />}

        {/* VIEW 1: YOGA SANCTUARY (MAT & STABILITY BALL ASANAS) */}
        {fitnessSubTab === 'yoga' && <YogaSanctuaryHub />}

        {/* VIEW 2: HOME WORKOUT HUB */}
        {fitnessSubTab === 'home_hub' && <HomeWorkoutHub />}

        {/* VIEW 3: CALISTHENICS HUB */}
        {fitnessSubTab === 'calisthenics' && <CalisthenicsHub />}
      </Suspense>

      {/* VIEW 3: 3D MOVEMENT ARCHIVE & SEARCH */}
      {fitnessSubTab === 'archive' && (
        <div className="space-y-6">
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
              placeholder={`Search ${fullExerciseCatalog.length.toLocaleString()}+ movements (e.g., sun salutation, sofa squat, bench, pull-up)...`}
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

        {/* Horizontal Swipeable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {[
            { id: 'all', label: 'All Movements' },
            { id: 'yoga', label: `🧘 Yoga Sanctuary (${YOGA_AND_HOME_WORKOUTS.length})` },
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
                    if (e.target.value === 'advanced' && !advancedUnlocked) {
                      openPlanUpgradeModal('Switch from Free to a Paid Plan to unlock Advanced workouts.');
                      return;
                    }
                    setSelectedDifficulty(e.target.value);
                    setVisibleCount(24);
                  }}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-200 cursor-pointer"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-obsidian-900 text-white">
                      {d.id === 'advanced' && !advancedUnlocked ? `🔒 ${d.label} (Paid)` : d.label}
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

      {/* Beginner-Minimalist Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item, idx) => {
          const burnPreview = Math.round((item.metScore * 3.5 * (user.currentWeight || 75) / 200) * 20);
          const isLocked = item.level === 'Advanced' && !advancedUnlocked;

          return (
            <GlassCard
              key={item.uniqueKey || `${item.id}-${idx}`}
              className="flex flex-col justify-between border-amber-500/15 group cursor-pointer"
              onClick={() => {
                if (isLocked) {
                  openPlanUpgradeModal(`Switch from Free to a Paid Plan to unlock "${item.name}"`);
                  return;
                }
                setSelectedExercise(item);
              }}
            >
              {/* Card Animated Thumbnail */}
              <div className="relative h-52 overflow-hidden rounded-t-2xl flex items-center justify-center bg-gradient-to-b from-[#141824] via-[#0a0c12] to-[#06070a] p-3">
                <img
                  key={item.id || item.gifUrl}
                  src={item.gifUrl}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      item.fallbackGif ||
                      (item.equipment === 'exercise_ball'
                        ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/back-extension-on-exercise-ball.gif'
                        : item.category === 'yoga' || item.equipment === 'yogamat'
                        ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif'
                        : item.category === 'cardio'
                        ? 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif'
                        : 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif');
                  }}
                  className="max-h-full w-auto object-contain transition duration-500 group-hover:scale-105 dark-3d-animation"
                />

                <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${
                      item.level === 'Beginner'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : item.level === 'Advanced'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {item.level === 'Beginner'
                      ? (t?.('fitness.beginner') || 'Beginner')
                      : item.level === 'Advanced'
                      ? (isLocked ? `🔒 ${t?.('fitness.locked') || 'Paid Plan'}` : (t?.('fitness.advanced') || 'Advanced'))
                      : (t?.('fitness.intermediate') || 'Intermediate')}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-black/80 border border-white/10 text-slate-300 backdrop-blur-md">
                    {item.equipmentLabel || item.equipment}
                  </span>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black text-amber-200 px-3 py-1 rounded-full bg-black/80 border border-amber-500/30">
                      Paid Plan Required
                    </span>
                  </div>
                )}
              </div>

              {/* Minimalistic Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 truncate mb-1">
                    {item.muscleCategory || item.muscle}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition tracking-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Primary Muscle Tags (No clutter %) */}
                <div className="flex items-center gap-1.5 flex-wrap overflow-hidden">
                  {item.primaryMuscles?.slice(0, 2).map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-200 border border-amber-500/20 truncate max-w-[150px]"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{burnPreview} kcal <span className="text-[10px] text-slate-400 font-normal">/ 20m</span></span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition">
                    <span>{isLocked ? 'Unlock Plan' : 'View Guide'}</span>
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
        </div>
      )}

      {/* Exercise Detail Guide Modal */}
      <Suspense fallback={null}>
        {selectedExercise && (
          <WorkoutDetailModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </Suspense>
    </div>
  );
}
