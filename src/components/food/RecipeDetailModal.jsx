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
  Check,
} from 'lucide-react';
import { MacroPill } from '../common/MacroPill';
import { getIngredientThumbnail } from '../../data/ingredientImages';
import { useApp } from '../../context/AppContext';

export function RecipeDetailModal({ recipe, onClose }) {
  const { user, logMeal } = useApp();
  const [servings, setServings] = useState(recipe.servings || 1);
  const [mealType, setMealType] = useState(recipe.category || 'lunch');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isLogged, setIsLogged] = useState(false);

  if (!recipe) return null;

  const multiplier = servings / (recipe.servings || 1);
  const totalCalories = Math.round(recipe.calories * multiplier);
  const totalProtein = Math.round(recipe.protein * multiplier);
  const totalCarbs = Math.round(recipe.carbs * multiplier);
  const totalFats = Math.round(recipe.fats * multiplier);
  const totalFiber = Math.round((recipe.fiber || 0) * multiplier);

  const toggleCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

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
        score: 9.6,
        grade: 'A+',
        badgeText: 'Home-Cooked Gold',
        feedback: `Prepared from whole ingredients with exact measurements. Superb nutrient bioavailability.`,
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
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-glow rounded-3xl border border-amber-500/25 text-slate-100 shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-obsidian-900/95 backdrop-blur-md border-b border-amber-500/15">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {recipe.diet === 'veg' ? '🌱 Vegetarian' : recipe.diet === 'vegan' ? '🌿 Vegan' : recipe.diet === 'eggetarian' ? '🥚 Eggetarian' : '🥩 Non-Veg'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Cook: {recipe.cookTime || '15 min'}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                {recipe.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Actual Cooked Dish Photography with Macro Bar */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">
            <img
              src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
              alt={recipe.title}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/30 to-transparent" />

            {/* Macro Strip */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-black/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-baseline gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-2xl font-bold text-amber-300">{totalCalories}</span>
                <span className="text-xs font-medium text-slate-400">kcal total</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <MacroPill label="Protein" value={totalProtein} color="amber" />
                <MacroPill label="Carbs" value={totalCarbs} color="blue" />
                <MacroPill label="Fats" value={totalFats} color="emerald" />
                {totalFiber > 0 && <MacroPill label="Fiber" value={totalFiber} color="rose" />}
              </div>
            </div>
          </div>

          {/* Servings Scaler */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-obsidian-850/80 border border-amber-500/15">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                Portion & Servings Scaler
              </span>
              <span className="text-xs text-slate-400">
                Ingredients and gram weights scale automatically
              </span>
            </div>

            <div className="flex items-center gap-3 bg-black/50 p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-amber-300 px-2">{servings} serving{servings > 1 ? 's' : ''}</span>
              <button
                onClick={() => setServings((s) => s + 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500/40 pl-3">
            "{recipe.description}"
          </p>

          {/* INGREDIENTS SECTION: LIST FORMAT WITH SMALL ITEM THUMBNAILS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                Measured Ingredients (List View)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {recipe.ingredients?.length || 0} measured items for {servings} serving(s)
              </span>
            </div>

            {/* Vertical List of Ingredients */}
            <div className="space-y-2">
              {recipe.ingredients?.map((ing, idx) => {
                const scaledWeight = Math.round(ing.weightGrams * multiplier);
                const thumb = getIngredientThumbnail(ing.name);
                const isChecked = checkedIngredients[idx];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                        : 'bg-obsidian-850/70 border-white/5 hover:border-amber-500/20 text-slate-200'
                    }`}
                  >
                    {/* Left: Checkbox + Small Item Thumbnail + Name & Notes */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Check indicator */}
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                          isChecked
                            ? 'bg-amber-500 border-amber-400 text-black'
                            : 'border-slate-600 bg-black/40'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Small ingredient item thumbnail */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-amber-500/20 bg-black/60 shadow-inner">
                        <img
                          src={thumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80'}
                          alt={ing.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                          {ing.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {ing.measurement} · {ing.notes || 'Raw measured'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Exact Gram Badge */}
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shrink-0">
                      {scaledWeight}g
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Cooking Guide */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Culinary Preparation Method
            </h3>

            <div className="space-y-2.5">
              {recipe.instructions?.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-obsidian-850/60 border border-white/5"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef Pro Tip */}
          {recipe.chefTips && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-semibold text-xs uppercase tracking-wider mb-0.5">
                  Chef Nutrition Tip
                </strong>
                <p className="text-xs sm:text-sm leading-relaxed text-amber-100/90">{recipe.chefTips}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 p-4 sm:p-5 bg-obsidian-900/95 backdrop-blur-md border-t border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Meal:</span>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl glass-input text-xs font-medium text-slate-200"
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
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-medium text-slate-300 hover:bg-white/5 transition"
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
                  Meal Logged!
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  Log Meal ({totalCalories} kcal)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
