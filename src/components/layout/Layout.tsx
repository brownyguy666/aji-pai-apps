import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-islamic-pattern">
      {/* Skip-Link for Keyboard and Screen Reader Accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-brand-400 font-bold text-xs sm:text-sm transition-all"
      >
        Lewati ke konten utama (Skip to main content)
      </a>

      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-20 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
