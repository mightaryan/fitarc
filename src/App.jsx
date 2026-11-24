import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { FitnessSection } from './components/fitness/FitnessSection';
import { FoodSection } from './components/food/FoodSection';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DailyWeightModal } from './components/weight/DailyWeightModal';
import { AuthModal } from './components/auth/AuthModal';
import { PlanSelectorModal } from './components/plans/PlanSelectorModal';

function AppContent() {
  const {
    activeTab,
    isWeightModalOpen,
    setIsWeightModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isPlanModalOpen,
    setIsPlanModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-slate-100">
      {/* Sticky Glassmorphic Dark Gold Header */}
      <Navbar />

      {/* Main Content Area (Extra bottom padding on mobile so content is never covered by bottom dock) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        {activeTab === 'fitness' && <FitnessSection />}
        {activeTab === 'food' && <FoodSection />}
        {activeTab === 'dashboard' && <OverviewDashboard />}
      </main>

      {/* Native Mobile App Bottom Navigation Bar (Dock) */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />

      {/* Daily Weight Logger Modal (Auto-pops or user triggered, includes snooze) */}
      <DailyWeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
      />

      {/* User Profile & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 30/60/90 Day Transformation Plan Selector Modal */}
      <PlanSelectorModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
