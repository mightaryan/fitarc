import React, { useState } from 'react';
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
} from 'lucide-react';
import { RECIPES_CATALOG, MEAL_CATEGORIES } from '../../data/foodData';
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
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filter recipes
  const filteredRecipes = RECIPES_CATALOG.filter((recipe) => {
    const matchesCat = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

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
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300">
              Artisan Nutrition & Home Gastronomy · Vol. IV
            </span>
            <span className="text-xs text-slate-400 font-mono">Exact Gram Measurements</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            PRECISION <span className="gold-gradient-text">FOOD & CALORIE</span> LAB
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mb-6">
            Master the culinary art of clean eating at home. Every recipe includes exact gram measurements, precise macro breakdowns, and step-by-step methods. Snap a photo of any meal to instantly estimate calories, receive a personalized nutritional score based on your{' '}
            <strong className="text-amber-300">{user.currentWeight} kg</strong> body weight, and choose your next-meal balancing strategy.
          </p>

          {/* Quick CTA to open Camera Scanner */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMealScannerOpen(true)}
              className="gold-btn px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-gold-glow"
            >
              <Camera className="w-4 h-4" />
              <span>Take / Upload Meal Photo & Scan</span>
            </button>
            <span className="text-xs text-slate-400">
              Instant AI Vision macro estimation & smart ratings
            </span>
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
            <strong className="text-amber-300">{user.dailyCalorieTarget} kcal</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
          {/* Calorie Ring */}
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

      {/* Today's Logged Meals Stream with AI Ratings & Next-Meal Guidance */}
      {todaysMeals.length > 0 && (
        <div className="p-6 rounded-3xl glass-panel-glow border border-amber-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Today's Meal Diary & Photo Logs</h3>
                <p className="text-xs text-slate-400">
                  {todaysMeals.length} logged meal{todaysMeals.length > 1 ? 's' : ''} today · Total{' '}
                  <strong className="text-amber-300">{totalCaloriesConsumed} kcal</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMealScannerOpen(true)}
              className="gold-btn-outline px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysMeals.map((meal) => (
              <div
                key={meal.id}
                className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-3 group"
              >
                <div className="flex gap-3">
                  {/* Photo thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-amber-500/20 bg-obsidian-900">
                    <img
                      src={meal.photoUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {meal.mealType}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{meal.loggedAt}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate mt-0.5">{meal.title}</h4>
                    <div className="text-xs font-black text-amber-300 mt-1">
                      {meal.calories} <span className="text-[10px] text-slate-400 font-normal">kcal</span>
                    </div>

                    {/* Macro pills */}
                    <div className="flex gap-1.5 mt-1 text-[10px] text-slate-400">
                      <span>P: {meal.protein}g</span>
                      <span>·</span>
                      <span>C: {meal.carbs}g</span>
                      <span>·</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 self-start transition"
                    title="Remove meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating badge & Next meal guidance note */}
                {meal.rating && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        Rating vs {user.currentWeight}kg:
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {meal.rating.badgeText} ({meal.rating.score})
                      </span>
                    </div>

                    {meal.nextMealGuidance && (
                      <div className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <strong className="text-amber-200">Next Meal Task:</strong>{' '}
                        {meal.nextMealGuidance.title || meal.nextMealGuidance.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Catalogue Filter Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MEAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition flex items-center gap-2 border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-gold-glow-sm'
                  : 'bg-obsidian-850/80 text-slate-300 border-white/5 hover:border-amber-500/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search healthy home recipes, ingredients (quinoa, salmon, avocado, skyr)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Magazine Editorial Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
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

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 border border-amber-500/30 text-amber-300 backdrop-blur-md">
                  {recipe.category}
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
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition tracking-tight">
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
                  <span>{recipe.ingredients.length} measured items</span>
                </div>
                <div className="text-[11px] text-amber-200/90 truncate font-mono">
                  {recipe.ingredients.slice(0, 2).map((ing) => `${ing.name} (${ing.weightGrams}g)`).join(' · ')}
                </div>
              </div>

              {/* Macros Row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <MacroPill label="P" value={recipe.protein} color="amber" />
                <MacroPill label="C" value={recipe.carbs} color="blue" />
                <MacroPill label="F" value={recipe.fats} color="emerald" />
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {recipe.prepTime} prep · {recipe.cookTime} cook
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Cook Recipe <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

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
