import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Zap, ArrowRight } from 'lucide-react';
import { useEbook } from '../../hooks/useEbook';
import { EbookReaderModal } from '../ebook/EbookReaderModal';
import { EBook } from '../../types/database';
import { useThemeAccent } from '../../context/ThemeAccentContext';

export const BentoEbookCard: React.FC = () => {
  const { ebookList } = useEbook();
  const { theme } = useThemeAccent();
  const [readingEbook, setReadingEbook] = useState<EBook | null>(null);

  const featuredBook = ebookList.find((b) => b.is_featured) || ebookList[0];

  if (!featuredBook) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="group relative col-span-1 md:col-span-2 lg:col-span-2 rounded-3xl p-5 sm:p-6 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors"
          style={{ backgroundColor: theme.primary }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-xl text-white shadow-xs"
              style={{ backgroundColor: theme.primary }}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Pustaka E-Book & Kitab
            </span>
          </div>

          <Link
            to="/ebook"
            className="text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Center Content: Book Thumbnail + Title Info */}
        <div className="my-4 flex gap-4 items-center relative z-10">
          <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border relative shadow-md group-hover:scale-105 transition-transform">
            <img
              src={featuredBook.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
              alt={featuredBook.judul}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-slate-900/80 text-white backdrop-blur-sm">
              {featuredBook.format_file}
            </span>
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {featuredBook.kategori}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display line-clamp-2 leading-tight">
              {featuredBook.judul}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {featuredBook.penulis_pengarang}
            </p>
            {featuredBook.deskripsi && (
              <p className="text-[11px] text-slate-400 line-clamp-2 hidden sm:block">
                {featuredBook.deskripsi}
              </p>
            )}
          </div>
        </div>

        {/* Bottom 1-Click Reader Action */}
        <div className="flex items-center gap-2 relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setReadingEbook(featuredBook)}
            className="flex-1 py-2 px-3.5 rounded-xl text-center text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
            style={{ backgroundColor: theme.primary }}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Baca Online (1-Klik Reader)</span>
          </button>
        </div>
      </motion.div>

      {/* Embedded Reading Modal */}
      {readingEbook && (
        <EbookReaderModal
          isOpen={Boolean(readingEbook)}
          onClose={() => setReadingEbook(null)}
          ebook={readingEbook}
        />
      )}
    </>
  );
};
