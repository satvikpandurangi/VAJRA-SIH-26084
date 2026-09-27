import React, { useState, useEffect } from 'react';
import { RegionId } from './data/types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DetailedReportModal } from './components/DetailedReportModal';
import { LandingPage } from './pages/LandingPage';
import { ConsolePage } from './pages/ConsolePage';
import { MethodPage } from './pages/MethodPage';

export function App() {
  // Navigation state: 'landing' | 'console' | 'method'
  const [currentView, setCurrentView] = useState<'landing' | 'console' | 'method'>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'console') return 'console';
    if (hash === 'method') return 'method';
    return 'landing';
  });

  const [selectedRegion, setSelectedRegion] = useState<RegionId>('kolkata');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync hash in URL with view
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'console') setCurrentView('console');
      else if (hash === 'method') setCurrentView('method');
      else setCurrentView('landing');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (view: 'landing' | 'console' | 'method') => {
    setCurrentView(view);
    window.location.hash = `#/${view === 'landing' ? '' : view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`flex flex-col bg-background text-slate-100 font-sans selection:bg-accent-orange/30 ${
      currentView === 'console' ? 'h-screen overflow-hidden' : 'min-h-screen'
    }`}>
      
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className={`flex-1 flex flex-col ${currentView === 'console' ? 'min-h-0 overflow-hidden' : ''}`}>
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'console' && (
          <ConsolePage
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        )}

        {currentView === 'method' && (
          <MethodPage
            onNavigate={handleNavigate}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer (shown on landing and method views; console has full-height viewport) */}
      {currentView !== 'console' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenReport={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Technical Architecture Whitepaper Modal */}
      <DetailedReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
}

export default App;
