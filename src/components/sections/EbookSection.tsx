import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useEbook } from '../../hooks/useEbook';
import { EBook } from '../../types/database';
import { EbookCard } from '../ebook/EbookCard';
import { EbookReaderModal } from '../ebook/EbookReaderModal';
import { Button } from '../ui/Button';

export const EbookSection: React.FC = () => {
  const { ebookList, isLoading } = useEbook({ featuredOnly: true });
  const [activeEbook, setActiveEbook] = useState<EBook | null>(null);

  // Take top 4 featured
  const featuredEbooks = ebookList.slice(0, 4);

  return (
    <section id="ebook" className="py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-left border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Khazanah Digital & Modul Online</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Pustaka E-Book & Kitab Digital
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Koleksi kitab klasik terjemahan, modul ajar Kurikulum Merdeka PAI Fase D, dan buku keagamaan. Baca langsung di browser dengan e-reader interaktif berbasis format <strong>EPUB, PDF, MOBI, AZW3,</strong> dan cloud <strong>Microsoft OneDrive</strong>.
            </p>
          </div>

          <Link to="/ebook" className="shrink-0">
            <Button variant="outline" size="md" className="group shadow-sm">
              <span>Buka Semua E-Book</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* E-Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : featuredEbooks.length === 0 ? (
          <div className="p-8 text-center bg-slate-100 dark:bg-slate-900 rounded-2xl">
            <p className="text-sm text-slate-500">Belum ada koleksi e-book yang ditandai sebagai unggulan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEbooks.map((ebook, idx) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <EbookCard ebook={ebook} onRead={(item) => setActiveEbook(item)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {activeEbook && (
        <EbookReaderModal
          isOpen={Boolean(activeEbook)}
          onClose={() => setActiveEbook(null)}
          ebook={activeEbook}
        />
      )}
    </section>
  );
};
