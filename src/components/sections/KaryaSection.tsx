import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ExternalLink, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { useKarya } from '../../hooks/useKarya';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const KaryaSection: React.FC = () => {
  const { karyaList, isLoading } = useKarya();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxKarya, setLightboxKarya] = useState<{
    gambar_url: string;
    judul: string;
    deskripsi?: string | null;
  } | null>(null);

  const categories = ['Semua', ...Array.from(new Set(karyaList.map((k) => k.kategori)))];

  const filtered = selectedCategory === 'Semua'
    ? karyaList
    : karyaList.filter((k) => k.kategori === selectedCategory);

  const previewList = filtered.slice(0, 4);

  return (
    <section id="karya" className="py-16 md:py-20 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200/60 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              <Palette className="w-4 h-4" />
              <span>Publikasi & Portofolio Kreatif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Galeri Karya & Inovasi Pembelajaran
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Koleksi infografis islami, e-book metodologi PAI abad 21, modul ajar kurikulum merdeka, dan media ajar kreatif digital.
            </p>
          </div>

          <Link to="/karya">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex shrink-0">
              Lihat Semua Karya
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {previewList.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                >
                  <Card hoverEffect className="overflow-hidden flex flex-col h-full group bg-white dark:bg-slate-900">
                    {/* Image Box */}
                    <div
                      className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      onClick={() => setLightboxKarya(item)}
                    >
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="brand" size="sm">
                          {item.kategori}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                          {item.judul}
                        </h4>
                        {item.deskripsi && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>

                      {item.link_eksternal && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <a
                            href={item.link_eksternal}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <span>Lihat Karya</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(lightboxKarya)}
        onClose={() => setLightboxKarya(null)}
        title={lightboxKarya?.judul}
        description={lightboxKarya?.deskripsi || undefined}
        size="lg"
      >
        {lightboxKarya && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-slate-950">
              <img
                src={lightboxKarya.gambar_url}
                alt={lightboxKarya.judul}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
