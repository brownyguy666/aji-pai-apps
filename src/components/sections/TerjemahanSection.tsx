import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Languages, ArrowRight, BookOpen, Download, ExternalLink, Calendar } from 'lucide-react';
import { useTerjemahan } from '../../hooks/useTerjemahan';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const TerjemahanSection: React.FC = () => {
  const { terjemahanList, isLoading } = useTerjemahan();
  const previewList = terjemahanList.slice(0, 4);

  return (
    <section id="terjemahan" className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Languages className="w-4 h-4" />
              <span>Khazanah Turats & Penerjemahan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Daftar Proyek Terjemahan Kitab
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Dokumentasi proyek alih bahasa karya ulama klasik (kitab kuning) ke dalam Bahasa Indonesia dengan anotasi bahasa kontemporer yang mudah dipahami.
            </p>
          </div>

          <Link to="/terjemahan">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex shrink-0">
              Lihat Semua Terjemahan
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* List of Translations */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewList.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
              >
                <Card hoverEffect className="p-6 h-full flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900">
                  <div className="space-y-3">
                    {/* Language & Year Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                        <span>{item.bahasa_asal}</span>
                        <span>➔</span>
                        <span>{item.bahasa_tujuan}</span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {item.tahun}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {item.judul}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                      Turats & Terjemah
                    </span>
                    {item.link_file ? (
                      <a
                        href={item.link_file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Akses File / Buku
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Arsip Fisik</span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
