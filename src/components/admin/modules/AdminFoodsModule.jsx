import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MASSIVE_FOOD_CATALOG } from '../../../data/massiveFoodDatabase';

export function AdminFoodsModule({ onFlash }) {
  const {
    customFoods,
    disabledFoodIds,
    foodOverrides,
    adminUpsertFood,
    adminToggleFoodDisabled,
    adminDeleteCustomFood,
    adminResetFoodOverride,
  } = useApp();

  const [query, setQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all');
  const [editingFood, setEditingFood] = useState(null);

  const foodsList = useMemo(() => {
    const base = [...(customFoods || []), ...MASSIVE_FOOD_CATALOG].map((f) => {
      const ov = foodOverrides?.[f.id];
      return ov ? { ...f, ...ov, hasOverride: true } : f;
    });

    const q = query.trim().toLowerCase();
    return base
      .filter((f) => {
        if (dietFilter === 'custom') return Boolean(f.isCustom);
        if (dietFilter === 'hidden') return (disabledFoodIds || []).includes(f.id);
        if (dietFilter !== 'all' && f.diet !== dietFilter) return false;
        if (!q) return true;
        return (
          (f.title || f.name || '').toLowerCase().includes(q) ||
          (f.category || '').toLowerCase().includes(q) ||
          (f.subtitle || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 50);
  }, [customFoods, foodOverrides, disabledFoodIds, dietFilter, query]);

  const handleSave = (e) => {
    e.preventDefault();
    adminUpsertFood(editingFood);
    onFlash(`Saved "${editingFood.title}" live to Food & Culinary Archive!`);
    setEditingFood(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, meals, or protein dishes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl glass-input text-xs font-bold text-slate-200"
          >
            <option className="bg-obsidian-900" value="all">All Diets</option>
            <option className="bg-obsidian-900" value="veg">Veg</option>
            <option className="bg-obsidian-900" value="nonveg">Non-Veg</option>
            <option className="bg-obsidian-900" value="vegan">Vegan</option>
            <option className="bg-obsidian-900" value="eggetarian">Eggetarian</option>
            <option className="bg-obsidian-900" value="custom">Admin Custom ({customFoods?.length || 0})</option>
            <option className="bg-obsidian-900" value="hidden">Hidden ({disabledFoodIds?.length || 0})</option>
          </select>

          <button
            onClick={() =>
              setEditingFood({
                title: '',
                category: 'lunch',
                diet: 'veg',
                calories: 440,
                protein: 36,
                carbs: 40,
                fats: 12,
                sugar: 3,
                fiber: 6,
                cookTime: '12 min',
                subtitle: '',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=75',
              })
            }
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Recipe</span>
          </button>
        </div>
      </div>

      {editingFood && (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-obsidian-900 border border-amber-400/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase">
              {editingFood.id ? `Editing: ${editingFood.title}` : 'Create Custom Food / Recipe'}
            </span>
            <button type="button" onClick={() => setEditingFood(null)} className="text-xs text-slate-400">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              required
              type="text"
              placeholder="Recipe / Meal Title"
              value={editingFood.title || ''}
              onChange={(e) => setEditingFood({ ...editingFood, title: e.target.value })}
              className="sm:col-span-2 px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={editingFood.diet || 'veg'}
              onChange={(e) => setEditingFood({ ...editingFood, diet: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="veg">Veg</option>
              <option className="bg-obsidian-900" value="nonveg">Non-Veg</option>
              <option className="bg-obsidian-900" value="vegan">Vegan</option>
              <option className="bg-obsidian-900" value="eggetarian">Eggetarian</option>
            </select>
            <select
              value={editingFood.category || 'lunch'}
              onChange={(e) => setEditingFood({ ...editingFood, category: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="breakfast">Breakfast</option>
              <option className="bg-obsidian-900" value="lunch">Lunch</option>
              <option className="bg-obsidian-900" value="dinner">Dinner</option>
              <option className="bg-obsidian-900" value="snacks">Snacks</option>
            </select>
            <input
              type="number"
              placeholder="Calories"
              value={editingFood.calories ?? 400}
              onChange={(e) => setEditingFood({ ...editingFood, calories: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={editingFood.protein ?? 30}
              onChange={(e) => setEditingFood({ ...editingFood, protein: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              value={editingFood.carbs ?? 40}
              onChange={(e) => setEditingFood({ ...editingFood, carbs: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Fats (g)"
              value={editingFood.fats ?? 12}
              onChange={(e) => setEditingFood({ ...editingFood, fats: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>
          <input
            type="text"
            placeholder="Subtitle / Photo URL note"
            value={editingFood.subtitle || ''}
            onChange={(e) => setEditingFood({ ...editingFood, subtitle: e.target.value })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
          />
          <button type="submit" className="gold-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Save Recipe Live</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {foodsList.map((f) => {
          const isHidden = (disabledFoodIds || []).includes(f.id);
          return (
            <div
              key={f.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                isHidden ? 'bg-obsidian-950 border-white/5 opacity-60' : 'bg-obsidian-900 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 bg-black"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-emerald-400">
                    {f.diet} · {f.category} · {f.calories} kcal
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">{f.title}</h4>
                  <span className="text-[11px] text-slate-400">
                    {f.protein}g P · {f.carbs}g C · {f.fats}g F
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setEditingFood(f)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300"
                  title="Edit food"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    adminToggleFoodDisabled(f.id);
                    onFlash(`${f.title} ${isHidden ? 'restored to' : 'hidden from'} Food Archive`);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300"
                >
                  {isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                {f.hasOverride && !f.isCustom && (
                  <button
                    onClick={() => {
                      adminResetFoodOverride(f.id);
                      onFlash(`Reset override for ${f.title}`);
                    }}
                    className="p-2 rounded-xl bg-white/5 text-sky-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                {f.isCustom && (
                  <button
                    onClick={() => {
                      adminDeleteCustomFood(f.id);
                      onFlash(`Deleted custom recipe ${f.title}`);
                    }}
                    className="p-2 rounded-xl bg-rose-500/15 text-rose-300"
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
