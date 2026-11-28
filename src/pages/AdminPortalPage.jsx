import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  CalendarRange,
  ShoppingBag,
  CreditCard,
  Settings,
  Download,
  RotateCcw,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  KeyRound,
  LayoutTemplate,
  Globe,
  LifeBuoy,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FitArcLogo } from '../components/common/FitArcLogo';
import { navigateTo } from '../utils/routeHelper';
import { useDocumentSeo } from '../utils/useDocumentSeo';
import { AdminOverviewModule } from '../components/admin/modules/AdminOverviewModule';
import { AdminHomepageModule } from '../components/admin/modules/AdminHomepageModule';
import { AdminSeoModule } from '../components/admin/modules/AdminSeoModule';
import { AdminBlogModule } from '../components/admin/modules/AdminBlogModule';
import { AdminUsersModule } from '../components/admin/modules/AdminUsersModule';
import { AdminExercisesModule } from '../components/admin/modules/AdminExercisesModule';
import { AdminFoodsModule } from '../components/admin/modules/AdminFoodsModule';
import { AdminPlansModule } from '../components/admin/modules/AdminPlansModule';
import { AdminShopModule } from '../components/admin/modules/AdminShopModule';
import { AdminPaymentsModule } from '../components/admin/modules/AdminPaymentsModule';
import { AdminSupportModule } from '../components/admin/modules/AdminSupportModule';
import { AdminSettingsModule } from '../components/admin/modules/AdminSettingsModule';

const ADMIN_MODULES = [
  { id: 'overview', label: 'Overview', desc: 'Live KPIs & Feature Switches', icon: LayoutDashboard },
  { id: 'homepage', label: 'Homepage & Logo', desc: 'Hero, Logo, Brand & Sections', icon: LayoutTemplate },
  { id: 'seo', label: 'SEO Manager', desc: 'Per-Page Meta, OG & Schema', icon: Globe },
  { id: 'users', label: 'Users & Vault', desc: 'Profiles, Roles, Plans & Language', icon: Users },
  { id: 'exercises', label: 'Exercises', desc: 'Create, Edit & Override', icon: Dumbbell },
  { id: 'foods', label: 'Foods & Meals', desc: 'Nutrition Catalog CRUD', icon: Utensils },
  { id: 'plans', label: 'Plans (₹99+)', desc: 'Monthly & Yearly Plan Pricing', icon: CalendarRange },
  { id: 'shop', label: 'Shop Page', desc: 'Products, Crawler & Amazon/FK', icon: ShoppingBag },
  { id: 'blog', label: 'Blog Posts', desc: '210+ Health Articles & Tips', icon: BookOpen },
  { id: 'payments', label: 'Payments', desc: 'Gateways & Ledger CRUD', icon: CreditCard },
  { id: 'support', label: 'Support Inbox', desc: 'Vault Tickets & Contact Setup', icon: LifeBuoy },
  { id: 'settings', label: 'Site & Security', desc: 'Language, Locks, Socials & Passcode', icon: Settings },
];

