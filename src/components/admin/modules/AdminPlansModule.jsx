import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { TARGET_AREAS } from '../../../data/transformationPlans';

export function AdminPlansModule({ onFlash }) {
  const { managedPlans, adminUpsertPlan, adminDeletePlan } = useApp();
  const [editingPlan, setEditingPlan] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    adminUpsertPlan(editingPlan);
    onFlash(`Saved plan "${editingPlan.title}" (₹${editingPlan.priceINR}) live!`);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white">
          Transformation Plans &amp; Tier Pricing ({(managedPlans || []).length})
        </h3>
        <button
          onClick={() =>
            setEditingPlan({
              title: '',
              targetArea: 'belly_fat',
              badge: 'Custom Protocol',
              durationDays: 30,
              priceINR: 99,
              mrpINR: 499,
              dailyCalorieDeficit: 450,
              dailySugarLimitGrams: 22,
              workoutDaysPerWeek: 5,
              tierGranted: 'Pro Athlete',
              description: '',
              active: true,
            })
          }
          className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {editingPlan && (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-obsidian-900 border border-amber-400/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase">
              {editingPlan.id ? `Edit Plan: ${editingPlan.title}` : 'Create Transformation Plan'}
            </span>
            <button type="button" onClick={() => setEditingPlan(null)} className="text-xs text-slate-400">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              required
              type="text"
              placeholder="Plan Title"
              value={editingPlan.title || ''}
              onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
              className="sm:col-span-2 px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={editingPlan.targetArea || 'belly_fat'}
              onChange={(e) => setEditingPlan({ ...editingPlan, targetArea: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              {TARGET_AREAS.map((area) => (
                <option className="bg-obsidian-900" key={area.id} value={area.id}>
                  {area.label}
                </option>
              ))}
            </select>
            <select
              value={editingPlan.durationDays || 30}
              onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: Number(e.target.value) })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value={30}>30 Days</option>
              <option className="bg-obsidian-900" value={60}>60 Days</option>
              <option className="bg-obsidian-900" value={90}>90 Days</option>
            </select>
            <input
              type="number"
              placeholder="Price ₹"
              value={editingPlan.priceINR ?? 999}
              onChange={(e) => setEditingPlan({ ...editingPlan, priceINR: Number(e.target.value) || 0 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Calorie Deficit"
              value={editingPlan.dailyCalorieDeficit ?? 450}
              onChange={(e) => setEditingPlan({ ...editingPlan, dailyCalorieDeficit: Number(e.target.value) || 300 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Sugar Limit (g)"
              value={editingPlan.dailySugarLimitGrams ?? 22}
              onChange={(e) => setEditingPlan({ ...editingPlan, dailySugarLimitGrams: Number(e.target.value) || 20 })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={editingPlan.tierGranted || 'Pro Athlete'}
              onChange={(e) => setEditingPlan({ ...editingPlan, tierGranted: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="Verified Starter">Verified Starter</option>
              <option className="bg-obsidian-900" value="Pro Athlete">Pro Athlete</option>
              <option className="bg-obsidian-900" value="Gold Elite Pro">Gold Elite Pro</option>
            </select>
            <input
              type="number"
              placeholder="Monthly MRP ₹"
              value={editingPlan.mrpINR ?? ''}
              onChange={(e) => setEditingPlan({ ...editingPlan, mrpINR: Number(e.target.value) })}
              className="px-3 py-2 rounded-xl glass-input text-slate-300"
            />
            <input
              type="number"
              placeholder="Yearly Price ₹"
              value={editingPlan.yearlyPriceINR ?? ''}
              onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPriceINR: Number(e.target.value) })}
              className="px-3 py-2 rounded-xl glass-input text-amber-300 font-bold"
            />
            <input
              type="number"
              placeholder="Yearly MRP ₹"
              value={editingPlan.yearlyMrpINR ?? ''}
              onChange={(e) => setEditingPlan({ ...editingPlan, yearlyMrpINR: Number(e.target.value) })}
              className="px-3 py-2 rounded-xl glass-input text-slate-300"
            />
          </div>
          <input
            type="text"
            placeholder="Plan Description"
            value={editingPlan.description || ''}
            onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
          />
          <button type="submit" className="gold-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Save Plan Changes</span>
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(managedPlans || []).map((plan) => (
          <div
            key={plan.id}
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              plan.active !== false ? 'bg-obsidian-900 border-white/10' : 'bg-obsidian-950 border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-amber-400">
                  {plan.durationDays} Days · {plan.tierGranted || 'Pro'}
                </span>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-300 block leading-none">
                    ₹{(plan.priceINR ?? 99).toLocaleString('en-IN')}/mo
                  </span>
                  <span className="text-[10px] font-bold text-amber-300">
                    ₹{(plan.yearlyPriceINR ?? 799).toLocaleString('en-IN')}/yr
                  </span>
                </div>
              </div>
              <h4 className="text-sm font-extrabold text-white mt-1">{plan.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{plan.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                onClick={() => setEditingPlan(plan)}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    adminUpsertPlan({ ...plan, active: plan.active === false });
                    onFlash(`${plan.title} -> ${plan.active === false ? 'Active' : 'Paused'}`);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    plan.active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {plan.active !== false ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => {
                    adminDeletePlan(plan.id);
                    onFlash(`Deleted plan "${plan.title}"`);
                  }}
                  className="p-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                  title="Delete plan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
