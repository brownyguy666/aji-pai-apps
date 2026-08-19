import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  MoveVertical,
  Languages,
  Palette,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Video,
} from 'lucide-react';
import { YoutubeIcon } from '../components/ui/Icons';
import { useMateri } from '../hooks/useMateri';
import { useSections } from '../hooks/useSections';
import { useTerjemahan } from '../hooks/useTerjemahan';
import { useKarya } from '../hooks/useKarya';
import { useYouTube } from '../hooks/useYouTube';
import { useProfile } from '../hooks/useProfile';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AdminDashboardPage: React.FC = () => {
  const { materiList } = useMateri({ status: 'all' });
  const { sections, activeSections } = useSections();
  const { terjemahanList } = useTerjemahan();
  const { karyaList } = useKarya();
  const { videos } = useYouTube();
  const { profile } = useProfile();

  const stats = [
    {
      title: 'Materi PAI',
      count: materiList.length,
      subtitle: `${materiList.filter((m) => m.status === 'published').length} tayang`,
      icon: BookOpen,
      color: 'bg-emerald-500 text-white',
      link: '/admin/materi',
    },
    {
      title: 'Terjemahan Kitab',
      count: terjemahanList.length,
      subtitle: 'Proyek turats',
      icon: Languages,
      color: 'bg-amber-500 text-white',
      link: '/admin/terjemahan',
    },
    {
      title: 'Galeri Karya',
      count: karyaList.length,
      subtitle: 'Infografis & modul',
      icon: Palette,
      color: 'bg-teal-500 text-white',
      link: '/admin/karya',
    },
    {
      title: 'Section Landing Page',
      count: `${activeSections.length} / ${sections.length}`,
      subtitle: 'Aktif di beranda',
      icon: MoveVertical,
      color: 'bg-blue-500 text-white',
      link: '/admin/sections',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Selamat Datang, {profile.nama.split(',')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola konten edukasi, modul ajar, terjemahan kitab, dan tata letak landing page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/materi/new">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              Tulis Materi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <Link key={st.title} to={st.link}>
              <Card hoverEffect className="p-5 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {st.title}
                  </span>
                  <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                    {st.count}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{st.subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl ${st.color} shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section Management Card */}
        <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
              <MoveVertical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Kontrol Modular Landing Page
              </h3>
              <p className="text-xs text-slate-500">
                Atur urutan dan visibilitas section beranda dengan Drag & Drop.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Status Tata Letak:
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">
                {activeSections.length} dari {sections.length} Section Aktif
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sections
                .sort((a, b) => a.urutan - b.urutan)
                .map((sec) => (
                  <span
                    key={sec.id}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      sec.is_active
                        ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 line-through'
                    }`}
                  >
                    {sec.label}
                  </span>
                ))}
            </div>
          </div>

          <Link to="/admin/sections" className="block">
            <Button variant="outline" size="sm" className="w-full justify-center">
              Buka Pengaturan Urutan Section
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>

        {/* Quick Links Matrix */}
        <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Pintasan Manajemen Cepat
              </h3>
              <p className="text-xs text-slate-500">
                Akses instan ke seluruh modul pengelolaan konten.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              to="/admin/kategori"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-brand-500" />
              <span>Kategori Bertingkat</span>
            </Link>

            <Link
              to="/admin/terjemahan"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Languages className="w-4 h-4 text-amber-500" />
              <span>Proyek Terjemahan</span>
            </Link>

            <Link
              to="/admin/karya"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Palette className="w-4 h-4 text-teal-500" />
              <span>Galeri Portofolio</span>
            </Link>

            <Link
              to="/admin/profile"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4 text-indigo-500" />
              <span>Profil & Foto Guru</span>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};
