
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TickerTape from './components/TickerTape';
import Hero from './components/Hero';
import MarketChart from './components/MarketChart';
import Features from './components/Features';
import TraderList from './components/TraderList';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import SignupModal from './components/SignupModal';
import Dashboard from './components/Dashboard';
import { authService, UserProfile } from './services/authService';

const App: React.FC = () => {
  const [showAI, setShowAI] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setView('dashboard');
    }

    // Capture the PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('landing');
  };

  const handleLoginSuccess = (u: UserProfile) => {
    setUser(u);
    setView('dashboard');
    setShowSignup(false);
  };

  const navigateToDashboard = () => {
    if (user) {
      setView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowSignup(true);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS or already installed
      return true; // Signal to show the manual guide modal
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-pink-500/30 overflow-x-hidden bg-[#131722]">
      <TickerTape />
      <Navbar 
        onJoinClick={() => setShowSignup(true)} 
        user={user}
        onLogout={handleLogout}
        onDashboardClick={navigateToDashboard}
        onHomeClick={() => user ? setView('dashboard') : setView('landing')}
      />
      
      <main className="flex-grow">
        {view === 'landing' ? (
          <>
            <Hero onJoinClick={() => setShowSignup(true)} onInstallRequest={handleInstallClick} />
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10 mb-8 md:mb-12">
              <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden h-[450px] md:h-[600px] border-t-[#00b36b] border-t-2">
                <MarketChart />
              </div>
            </div>
            <TraderList onCopyClick={navigateToDashboard} />
            <Features />
          </>
        ) : (
          <Dashboard user={user} />
        )}
      </main>

      <Footer />

      <button 
        onClick={() => setShowAI(!showAI)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-[#f01a64] hover:bg-pink-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
      
      {showSignup && (
        <SignupModal 
          onClose={() => setShowSignup(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default App;
