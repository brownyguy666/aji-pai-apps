import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, Sun, Moon, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Materi PAI', href: '/materi' },
    { label: 'Terjemahan Kitab', href: '/terjemahan' },
    { label: 'Galeri Karya', href: '/karya' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-md shadow-slate-900/5 dark:shadow-slate-950/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              {profile.nama.split(',')[0]}
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </span>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
              Edukasi PAI & Turats
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive(link.href)
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Admin Dashboard / Login Button */}
          {user ? (
            <Link to="/admin">
              <Button size="sm" variant="primary" className="hidden sm:inline-flex">
                <Shield className="w-4 h-4 mr-1.5" />
                Panel Admin
              </Button>
            </Link>
          ) : (
            <Link to="/admin/login">
              <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                <User className="w-4 h-4 mr-1.5" />
                Masuk
              </Button>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 mt-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Panel Admin
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  <User className="w-4 h-4 mr-2" />
                  Login Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
