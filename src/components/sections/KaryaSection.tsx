import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ExternalLink, Eye, ArrowRight, Sparkles, Play } from 'lucide-react';
import { useKarya } from '../../hooks/useKarya';
import { Karya } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmbedModalViewer } from '../ui/CloudEmbedViewer';

export const KaryaSection: React.FC = () => {
  const { karyaList, isLoading } = useKarya();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxKarya, setLightboxKarya] = useState<Karya | null>(null);
  const [embedKarya, setEmbedKarya] = useState<Karya | null>(null);

  const categories = ['Semua', ...Array.from(new Set(karyaList.map((k) => k.kategori)))];

  const filtered = selectedCategory === 'Semua'
    ? karyaList
    : karyaList.filter((k) => k.kategori === selectedCategory);

  const previewList = filtered.slice(0, 4);

  return (
    <section id="karya" className="py-16 md:py-24 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200/60 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              <Palette className="w-4 h-4" />
              <span>Publikasi & Portofolio Kreatif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Galeri Karya & Inovasi Digital
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Koleksi infografis, e-book metodologi PAI, media Canva/Slides interaktif, modul ajar, dan publikasi digital lainnya.
            </p>
          </div>

          <Link to="/karya">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex shrink-0">
              Lihat Semua Karya ({karyaList.length})
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
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
                  <Card hoverEffect className="overflow-hidden flex flex-col h-full group bg-white dark:bg-slate-900 shadow-sm border">
                    {/* Image Box */}
                    <div
                      className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      onClick={() => {
                        if (item.link_eksternal) {
                          setEmbedKarya(item);
                        } else {
                          setLightboxKarya(item);
                        }
                      }}
                    >
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="p-2.5 rounded-full bg-white/95 text-slate-900 shadow-md flex items-center gap-1.5 text-xs font-bold px-3">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{item.link_eksternal ? 'Pratinjau Interaktif' : 'Perbesar Gambar'}</span>
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
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setEmbedKarya(item)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <span>Buka Embed</span>
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={item.link_eksternal}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Buka Tautan Luar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
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

      {/* Image Lightbox Modal */}
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

      {/* Cloud Embed Interactive Modal */}
      {embedKarya && (
        <EmbedModalViewer
          isOpen={Boolean(embedKarya)}
          onClose={() => setEmbedKarya(null)}
          url={embedKarya.link_eksternal || ''}
          title={embedKarya.judul}
        />
      )}
    </section>
  );
};
