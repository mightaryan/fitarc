import React, { useState, useMemo } from 'react';
import {
  Camera,
  Plus,
  Flame,
  Search,
  Sparkles,
  Utensils,
  ChefHat,
  Clock,
  Award,
  ArrowRight,
  Trash2,
  Scale,
  CheckCircle2,
  Leaf,
  Egg,
  Sprout,
  Layers,
  Type,
  Maximize2,
} from 'lucide-react';
import { MASSIVE_FOOD_CATALOG, DIET_FILTERS } from '../../data/massiveFoodDatabase';
import { MEAL_CATEGORIES } from '../../data/foodData';
import { GlassCard } from '../common/GlassCard';
import { MacroPill } from '../common/MacroPill';
import { RecipeDetailModal } from './RecipeDetailModal';
import { MealPhotoScanner } from './MealPhotoScanner';
import { useApp } from '../../context/AppContext';

export function FoodSection() {
  const {
    user,
    todaysMeals,
    totalCaloriesConsumed,
    totalProtein,
    totalCarbs,
    totalFats,
    deleteMeal,
    isMealScannerOpen,
    setIsMealScannerOpen,
    fontSizeScale,
    setFontSizeScale,
  } = useApp();

  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Filter 500+ recipes and food items
  const filteredRecipes = useMemo(() => {
    return MASSIVE_FOOD_CATALOG.filter((recipe) => {
      // Diet filter
      let matchesDiet = true;
      if (selectedDiet === 'veg') {
        matchesDiet = recipe.diet === 'veg' || recipe.diet === 'vegan';
      } else if (selectedDiet === 'nonveg') {
        matchesDiet = recipe.diet === 'nonveg';
      } else if (selectedDiet === 'vegan') {
        matchesDiet = recipe.diet === 'vegan';
      } else if (selectedDiet === 'eggetarian') {
        matchesDiet = recipe.diet === 'eggetarian';
      } else if (selectedDiet === 'high_protein') {
        matchesDiet = recipe.protein >= 30;
      }

      // Meal category filter
      const matchesCat = selectedCategory === 'all' || recipe.category === selectedCategory;

      // Search query
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDiet && matchesCat && matchesSearch;
    });
  }, [selectedDiet, selectedCategory, searchQuery]);

  const displayedItems = filteredRecipes.slice(0, visibleCount);

  // Calculate percentage of daily calorie target
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / (user.dailyCalorieTarget || 2200)) * 100));
  const proteinTarget = Math.round((user.currentWeight || 75) * 2.0); // 2g per kg
  const proteinPercent = Math.min(100, Math.round((totalProtein / proteinTarget) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Magazine Editorial Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-amber-500/25 p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              500+ Measured Foods & Vegetarian / Non-Vegetarian Filter
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Exact Gram Measurements
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            500+ <span className="gold-gradient-text">FOOD & MACRONUTRIENT</span> VAULT
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mb-6">
            The definitive culinary database for disciplined nutrition. Featuring over <strong>500+ food items, raw staples, and gourmet healthy recipes</strong> with dedicated filters for <strong>Vegetarian (Veg), Non-Vegetarian (Non-Veg), Vegan, and Eggetarian</strong>. Snap a meal photo for AI Vision macro estimation, receive weight-calibrated health ratings, and choose targeted next-meal balance tasks.
          </p>

          {/* Quick CTA to open Camera Scanner & Font Scale */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMealScannerOpen(true)}
              className="gold-btn px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-gold-glow"
            >
              <Camera className="w-4 h-4" />
              <span>Take / Upload Meal Photo & Scan</span>
            </button>

            {/* Adjustable Font Sizer Pill */}
            <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-2xl border border-amber-500/30">
              <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-amber-400" /> Font:
              </span>
              {[
                { id: 'normal', label: 'A', title: 'Normal' },
                { id: 'medium', label: 'A+', title: 'Medium (+8%)' },
                { id: 'large', label: 'A++', title: 'Large (+18%)' },
                { id: 'xlarge', label: 'A+++', title: 'Extra Large (+28%)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFontSizeScale(s.id)}
                  title={s.title}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                    fontSizeScale === s.id
                      ? 'bg-amber-500 text-black shadow-gold-glow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Nutritional Macro Progress Hub */}
      <div className="p-6 rounded-3xl glass-panel border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Today's Metabolic Nutrition Intake
            </span>
            <h3 className="text-lg font-black text-white">Daily Macro Progress</h3>
          </div>
          <div className="text-xs text-slate-400">
            Target Calorie Budget:{' '}
            <strong className="text-amber-300">{user.dailyCalorieTarget} kcal</strong> ·{' '}
            Protein Goal: <strong className="text-amber-400">{proteinTarget}g</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
          {/* Calorie Progress */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Calories</span>
              <span className="text-amber-300 font-bold">{caloriePercent}%</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-amber-300 flex items-baseline gap-1">
                {totalCaloriesConsumed}
                <span className="text-xs text-slate-500 font-normal">/ {user.dailyCalorieTarget} kcal</span>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Protein (2g/kg)</span>
              <span className="text-amber-400 font-bold">{proteinPercent}%</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white flex items-baseline gap-1">
                {totalProtein}g
                <span className="text-xs text-slate-500 font-normal">/ {proteinTarget}g</span>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Carbohydrates</span>
              <span className="text-sky-400 font-bold">Energy</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white">{totalCarbs}g</div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Healthy Fats</span>
              <span className="text-emerald-400 font-bold">Lipids</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white">{totalFats}g</div>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalFats / 70) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR 1: VEG / NON-VEG / VEGAN DIETARY FILTER (PRIMARY) */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
            Filter by Dietary Preference:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DIET_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDiet(d.id);
                  setVisibleCount(24);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition flex items-center gap-2 border ${
                  selectedDiet === d.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-gold-glow-sm'
                    : 'bg-obsidian-850/80 text-slate-300 border-white/5 hover:border-amber-500/30 hover:text-white'
                }`}
              >
                {d.id === 'veg' && <Leaf className="w-4 h-4 text-emerald-400" />}
                {d.id === 'nonveg' && <Flame className="w-4 h-4 text-rose-400" />}
                {d.id === 'vegan' && <Sprout className="w-4 h-4 text-emerald-300" />}
                {d.id === 'eggetarian' && <Egg className="w-4 h-4 text-amber-300" />}
                {d.id === 'all' && <Sparkles className="w-4 h-4" />}
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meal Category & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 500+ items (paneer, chicken, salmon, tofu, quinoa, oats, skyr)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Meal Timing Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {MEAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setVisibleCount(24);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                    : 'bg-obsidian-850 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Info */}
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>
            Showing <strong className="text-amber-300">{displayedItems.length}</strong> of{' '}
            <strong className="text-white">{filteredRecipes.length}</strong> filtered food items
          </span>
          <span className="text-[11px] font-mono text-amber-400/80">
            Adjustable font enabled · Fluid mobile/desktop layout
          </span>
        </div>
      </div>

      {/* Magazine Editorial Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((recipe) => (
          <GlassCard
            key={recipe.id}
            className="flex flex-col justify-between border-amber-500/15 group cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            {/* Image Thumbnail */}
            <div className="relative h-52 overflow-hidden bg-black/60 rounded-t-2xl">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent" />

              {/* Diet Badge (Veg, Non-Veg, Vegan, Eggetarian) */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                    recipe.diet === 'veg'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : recipe.diet === 'vegan'
                      ? 'bg-green-950/80 text-green-300 border-green-500/40'
                      : recipe.diet === 'eggetarian'
                      ? 'bg-yellow-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {recipe.diet === 'veg' ? '🌱 Vegetarian' : recipe.diet === 'vegan' ? '🌿 Vegan' : recipe.diet === 'eggetarian' ? '🥚 Eggetarian' : '🥩 Non-Veg'}
                </span>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                  {recipe.calories} kcal
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition tracking-tight">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {recipe.subtitle}
                </p>
              </div>

              {/* Exact Measurements Pill Preview */}
              <div className="p-2.5 rounded-xl bg-obsidian-850/80 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3 h-3 text-amber-400" /> Exact Portions:
                  </span>
                  <span>{recipe.ingredients?.length || 2} items</span>
                </div>
                <div className="text-[11px] text-amber-200/90 truncate font-mono">
                  {recipe.ingredients?.slice(0, 2).map((ing) => `${ing.name} (${ing.weightGrams}g)`).join(' · ')}
                </div>
              </div>

              {/* Macros Row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <MacroPill label="P" value={recipe.protein} color="amber" />
                <MacroPill label="C" value={recipe.carbs} color="blue" />
                <MacroPill label="F" value={recipe.fats} color="emerald" />
                {recipe.fiber > 0 && <MacroPill label="Fib" value={recipe.fiber} color="rose" />}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {recipe.cookTime || '5 min'}
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Cook Recipe <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredRecipes.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="gold-btn-outline px-8 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg"
          >
            Load More Foods ({filteredRecipes.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Photo Scanner Modal */}
      {isMealScannerOpen && (
        <MealPhotoScanner
          onClose={() => setIsMealScannerOpen(false)}
        />
      )}
    </div>
  );
}
