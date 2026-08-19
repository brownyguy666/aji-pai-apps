import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MoveVertical,
  BookOpen,
  FolderTree,
  Languages,
  Palette,
  Video,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/ui/Button';

export const AdminLayout: React.FC = () => {
  const { user, isLoading, signOut, isDemoMode } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication check
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Memeriksa otentikasi...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Urutan Landing Page', href: '/admin/sections', icon: MoveVertical },
    { label: 'Materi PAI & Modul', href: '/admin/materi', icon: BookOpen },
    { label: 'Kategori Bertingkat', href: '/admin/kategori', icon: FolderTree },
    { label: 'Proyek Terjemahan', href: '/admin/terjemahan', icon: Languages },
    { label: 'Galeri Portofolio', href: '/admin/karya', icon: Palette },
    { label: 'Video YouTube', href: '/admin/youtube', icon: Video },
    { label: 'Profil & Bio Guru', href: '/admin/profile', icon: User },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                Admin Panel PAI
              </span>
              <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                Sistem Pengelola
              </span>
            </div>
          </Link>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="mx-4 mt-3 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Mode Demo (Lokal)</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <img
              src={profile.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={profile.nama}
              className="w-8 h-8 rounded-full object-cover border border-slate-300"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {profile.nama.split(',')[0]}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link to="/" target="_blank" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs justify-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                Lihat Web
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-2"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm">Admin PAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/" target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {sidebarOpen && (
          <div className="lg:hidden p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    active ? 'bg-brand-600 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="danger" size="sm" onClick={handleSignOut} className="w-full justify-center">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        )}

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
