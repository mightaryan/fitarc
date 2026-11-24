import React, { useState, useMemo } from 'react';
import {
  Camera,
  Search,
  Sparkles,
  Utensils,
  Clock,
  ArrowRight,
  Trash2,
  Scale,
  Leaf,
  Egg,
  Sprout,
  Flame,
  Award,
  X,
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
    totalSugar,
    sugarLimitGrams,
    deleteMeal,
    isMealScannerOpen,
    setIsMealScannerOpen,
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
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (recipe.title && recipe.title.toLowerCase().includes(q)) ||
        (recipe.name && recipe.name.toLowerCase().includes(q)) ||
        (recipe.description && recipe.description.toLowerCase().includes(q)) ||
        (recipe.tags && recipe.tags.some((t) => t.toLowerCase().includes(q))) ||
        (recipe.ingredients && recipe.ingredients.some((i) => i.name.toLowerCase().includes(q)));

      return matchesDiet && matchesCat && matchesSearch;
    });
  }, [selectedDiet, selectedCategory, searchQuery]);

  const displayedItems = filteredRecipes.slice(0, visibleCount);

  // Calculate percentages
  const targetCals = user.dailyCalorieTarget || 2200;
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / targetCals) * 100));
  const proteinTarget = Math.round((user.currentWeight || 75) * 2.0); // 2g per kg
  const proteinPercent = Math.min(100, Math.round((totalProtein / proteinTarget) * 100));
  const carbPercent = Math.min(100, Math.round((totalCarbs / 220) * 100));
  const fatPercent = Math.min(100, Math.round((totalFats / 70) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sleek, Elegant Header (Minimalist Luxury Aesthetic) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {MASSIVE_FOOD_CATALOG.length.toLocaleString()}+ Whole Foods & Recipes
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              Exact Gram Macros
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            Culinary <span className="gold-gradient-text font-extrabold">Archive</span>
          </h1>
        </div>

        {/* Quick Action: Take / Upload Meal Photo */}
        <button
          onClick={() => setIsMealScannerOpen(true)}
          className="gold-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-gold-glow-sm self-start sm:self-auto active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Snap & Scan Meal</span>
        </button>
      </div>

      {/* LUXURY COMPACT MACRONUTRIENT & SUGAR BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-obsidian-850 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Calories</span>
            <span className="text-base sm:text-lg font-bold text-amber-300">
              {totalCaloriesConsumed} <span className="text-[10px] text-slate-400 font-normal">/ {targetCals}</span>
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">{caloriePercent}%</span>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-850 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Protein</span>
            <span className="text-base sm:text-lg font-bold text-white">
              {totalProtein}g <span className="text-[10px] text-slate-400 font-normal">/ {proteinTarget}g</span>
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">{proteinPercent}%</span>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-850 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Carbs</span>
            <span className="text-base sm:text-lg font-bold text-sky-300">{totalCarbs}g</span>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">{carbPercent}%</span>
        </div>

        {/* Daily Sugar Intake Tracker */}
        <div className={`p-3 rounded-xl bg-obsidian-850 border flex items-center justify-between ${totalSugar > sugarLimitGrams ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/20'
          }`}>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Sugar</span>
            <span className={`text-base sm:text-lg font-bold ${totalSugar > sugarLimitGrams ? 'text-rose-400' : 'text-amber-300'
              }`}>
              {totalSugar}g <span className="text-[10px] text-slate-400 font-normal">/ {sugarLimitGrams}g</span>
            </span>
          </div>
          <span className={`text-xs font-mono font-bold ${totalSugar > sugarLimitGrams ? 'text-rose-400' : 'text-amber-400'
            }`}>
            {Math.round((totalSugar / sugarLimitGrams) * 100)}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-850 border border-white/5 flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Fats</span>
            <span className="text-base sm:text-lg font-bold text-emerald-300">{totalFats}g</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">{fatPercent}%</span>
        </div>
      </div>

      {/* FILTER BAR: VEG / NON-VEG / VEGAN / EGGETARIAN DIETARY FILTERS */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DIET_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDiet(d.id);
                  setVisibleCount(24);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition flex items-center gap-2 border ${selectedDiet === d.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-gold-glow-sm font-bold'
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
              placeholder="Search 500+ foods (paneer, salmon, chicken, tofu, quinoa, oats, skyr)..."
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${selectedCategory === cat.id
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
            <strong className="text-white">{filteredRecipes.length}</strong> measured foods
          </span>
          <span className="text-[11px] font-mono text-amber-400/80">
            Click any dish for ingredient thumbnails & list view
          </span>
        </div>
      </div>

      {/* Magazine Editorial Recipes Grid (Authentic Cooked Dishes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((recipe) => (
          <GlassCard
            key={recipe.id}
            className="flex flex-col justify-between border-amber-500/15 group cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            {/* Image Thumbnail of Cooked Dish */}
            <div className="relative h-52 overflow-hidden bg-black/60 rounded-t-2xl">
              <img
                src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=70'}
                alt={recipe.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=70';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent" />

              {/* Diet Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${recipe.diet === 'veg'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : recipe.diet === 'vegan'
                      ? 'bg-green-950/80 text-green-300 border-green-500/40'
                      : recipe.diet === 'eggetarian'
                        ? 'bg-yellow-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    }`}
                >
                  {recipe.diet === 'veg' ? '🌱 Veg' : recipe.diet === 'vegan' ? '🌿 Vegan' : recipe.diet === 'eggetarian' ? '🥚 Egg' : '🥩 Non-Veg'}
                </span>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                  {recipe.calories} kcal
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition tracking-tight line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {recipe.subtitle}
                </p>
              </div>

              {/* Exact Measurements Pill Preview */}
              <div className="p-2.5 rounded-xl bg-obsidian-850/80 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3 h-3 text-amber-400" /> Measured Ingredients:
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
            className="gold-btn-outline px-8 py-3 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg"
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
