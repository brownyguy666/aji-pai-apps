import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { useMateri } from '../../hooks/useMateri';
import { useCategories } from '../../hooks/useCategories';
import { MateriCard } from '../materi/MateriCard';
import { Button } from '../ui/Button';

export const MateriSection: React.FC = () => {
  const { materiList, isLoading } = useMateri({ status: 'published' });
  const { categories } = useCategories();

  const topLevelCategories = categories.filter((c) => !c.parent_id);
  const featuredMateri = materiList.slice(0, 3);

  return (
    <section id="materi" className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Modul Pembelajaran Terstruktur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Materi & Artikel PAI Pilihan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Kajian komprehensif mulai dari Fiqih, Aqidah Akhlak, Tafsir Al-Qur'an & Hadits, hingga Sejarah Kebudayaan Islam dilengkapi modul ajar PDF & PPT.
            </p>
          </div>

          <Link to="/materi">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex shrink-0">
              Lihat Semua Materi
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Quick Category Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-400 mr-1">Fase Pembelajaran:</span>
          {topLevelCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/materi?category=${cat.id}`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors shadow-sm"
            >
              {cat.nama}
            </Link>
          ))}
        </div>

        {/* Grid Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMateri.map((materi, index) => (
              <motion.div
                key={materi.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <MateriCard materi={materi} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/materi">
            <Button variant="outline" size="md" className="w-full">
              Lihat Semua Materi ({materiList.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
