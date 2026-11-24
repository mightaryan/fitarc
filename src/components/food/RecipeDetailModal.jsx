import React, { useState } from 'react';
import {
  X,
  Clock,
  Flame,
  ChefHat,
  CheckCircle2,
  Utensils,
  Scale,
  Sparkles,
  BookOpen,
  Plus,
  Minus,
} from 'lucide-react';
import { MacroPill } from '../common/MacroPill';
import { useApp } from '../../context/AppContext';

export function RecipeDetailModal({ recipe, onClose }) {
  const { user, logMeal } = useApp();
  const [servings, setServings] = useState(recipe.servings || 1);
  const [mealType, setMealType] = useState(recipe.category || 'lunch');
  const [isLogged, setIsLogged] = useState(false);

  if (!recipe) return null;

  const multiplier = servings / (recipe.servings || 1);
  const totalCalories = Math.round(recipe.calories * multiplier);
  const totalProtein = Math.round(recipe.protein * multiplier);
  const totalCarbs = Math.round(recipe.carbs * multiplier);
  const totalFats = Math.round(recipe.fats * multiplier);
  const totalFiber = Math.round(recipe.fiber * multiplier);

  const handleLogRecipe = () => {
    logMeal({
      mealType,
      title: recipe.title,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
      photoUrl: recipe.image,
      rating: {
        score: 9.5,
        grade: 'A+',
        badgeText: 'Home-Cooked Gold',
        feedback: `Prepared from raw ingredients with exact measurements. Excellent nutrient bioavailability.`,
      },
      nextMealGuidance: {
        chosen: 'lean_protein',
        title: 'Post-Meal Energy',
        text: 'Nourishing whole food with complete amino acid profile.',
      },
    });

    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-3xl border border-amber-500/30 text-slate-100 shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-obsidian-900/90 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {recipe.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Prep: {recipe.prepTime} · Cook: {recipe.cookTime}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {recipe.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Hero Image & Macro Banner */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/30 to-transparent" />

            {/* Floating Macro Strip */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-black/75 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="flex items-baseline gap-1.5">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-2xl font-black text-amber-300">{totalCalories}</span>
                <span className="text-xs font-bold text-slate-400">kcal total</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <MacroPill label="Protein" value={totalProtein} color="amber" />
                <MacroPill label="Carbs" value={totalCarbs} color="blue" />
                <MacroPill label="Fats" value={totalFats} color="emerald" />
                <MacroPill label="Fiber" value={totalFiber} color="rose" />
              </div>
            </div>
          </div>

          {/* Servings Scaler */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-obsidian-850 border border-amber-500/15">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Adjust Servings & Portion
              </span>
              <span className="text-xs text-slate-400">
                Ingredients and calories scale automatically
              </span>
            </div>

            <div className="flex items-center gap-3 bg-black/50 p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-black text-amber-300 px-2">{servings} serving{servings > 1 ? 's' : ''}</span>
              <button
                onClick={() => setServings((s) => s + 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500/50 pl-3">
            "{recipe.description}"
          </p>

          {/* Exact Ingredients with Grams & Measurements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                Exact Ingredient Measurements
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Scaled for {servings} serving(s)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const scaledWeight = Math.round(ing.weightGrams * multiplier);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-obsidian-850/70 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{ing.name}</div>
                      <div className="text-[11px] text-slate-400">{ing.measurement} · {ing.notes}</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shrink-0">
                      {scaledWeight}g
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Cooking Guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Step-by-Step Culinary Method
            </h3>

            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-obsidian-850/60 border border-white/5"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Chef Pro Tip */}
          {recipe.chefTips && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                  Culinary Bio-Hack
                </strong>
                <p className="text-xs sm:text-sm leading-relaxed">{recipe.chefTips}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Assign to:</span>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg glass-input text-xs font-semibold text-slate-200"
            >
              <option value="breakfast" className="bg-obsidian-900">Breakfast</option>
              <option value="lunch" className="bg-obsidian-900">Lunch</option>
              <option value="dinner" className="bg-obsidian-900">Dinner</option>
              <option value="snacks" className="bg-obsidian-900">Snack</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
            >
              Close
            </button>
            <button
              onClick={handleLogRecipe}
              disabled={isLogged}
              className="gold-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              {isLogged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Recipe Logged!
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  Log This Meal ({totalCalories} kcal)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
