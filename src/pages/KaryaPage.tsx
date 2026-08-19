import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Eye, ExternalLink } from 'lucide-react';
import { useKarya } from '../hooks/useKarya';
import { Karya } from '../types/database';
import { SEOHead } from '../components/seo/SEOHead';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const KaryaPage: React.FC = () => {
  const { karyaList, isLoading } = useKarya();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxKarya, setLightboxKarya] = useState<Karya | null>(null);

  const categories: string[] = ['Semua', ...Array.from(new Set(karyaList.map((k: Karya) => k.kategori)))];

  const filtered: Karya[] = selectedCategory === 'Semua'
    ? karyaList
    : karyaList.filter((k: Karya) => k.kategori === selectedCategory);

  return (
    <>
      <SEOHead
        title="Galeri Portofolio & Karya Digital Edukasi PAI"
        description="Eksplorasi kumpulan modul ajar interaktif, presentasi Canva/Google Slides, e-book ringkasan fikih, dan infografis dakwah Islamiah."
        type="website"
      />

      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-950 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-600/50 text-teal-200 text-xs font-semibold">
              <Palette className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Karya Kreatif & Media Digital</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
              Galeri Portofolio & Publikasi Edukasi
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Kumpulan karya visual inovatif, publikasi buku digital, infografis syariat beresolusi tinggi, dan modul praktis untuk pengajaran agama Islam.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat: string) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {filtered.length} karya ditampilkan
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item: Karya, idx: number) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                >
                  <Card hoverEffect className="overflow-hidden flex flex-col h-full group bg-white dark:bg-slate-900">
                    <div
                      className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      onClick={() => setLightboxKarya(item)}
                    >
                      <img
                        src={item.gambar_url}
                        alt={`Pratinjau karya ${item.judul}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="p-3 rounded-full bg-white/90 text-slate-900 shadow-lg">
                          <Eye className="w-5 h-5" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="brand" size="sm">
                          {item.kategori}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                          {item.judul}
                        </h3>
                        {item.deskripsi && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>

                      {item.link_eksternal && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <a
                            href={item.link_eksternal}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
                          >
                            <span>Kunjungi Link Terkait</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
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
              {lightboxKarya.link_eksternal && (
                <div className="flex justify-end pt-2">
                  <a
                    href={lightboxKarya.link_eksternal}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
                  >
                    Buka Tautan Eksternal <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};
