import React, { Suspense, lazy, Component } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { HomeSection } from './components/home/HomeSection';
import { FitArcLogo } from './components/common/FitArcLogo';
import { useRoutePath, isAdminPathname } from './utils/routeHelper';
import { useDocumentSeo } from './utils/useDocumentSeo';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090C] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel-glow p-7 rounded-3xl border border-rose-500/30 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
            <h1 className="text-lg font-black text-white">Something went wrong</h1>
            <p className="text-xs text-slate-400 break-words">{this.state.errorMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="gold-btn px-5 py-2.5 rounded-xl text-xs font-black"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const FitnessSection = lazy(() => import('./components/fitness/FitnessSection').then((m) => ({ default: m.FitnessSection })));
const FoodSection = lazy(() => import('./components/food/FoodSection').then((m) => ({ default: m.FoodSection })));
const OverviewDashboard = lazy(() => import('./components/dashboard/OverviewDashboard').then((m) => ({ default: m.OverviewDashboard })));
const ShopSection = lazy(() => import('./components/shop/ShopSection').then((m) => ({ default: m.ShopSection })));
const AboutSection = lazy(() => import('./components/about/AboutSection'));
const AdminPortalPage = lazy(() => import('./pages/AdminPortalPage'));
const DailyWeightModal = lazy(() => import('./components/weight/DailyWeightModal').then((m) => ({ default: m.DailyWeightModal })));
const AuthModal = lazy(() => import('./components/auth/AuthModal').then((m) => ({ default: m.AuthModal })));
const PlanSelectorModal = lazy(() => import('./components/plans/PlanSelectorModal'));
const AiAndCustomPlanModal = lazy(() => import('./components/fitness/AiAndCustomPlanModal'));
const GuidedWorkoutPlayerModal = lazy(() => import('./components/fitness/GuidedWorkoutPlayerModal'));
const MealPhotoScanner = lazy(() => import('./components/food/MealPhotoScanner').then((m) => ({ default: m.MealPhotoScanner })));

function PageLoader() {
  return (
    <div className="min-h-[45vh] flex items-center justify-center text-xs text-slate-400">
      <div className="flex items-center gap-2.5">
        <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <span>Loading module...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const pathname = useRoutePath();
  const {
    activeTab,
    setActiveTab,
    siteSettings,
    seoSettings,
    isWeightModalOpen,
    setIsWeightModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isPlanModalOpen,
    setIsPlanModalOpen,
    isCustomPlanModalOpen,
    setIsCustomPlanModalOpen,
    activeGuidedSession,
    setActiveGuidedSession,
    isMealScannerOpen,
    setIsMealScannerOpen,
  } = useApp();

  // Dynamic per-page SEO & JSON-LD injector managed from Admin Portal
  useDocumentSeo(isAdminPathname(pathname) ? 'admin' : activeTab, seoSettings, siteSettings);

  // Dedicated isolated Admin Portal on /admin (or #/admin)
  if (isAdminPathname(pathname)) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminPortalPage />
      </Suspense>
    );
  }

  // Maintenance gate controlled by Admin Portal (never exposes admin links on public chrome)
  if (siteSettings?.maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#08090C] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel-glow p-8 rounded-3xl border border-amber-500/25 text-center space-y-5">
          <div className="flex justify-center">
            <FitArcLogo
              brandName={siteSettings?.brandName || 'FitArc'}
              tagline={siteSettings?.tagline}
              logoStyle={siteSettings?.logoStyle}
              customLogoUrl={siteSettings?.customLogoUrl}
              showTagline
              size="lg"
            />
          </div>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white">Scheduled System Calibration</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our performance coaching, nutrition telemetry, and supplement catalog are undergoing scheduled upgrades. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-slate-100">
      {/* Sticky Glassmorphic Dark Gold Header */}
      <Navbar />

      {/* Main Content Area (Extra bottom padding on mobile so content is never covered by bottom dock) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        <Suspense fallback={<PageLoader />}>
          {activeTab === 'home' && <HomeSection />}
          {activeTab === 'fitness' && <FitnessSection />}
          {activeTab === 'food' && <FoodSection />}
          {activeTab === 'shop' && (
            siteSettings?.shopEnabled !== false ? (
              <ShopSection />
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3 my-8">
                <h2 className="text-lg font-bold text-white">Supplement Magazine Temporarily Paused</h2>
                <p className="text-xs text-slate-400">
                  The Trustified™ supplement magazine is currently paused by platform operations.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="gold-btn-outline px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Return to Home
                </button>
              </div>
            )
          )}
          {activeTab === 'dashboard' && <OverviewDashboard />}
          {activeTab === 'about' && <AboutSection />}
        </Suspense>
      </main>

      {/* Native Mobile App Bottom Navigation Bar (Dock) */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />

      <Suspense fallback={null}>
        {/* Daily Weight Logger Modal */}
        {isWeightModalOpen && (
          <DailyWeightModal
            isOpen={isWeightModalOpen}
            onClose={() => setIsWeightModalOpen(false)}
          />
        )}

        {/* User Profile & Auth Modal */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}

        {/* Plan Selector Modal */}
        {isPlanModalOpen && (
          <PlanSelectorModal
            isOpen={isPlanModalOpen}
            onClose={() => setIsPlanModalOpen(false)}
          />
        )}

        {/* Global Custom User Goal Plan Builder & AI Exercise Architect */}
        {isCustomPlanModalOpen && (
          <AiAndCustomPlanModal
            isOpen={isCustomPlanModalOpen}
            onClose={() => setIsCustomPlanModalOpen(false)}
          />
        )}

        {/* Global Guided Voice Coach & Workout Session Runner */}
        {activeGuidedSession && (
          <GuidedWorkoutPlayerModal
            isOpen={!!activeGuidedSession}
            onClose={() => setActiveGuidedSession(null)}
            routineTitle={activeGuidedSession.routineTitle || activeGuidedSession.title}
            planBadge={activeGuidedSession.badge}
            exercises={activeGuidedSession.exercises}
            restDurationSeconds={activeGuidedSession.restDurationSeconds || 15}
            isLowImpact={Boolean(activeGuidedSession.isLowImpact || activeGuidedSession.lowImpact)}
            challengeDayNumber={activeGuidedSession.challengeDayNumber || null}
          />
        )}

        {/* Global AI Meal Photo Scanner Modal */}
        {isMealScannerOpen && (
          <MealPhotoScanner
            onClose={() => setIsMealScannerOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AppErrorBoundary>
  );
}