export function AdminPortalPage() {
  const {
    adminSession,
    adminLogin,
    adminLogout,
    siteSettings,
    seoSettings,
    profilesVault,
    managedPlans,
    shopProducts,
    paymentTransactions,
    supportTickets,
    customExercises,
    disabledExerciseIds,
    customFoods,
    disabledFoodIds,
    adminResetPlatform,
  } = useApp();

  useDocumentSeo('admin', seoSettings, siteSettings);

  // Login gate state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Authenticated portal state
  const [activeModule, setActiveModule] = useState('overview');
  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const toastTimerRef = useRef(null);

  const flash = useCallback((message, tone = 'success') => {
    setToast({ message, tone });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const result = adminLogin(email.trim(), password);
    if (!result?.ok) {
      setLoginError(result?.error || 'Invalid administrator email or passcode.');
      return;
    }
    setPassword('');
    flash(`Signed in as ${result.session?.name || 'Administrator'}`, 'success');
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@fitarc.elite');
    setPassword(siteSettings?.adminPasscode || 'FitArc@2026');
    setLoginError('');
  };

  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      brandName: siteSettings?.brandName || 'FitArc',
      siteSettings,
      seoSettings,
      profilesVault,
      managedPlans,
      shopProducts,
      paymentTransactions,
      customExercises,
      disabledExerciseIds,
      customFoods,
      disabledFoodIds,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitarc-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    flash('Exported full platform configuration & catalog JSON backup.', 'success');
  };

  const handleResetPlatform = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    adminResetPlatform();
    setConfirmReset(false);
    flash('Platform state reset to factory defaults.', 'info');
  };

  // Unauthenticated /admin login view
  if (!adminSession) {
    return (
      <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between px-4 py-8 relative overflow-hidden">
        {/* Ambient radial accents */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-10 w-[420px] h-[280px] rounded-full bg-amber-500/5 blur-[100px]" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] border border-white/10 hover:text-amber-300 hover:border-amber-500/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Site
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            Isolated Admin Route (/admin)
          </span>
        </div>

        {/* Login Card */}
        <div className="relative z-10 max-w-md w-full mx-auto my-8">
          <div className="glass-panel-glow p-7 sm:p-8 rounded-2xl border border-amber-500/20 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <FitArcLogo
                brandName={siteSettings?.brandName || 'FitArc'}
                tagline="Admin Operations & CRUD Studio"
                logoStyle={siteSettings?.logoStyle || 'kinetic_arc'}
                customLogoUrl={siteSettings?.customLogoUrl || ''}
                showTagline
                size="lg"
              />
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Restricted Platform Management Portal
              </div>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Sign in with an administrator account to manage exercises, meals, transformation plans, shop inventory, payments, users, and site settings.
              </p>
            </div>

            {loginError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fitarc.elite"
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin passcode"
                    className="glass-input w-full pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="gold-btn w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                Unlock Admin Studio
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-[11px] text-slate-400">
                Operator accounts: <span className="text-slate-200 font-semibold">admin@fitarc.elite</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fill Demo Admin
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center text-[11px] text-slate-500">
          FitArc Isolated Operations Console • Frontend modules synchronize live across tabs
        </div>
      </div>
    );
  }

  // Authenticated Modular Admin Portal
  const activeMeta = ADMIN_MODULES.find((m) => m.id === activeModule) || ADMIN_MODULES[0];

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col">
      {/* Sticky Top Control Bar */}
      <header className="sticky top-0 z-40 border-b border-amber-500/15 bg-[#0A0C10]/95 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FitArcLogo
              brandName={siteSettings?.brandName || 'FitArc'}
              tagline="Admin Operations Console"
              logoStyle={siteSettings?.logoStyle || 'kinetic_arc'}
              customLogoUrl={siteSettings?.customLogoUrl || ''}
              showTagline
              size="sm"
            />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {adminSession.name} ({adminSession.email})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-200 hover:border-amber-500/35 hover:text-amber-300 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Site
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-200 hover:border-amber-500/35 hover:text-amber-300 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export Backup
            </button>

            <button
              type="button"
              onClick={handleResetPlatform}
              onBlur={() => setConfirmReset(false)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${confirmReset
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-rose-500/35 hover:text-rose-300'
                }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {confirmReset ? 'Click Again to Confirm Reset' : 'Reset Platform'}
            </button>

            <button
              type="button"
              onClick={() => adminLogout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Shell */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Module Navigation Rail */}
        <aside className="lg:w-64 shrink-0">
          <div className="glass-panel p-2.5 rounded-2xl border border-white/10 lg:sticky lg:top-20">
            <div className="px-2.5 py-2 mb-1 hidden lg:flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/90">
                CRUD Modules
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {ADMIN_MODULES.length} active
              </span>
            </div>

            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
              {ADMIN_MODULES.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModule === mod.id;
                const openSupportCount = (supportTickets || []).filter((tk) => tk.status !== 'Resolved').length;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveModule(mod.id)}
                    className={`shrink-0 lg:w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-all border ${isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight whitespace-nowrap">{mod.label}</div>
                        <div className="hidden lg:block text-[10px] text-slate-500 truncate mt-0.5">
                          {mod.desc}
                        </div>
                      </div>
                    </div>
                    {mod.id === 'support' && openSupportCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] shrink-0">
                        {openSupportCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Live Inventory Telemetry */}
            <div className="hidden lg:block mt-4 pt-3 border-t border-white/10 px-2.5 space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Vault Profiles</span>
                <span className="font-bold text-slate-200">{Object.keys(profilesVault || {}).length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Support Open / Total</span>
                <span className="font-bold text-rose-300">
                  {(supportTickets || []).filter((tk) => tk.status !== 'Resolved').length} / {(supportTickets || []).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Plans / Shop SKUs</span>
                <span className="font-bold text-slate-200">
                  {managedPlans?.length || 0} / {shopProducts?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Custom Ex / Food</span>
                <span className="font-bold text-slate-200">
                  {customExercises?.length || 0} / {customFoods?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Transactions</span>
                <span className="font-bold text-amber-400">{paymentTransactions?.length || 0}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Active Module Workspace */}
        <section className="flex-1 min-w-0 space-y-4">
          {/* Active module header + feedback toast */}
          <div className="glass-panel px-5 py-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                <activeMeta.icon className="w-3.5 h-3.5" />
                <span>Admin Module • {activeMeta.label}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white mt-0.5">{activeMeta.desc}</h1>
            </div>

            {toast && (
              <div
                role="status"
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${toast.tone === 'error'
                  ? 'bg-rose-500/15 border-rose-500/35 text-rose-200'
                  : toast.tone === 'info'
                    ? 'bg-sky-500/15 border-sky-500/35 text-sky-200'
                    : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200'
                  }`}
              >
                {toast.tone === 'error' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
            )}
          </div>

          {/* Render Active CRUD Module */}
          <div className="min-w-0">
            {activeModule === 'overview' && (
              <AdminOverviewModule onFlash={flash} onNavigateModule={setActiveModule} />
            )}
            {activeModule === 'homepage' && <AdminHomepageModule onFlash={flash} />}
            {activeModule === 'seo' && <AdminSeoModule onFlash={flash} />}
            {activeModule === 'users' && <AdminUsersModule onFlash={flash} />}
            {activeModule === 'exercises' && <AdminExercisesModule onFlash={flash} />}
            {activeModule === 'foods' && <AdminFoodsModule onFlash={flash} />}
            {activeModule === 'plans' && <AdminPlansModule onFlash={flash} />}
            {activeModule === 'shop' && <AdminShopModule onFlash={flash} />}
            {activeModule === 'blog' && <AdminBlogModule onFlash={flash} />}
            {activeModule === 'payments' && <AdminPaymentsModule onFlash={flash} />}
            {activeModule === 'support' && <AdminSupportModule onFlash={flash} />}
            {activeModule === 'settings' && <AdminSettingsModule onFlash={flash} />}
          </div>
        </section>
      </div>
    </div>
  );
}
export default AdminPortalPage;
