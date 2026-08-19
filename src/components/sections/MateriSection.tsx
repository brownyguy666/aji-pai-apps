import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  Scroll,
  Shield,
  Heart,
  Scale,
  History,
} from 'lucide-react';
import { useMateri } from '../../hooks/useMateri';
import { useCategories } from '../../hooks/useCategories';
import { MateriCard } from '../materi/MateriCard';
import { Button } from '../ui/Button';

export const MateriSection: React.FC = () => {
  const { materiList, isLoading } = useMateri({ status: 'published' });
  const { categories } = useCategories();
  const topLevelCategories = categories.filter((c) => !c.parent_id);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Filter materi by selected class if any
  const filteredMateri = selectedClassId
    ? materiList.filter((m) => {
        const cat = categories.find((c) => c.id === m.kategori_id);
        return cat?.parent_id === selectedClassId || m.kategori_id === selectedClassId;
      })
    : materiList;

  const displayMateri = filteredMateri.slice(0, 3);

  const elemenIcons = [
    { label: "Al-Qur'an & Hadis", icon: Scroll, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'Akidah', icon: Shield, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
    { label: 'Akhlak', icon: Heart, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { label: 'Fikih', icon: Scale, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { label: 'Sejarah Islam (SKI)', icon: History, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' },
  ];

  return (
    <section id="materi" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Kurikulum Merdeka • Fase D (SMP)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Modul & Bahan Ajar PAI
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Materi pembelajaran terstruktur untuk <strong>Kelas 7, 8, dan 9</strong> yang mencakup 5 elemen keilmuan: Al-Qur'an Hadis, Akidah, Akhlak, Fikih, dan Sejarah Kebudayaan Islam (SKI).
            </p>
          </div>

          <Link to="/materi">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex shrink-0">
              Buka Semua Modul & LKPD
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* 5 Elemen Mini Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {elemenIcons.map((elem, idx) => {
            const Icon = elem.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
              >
                <div className={`p-2 rounded-xl shrink-0 ${elem.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {elem.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tingkat Kelas Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedClassId(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedClassId === null
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            Semua Tingkat ({materiList.length})
          </button>

          {topLevelCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedClassId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedClassId === cat.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat.nama}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : displayMateri.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            Belum ada materi untuk tingkatan kelas ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayMateri.map((materi, index) => (
                <motion.div
                  key={materi.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MateriCard materi={materi} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="text-center sm:hidden">
          <Link to="/materi">
            <Button variant="outline" size="md" className="w-full">
              Lihat Semua Modul & LKPD ({materiList.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
