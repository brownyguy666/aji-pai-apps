import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Languages, ArrowRight } from 'lucide-react';
import { useTerjemahan } from '../../hooks/useTerjemahan';
import { useThemeAccent } from '../../context/ThemeAccentContext';

export const BentoTerjemahanCard: React.FC = () => {
  const { terjemahanList } = useTerjemahan();
  const { theme } = useThemeAccent();

  const activeProject = terjemahanList[0];

  if (!activeProject) return null;

  const progress = activeProject.progress_persen || 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="group relative col-span-1 md:col-span-2 lg:col-span-1 row-span-2 rounded-3xl p-5 sm:p-6 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ backgroundColor: theme.primary }}
          >
            <Languages className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Proyek Terjemahan
          </span>
        </div>

        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {activeProject.status || 'Proses'}
        </span>
      </div>

      {/* Center Body */}
      <div className="my-5 space-y-3 relative z-10">
        <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-right">
          <p className="font-arabic text-lg sm:text-xl text-slate-800 dark:text-slate-100 font-bold leading-loose">
            متن الغاية والتقريب في الفقه الشافعي
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display line-clamp-1">
            {activeProject.judul}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Karya: {activeProject.penulis_asli || 'Al-Qadhi Abu Syuja'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Progress Tahqiq & Terjemah</span>
            <span style={{ color: theme.primary }}>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: theme.primary }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Link
          to="/terjemahan"
          className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Baca Naskah Dwibahasa</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
};
