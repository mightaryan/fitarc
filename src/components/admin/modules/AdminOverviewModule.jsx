import React from 'react';
import {
  CreditCard,
  Activity,
  Users,
  Dumbbell,
  Utensils,
  ShoppingBag,
  CalendarRange,
  LifeBuoy,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { YOGA_AND_HOME_WORKOUTS } from '../../../data/yogaAndHomeWorkouts';
import { HOME_WORKOUTS_EXPANDED } from '../../../data/homeWorkoutsExpanded';
import { CALISTHENICS_EXERCISES } from '../../../data/calisthenicsExercises';
import { MASTER_EXERCISE_CATALOG } from '../../../data/allExercisesMaster';
import { MASSIVE_FOOD_CATALOG } from '../../../data/massiveFoodDatabase';

export function AdminOverviewModule({ onFlash, onNavigateModule }) {
  const {
    profilesVault,
    siteSettings,
    customExercises,
    disabledExerciseIds,
    customFoods,
    disabledFoodIds,
    managedPlans,
    shopProducts,
    paymentTransactions,
    supportTickets,
    adminUpdateSiteSettings,
  } = useApp();

  const usersList = Object.values(profilesVault || {}).map((v) => v.profile).filter(Boolean);
  const completedPayments = (paymentTransactions || []).filter((t) => t.status === 'Completed');
  const pendingPayments = (paymentTransactions || []).filter((t) => t.status === 'Pending');
  const completedRev = completedPayments.reduce((s, t) => s + (Number(t.amountINR) || 0), 0);
  const pendingRev = pendingPayments.reduce((s, t) => s + (Number(t.amountINR) || 0), 0);

  const totalBaseExercises =
    YOGA_AND_HOME_WORKOUTS.length +
    HOME_WORKOUTS_EXPANDED.length +
    CALISTHENICS_EXERCISES.length +
    MASTER_EXERCISE_CATALOG.length;

  const featureSwitches = [
    { key: 'shopEnabled', label: 'Magazine Supplement & Protein Shop Tab' },
    { key: 'leaderboardEnabled', label: 'Top 10 Public Leaderboard Widgets' },
    { key: 'troubleZoneEnabled', label: 'Home 30-Day Trouble Zone Challenges' },
    { key: 'homeFeaturedEnabled', label: 'Home Curated Featured Workouts Grid' },
    { key: 'announcementEnabled', label: 'Top Global Announcement Banner Bar' },
    { key: 'maintenanceMode', label: 'Public Website Maintenance Lock Screen' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateModule('payments')}
          className="p-5 rounded-3xl bg-obsidian-900 border border-amber-500/25 hover:border-amber-400 cursor-pointer transition space-y-1"
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">
            Settled Plan Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{completedRev.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block">
            {completedPayments.length} settled · ₹{pendingRev.toLocaleString('en-IN')} pending
          </span>
        </div>

        <div
          onClick={() => onNavigateModule('users')}
          className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 hover:border-sky-400/50 cursor-pointer transition space-y-1"
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-sky-400 block">
            Athlete Vault Users
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">{usersList.length}</div>
          <span className="text-[11px] text-slate-400 block">
            {usersList.filter((u) => u.memberTier === 'Gold Elite Pro').length} Gold Elite ·{' '}
            {usersList.filter((u) => u.role === 'admin').length} Admin
          </span>
        </div>

        <div
          onClick={() => onNavigateModule('shop')}
          className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 hover:border-emerald-400/50 cursor-pointer transition space-y-1"
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">
            Plans &amp; Shop Inventory
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(managedPlans || []).filter((p) => p.active !== false).length} / {(shopProducts || []).length}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {(shopProducts || []).filter((s) => s.inStock !== false).length} live magazine products
          </span>
        </div>

        <div
          onClick={() => onNavigateModule('exercises')}
          className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 hover:border-purple-400/50 cursor-pointer transition space-y-1"
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400 block">
            Fitness &amp; Food Databases
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(totalBaseExercises + (customExercises?.length || 0)).toLocaleString()} /{' '}
            {(MASSIVE_FOOD_CATALOG.length + (customFoods?.length || 0)).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {disabledExerciseIds?.length || 0} hidden ex · {disabledFoodIds?.length || 0} hidden foods
          </span>
        </div>
      </div>

      {/* User Support Requests Queue Quick Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-obsidian-900 to-obsidian-900 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              User Support Requests Queue
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-[10px] font-bold">
              {(supportTickets || []).filter((tk) => tk.status !== 'Resolved').length} Open
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Review athlete questions submitted inside Vault Help &amp; Support, send replies, or update resolution status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateModule('support')}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Manage Support Requests ({(supportTickets || []).length})</span>
        </button>
      </div>

      {/* Live Frontend Switches & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Frontend Feature Controls
          </h3>
          <div className="space-y-2.5 text-xs">
            {featureSwitches.map((toggle) => {
              const val =
                toggle.key === 'maintenanceMode'
                  ? Boolean(siteSettings?.[toggle.key])
                  : siteSettings?.[toggle.key] !== false;
              return (
                <div
                  key={toggle.key}
                  className="p-3 rounded-2xl bg-black/45 border border-white/5 flex items-center justify-between gap-2"
                >
                  <span className="font-semibold text-slate-200">{toggle.label}</span>
                  <button
                    onClick={() => {
                      adminUpdateSiteSettings({ [toggle.key]: !val });
                      onFlash(`${toggle.label} -> ${!val ? 'ON' : 'OFF'}`);
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-black transition shrink-0 ${
                      toggle.key === 'maintenanceMode'
                        ? val
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                        : val
                        ? 'bg-emerald-500 text-black'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {val ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              Recent Transactions Ledger
            </h3>
            <button
              onClick={() => onNavigateModule('payments')}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Manage All →
            </button>
          </div>
          <div className="space-y-2">
            {(paymentTransactions || []).slice(0, 5).map((trx) => (
              <div
                key={trx.id}
                className="p-3 rounded-2xl bg-black/45 border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{trx.userName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{trx.itemName}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-amber-300">
                    ₹{Number(trx.amountINR).toLocaleString('en-IN')}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      trx.status === 'Completed'
                        ? 'text-emerald-400'
                        : trx.status === 'Pending'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {trx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Module Links */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2 border-t border-white/10">
            {[
              { id: 'users', label: 'Users', icon: Users },
              { id: 'exercises', label: 'Exercises', icon: Dumbbell },
              { id: 'foods', label: 'Foods', icon: Utensils },
              { id: 'plans', label: 'Plans', icon: CalendarRange },
              { id: 'shop', label: 'Shop', icon: ShoppingBag },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => onNavigateModule(m.id)}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/10 hover:border-amber-400/50 text-[11px] font-bold text-slate-200 flex flex-col items-center gap-1 transition"
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
