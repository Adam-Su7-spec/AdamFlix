import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/pages/HomePage';
import { MoviesPage } from './components/pages/MoviesPage';
import { TVShowsPage } from './components/pages/TVShowsPage';
import { MovieDetailsPage } from './components/pages/MovieDetailsPage';
import { TVShowDetailsPage } from './components/pages/TVShowDetailsPage';
import { WatchPage } from './components/pages/WatchPage';
import { GenresPage } from './components/pages/GenresPage';
import { SearchResultsPage } from './components/pages/SearchResultsPage';
import { AccountPage } from './components/pages/AccountPage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { AccountActivationModal } from './components/auth/AccountActivationModal';

const AppContent: React.FC = () => {
  const { currentRoute, toastMessage } = useApp();

  const renderCurrentPage = () => {
    if (currentRoute === '/') {
      return <HomePage />;
    }
    if (currentRoute === '/movies') {
      return <MoviesPage />;
    }
    if (currentRoute === '/tv-shows') {
      return <TVShowsPage />;
    }
    if (currentRoute.startsWith('/movie/')) {
      return <MovieDetailsPage />;
    }
    if (currentRoute.startsWith('/tv-show/')) {
      return <TVShowDetailsPage />;
    }
    if (currentRoute.startsWith('/watch/')) {
      return <WatchPage />;
    }
    if (currentRoute === '/genres' || currentRoute.startsWith('/genre/')) {
      return <GenresPage />;
    }
    if (currentRoute === '/search') {
      return <SearchResultsPage />;
    }
    if (currentRoute === '/account') {
      return <AccountPage />;
    }
    if (currentRoute === '/admin') {
      return <AdminDashboard />;
    }

    // Default fallback to home
    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-white flex flex-col antialiased selection:bg-[#7C5CFF]/30 selection:text-white">
      {/* Sticky Cinematic Navigation */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Cinematic Dark Footer */}
      <Footer />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Global Dedicated OTP Activation Modal for New Users */}
      <AccountActivationModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 pointer-events-none">
          <div className="bg-[#151B28] text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#7C5CFF]/50 shadow-2xl shadow-[#7C5CFF]/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
