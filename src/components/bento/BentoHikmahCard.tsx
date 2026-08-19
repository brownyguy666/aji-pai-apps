import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Quote, ArrowRight, Heart } from 'lucide-react';
import { useThemeAccent } from '../../context/ThemeAccentContext';

const HIKMAH_LIST = [
  {
    arab: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ',
    arti: 'Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat.',
    surah: 'QS. Al-Mujadilah: 11',
  },
  {
    arab: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    arti: 'Menuntut ilmu itu wajib bagi setiap muslim.',
    surah: 'HR. Ibnu Majah',
  },
  {
    arab: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    arti: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.',
    surah: 'QS. Al-Alaq: 1',
  },
];

export const BentoHikmahCard: React.FC = () => {
  const { theme } = useThemeAccent();
  const [index, setIndex] = useState(0);

  const current = HIKMAH_LIST[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % HIKMAH_LIST.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="group relative col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl p-5 sm:p-6 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Background Islamic Watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-5 dark:opacity-10 pointer-events-none">
        <Quote className="w-36 h-36 text-slate-900 dark:text-white" />
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ backgroundColor: theme.primary }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Mutiara Hikmah & Khazanah Ilmu
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <span>Ganti Ayat</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Center Calligraphy & Meaning */}
      <div className="my-4 space-y-2 relative z-10">
        <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-right">
          <p className="font-arabic text-base sm:text-lg text-slate-900 dark:text-white font-bold leading-loose">
            {current.arab}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
            "{current.arti}"
          </p>
          <p className="text-[11px] font-bold font-mono" style={{ color: theme.primary }}>
            {current.surah}
          </p>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>Dedikasi Pembelajaran PAI</span>
        </span>
        <span>Fase D SMP Kurikulum Merdeka</span>
      </div>
    </motion.div>
  );
};
