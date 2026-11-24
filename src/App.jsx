import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FitnessSection } from './components/fitness/FitnessSection';
import { FoodSection } from './components/food/FoodSection';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DailyWeightModal } from './components/weight/DailyWeightModal';
import { AuthModal } from './components/auth/AuthModal';

function AppContent() {
  const { activeTab, isWeightModalOpen, setIsWeightModalOpen, isAuthModalOpen, setIsAuthModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-slate-100">
      {/* Sticky Glassmorphic Dark Gold Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'fitness' && <FitnessSection />}
        {activeTab === 'food' && <FoodSection />}
        {activeTab === 'dashboard' && <OverviewDashboard />}
      </main>

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
