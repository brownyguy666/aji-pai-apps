import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BookOpen, Layers, Sparkles } from 'lucide-react';
import { useStatistik } from '../../hooks/useStatistik';
import { useThemeAccent } from '../../context/ThemeAccentContext';

export const BentoStatistikCard: React.FC = () => {
  const { data: statistik, isLoading } = useStatistik();
  const { theme } = useThemeAccent();

  const totalMateri = statistik?.totalMateri || 15;
  const totalEbook = statistik?.totalEbook || 4;
  const totalTerjemahan = statistik?.totalTerjemahan || 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="group relative col-span-1 rounded-3xl p-5 sm:p-6 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ backgroundColor: theme.primary }}
          >
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Aktivitas Live
          </span>
        </div>

        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Center 2x2 Mini Matrix */}
      <div className="my-3 grid grid-cols-2 gap-2.5 relative z-10">
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-extrabold font-display" style={{ color: theme.primary }}>
            {totalMateri}+
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Modul PAI</p>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            {totalEbook}+
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">E-Book Digital</p>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            {totalTerjemahan}+
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Kitab Turats</p>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-extrabold font-display text-amber-500">
            100%
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Akses Gratis</p>
        </div>
      </div>

      {/* Bottom Sparkline Wave */}
      <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Ekosistem PAI Terpadu</span>
        <span className="font-mono text-emerald-500 font-bold">Aktif 2026</span>
      </div>
    </motion.div>
  );
};
