import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit3, Trash2, Save, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export function AdminUsersModule({ onFlash }) {
  const { user, profilesVault, adminCreateUser, adminUpsertUser, adminDeleteUser } = useApp();

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    memberTier: 'Pro Athlete',
    currentWeight: '74',
    targetWeight: '69',
    dailyCalorieTarget: '2200',
    goal: 'fat_loss',
  });

  const usersList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(profilesVault || {})
      .map(([id, entry]) => ({
        id,
        ...entry.profile,
        workoutsCount: (entry.loggedWorkouts || []).length,
        mealsCount: (entry.loggedMeals || []).length,
      }))
      .filter((u) => {
        if (roleFilter !== 'all' && (u.role || 'member') !== roleFilter) return false;
        if (!q) return true;
        return (
          (u.name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.memberTier || '').toLowerCase().includes(q)
        );
      });
  }, [profilesVault, query, roleFilter]);

  const handleCreate = (e) => {
    e.preventDefault();
    adminCreateUser(createForm);
    setCreateForm({
      name: '',
      email: '',
      phone: '',
      role: 'member',
      memberTier: 'Pro Athlete',
      currentWeight: '74',
      targetWeight: '69',
      dailyCalorieTarget: '2200',
      goal: 'fat_loss',
    });
    setShowCreate(false);
    onFlash('Created new user profile in Vault!');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser?.id) return;
    adminUpsertUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      role: editingUser.role,
      memberTier: editingUser.memberTier,
      currentWeight: parseFloat(editingUser.currentWeight) || 75,
      targetWeight: parseFloat(editingUser.targetWeight) || 70,
      dailyCalorieTarget: parseInt(editingUser.dailyCalorieTarget, 10) || 2200,
      status: editingUser.status || 'active',
    });
    onFlash(`Updated profile for "${editingUser.name}"!`);
    setEditingUser(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search athletes by name, email, or tier..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl glass-input text-xs text-white"
          >
            <option className="bg-obsidian-900" value="all">All Roles</option>
            <option className="bg-obsidian-900" value="admin">Admin</option>
            <option className="bg-obsidian-900" value="coach">Coach</option>
            <option className="bg-obsidian-900" value="member">Member</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreate((prev) => !prev)}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-2xl bg-obsidian-900 border border-amber-500/35 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-300">Create New Athlete Profile</span>
            <button type="button" onClick={() => setShowCreate(false)} className="text-xs text-slate-400">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              required
              type="text"
              placeholder="Full Name"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={createForm.currentWeight}
              onChange={(e) => setCreateForm({ ...createForm, currentWeight: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <input
              type="number"
              placeholder="Daily Calories"
              value={createForm.dailyCalorieTarget}
              onChange={(e) => setCreateForm({ ...createForm, dailyCalorieTarget: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            />
            <select
              value={createForm.memberTier}
              onChange={(e) => setCreateForm({ ...createForm, memberTier: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="Verified Starter">Verified Starter</option>
              <option className="bg-obsidian-900" value="Pro Athlete">Pro Athlete</option>
              <option className="bg-obsidian-900" value="Gold Elite Pro">Gold Elite Pro</option>
            </select>
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              className="px-3 py-2 rounded-xl glass-input text-white"
            >
              <option className="bg-obsidian-900" value="member">Member</option>
              <option className="bg-obsidian-900" value="coach">Coach</option>
              <option className="bg-obsidian-900" value="admin">Admin</option>
            </select>
            <select
              value={createForm.hasPaidPlan ? 'paid' : 'free'}
              onChange={(e) => setCreateForm({ ...createForm, hasPaidPlan: e.target.value === 'paid' })}
              className="px-3 py-2 rounded-xl glass-input text-amber-300 font-bold"
            >
              <option className="bg-obsidian-900" value="free">Free Starter (Advanced Locked)</option>
              <option className="bg-obsidian-900" value="paid">Paid Subscriber (Unlocked)</option>
            </select>
            <button type="submit" className="gold-btn py-2 px-4 rounded-xl font-black sm:col-span-2">
              Save Athlete to Vault
            </button>
          </div>
        </form>
      )}

      {/* Edit User Modal/Drawer */}
      {editingUser && (
        <form
          onSubmit={handleSaveEdit}
          className="p-4 rounded-2xl bg-obsidian-900 border border-emerald-400/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-emerald-300">
              Editing Athlete: {editingUser.name}
            </span>
            <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
              <input
                required
                type="text"
                value={editingUser.name || ''}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={editingUser.currentWeight || 75}
                onChange={(e) => setEditingUser({ ...editingUser, currentWeight: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Calorie Target (kcal)</label>
              <input
                type="number"
                value={editingUser.dailyCalorieTarget || 2200}
                onChange={(e) => setEditingUser({ ...editingUser, dailyCalorieTarget: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Plan Billing Status</label>
              <select
                value={editingUser.hasPaidPlan ? (editingUser.planBillingCycle || 'monthly') : 'free'}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingUser({
                    ...editingUser,
                    hasPaidPlan: val !== 'free',
                    planBillingCycle: val === 'free' ? null : val,
                    memberTier:
                      val === 'free'
                        ? 'Free Starter'
                        : editingUser.memberTier === 'Free Starter'
                          ? 'Pro Athlete'
                          : editingUser.memberTier,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl glass-input text-emerald-300 font-bold"
              >
                <option className="bg-obsidian-900" value="free">Free Starter (Advanced Locked)</option>
                <option className="bg-obsidian-900" value="monthly">Paid Plan (Monthly)</option>
                <option className="bg-obsidian-900" value="yearly">Paid Plan (Yearly)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">App Language</label>
              <select
                value={editingUser.language || 'en'}
                onChange={(e) => setEditingUser({ ...editingUser, language: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-sky-300 font-bold"
              >
                <option className="bg-obsidian-900" value="en">EN · English</option>
                <option className="bg-obsidian-900" value="hi">HI · हिन्दी</option>
                <option className="bg-obsidian-900" value="ar">AR · العربية</option>
                <option className="bg-obsidian-900" value="tr">TR · Türkçe</option>
                <option className="bg-obsidian-900" value="ru">RU · Русский</option>
                <option className="bg-obsidian-900" value="es">ES · Español</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Profile Photo URL (Optional)</label>
              <input
                type="url"
                placeholder="https://... or uploaded in Vault"
                value={editingUser.avatarUrl || ''}
                onChange={(e) => setEditingUser({ ...editingUser, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
          </div>
          <button type="submit" className="gold-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Update User Record</span>
          </button>
        </form>
      )}

      {/* User Rows */}
      <div className="space-y-2.5">
        {usersList.map((u) => (
          <div
            key={u.id}
            className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center overflow-hidden shrink-0">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                ) : (
                  (u.name || 'AV').slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-extrabold text-white">{u.name}</span>
                  {u.id === user?.id && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-black uppercase">
                      Active Vault Profile
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.hasPaidPlan
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                        : 'bg-slate-800 text-slate-300 border border-white/10'
                      }`}
                  >
                    {u.hasPaidPlan ? `Paid · ${u.planBillingCycle || 'monthly'}` : 'Free Starter'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${u.status === 'suspended'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                  >
                    {u.status || 'active'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {u.email || u.phone || u.id} · Lang: {(u.language || 'en').toUpperCase()} · {u.currentWeight || 75} kg · {u.dailyCalorieTarget || 2200} kcal · {u.workoutsCount} workouts
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                onClick={() => setEditingUser(u)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <select
                value={u.role || 'member'}
                onChange={(e) => {
                  adminUpsertUser(u.id, { role: e.target.value });
                  onFlash(`Updated ${u.name}'s role to ${e.target.value}`);
                }}
                className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] font-bold text-slate-200"
              >
                <option className="bg-obsidian-900" value="member">Role: Member</option>
                <option className="bg-obsidian-900" value="coach">Role: Coach</option>
                <option className="bg-obsidian-900" value="admin">Role: Admin</option>
              </select>

              <select
                value={u.memberTier || 'Verified Starter'}
                onChange={(e) => {
                  adminUpsertUser(u.id, { memberTier: e.target.value });
                  onFlash(`Updated ${u.name}'s tier to ${e.target.value}`);
                }}
                className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] font-bold text-amber-300"
              >
                <option className="bg-obsidian-900" value="Verified Starter">Verified Starter</option>
                <option className="bg-obsidian-900" value="Pro Athlete">Pro Athlete</option>
                <option className="bg-obsidian-900" value="Gold Elite Pro">Gold Elite Pro</option>
              </select>

              <select
                value={u.hasPaidPlan ? (u.planBillingCycle || 'monthly') : 'free'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'free') {
                    adminUpsertUser(u.id, { hasPaidPlan: false, planBillingCycle: null, memberTier: 'Free Starter' });
                    onFlash(`${u.name} downgraded to Free Starter`);
                  } else {
                    adminUpsertUser(u.id, {
                      hasPaidPlan: true,
                      planBillingCycle: val,
                      memberTier: u.memberTier === 'Free Starter' ? 'Pro Athlete' : u.memberTier,
                    });
                    onFlash(`${u.name} unlocked Paid (${val})`);
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] font-bold text-emerald-300"
              >
                <option className="bg-obsidian-900" value="free">Plan: Free</option>
                <option className="bg-obsidian-900" value="monthly">Paid: Monthly</option>
                <option className="bg-obsidian-900" value="yearly">Paid: Yearly</option>
              </select>

              <select
                value={u.language || 'en'}
                onChange={(e) => {
                  adminUpsertUser(u.id, { language: e.target.value });
                  onFlash(`Set ${u.name}'s language to ${e.target.value.toUpperCase()}`);
                }}
                className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] font-bold text-sky-300"
              >
                <option className="bg-obsidian-900" value="en">EN · English</option>
                <option className="bg-obsidian-900" value="hi">HI · हिन्दी</option>
                <option className="bg-obsidian-900" value="ar">AR · العربية</option>
                <option className="bg-obsidian-900" value="tr">TR · Türkçe</option>
                <option className="bg-obsidian-900" value="ru">RU · Русский</option>
                <option className="bg-obsidian-900" value="es">ES · Español</option>
              </select>

              <button
                onClick={() => {
                  const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
                  adminUpsertUser(u.id, { status: nextStatus });
                  onFlash(`${u.name} status -> ${nextStatus}`);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold text-slate-300"
              >
                {u.status === 'suspended' ? 'Activate' : 'Suspend'}
              </button>

              {u.id !== user?.id && (
                <button
                  onClick={() => {
                    adminDeleteUser(u.id);
                    onFlash(`Removed user ${u.name}`);
                  }}
                  className="p-1.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                  title="Delete user"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
