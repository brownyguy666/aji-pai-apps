import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  Layers,
  FileText,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { useEbook } from '../hooks/useEbook';
import { EBook, EBookFormat } from '../types/database';
import { EbookCard } from '../components/ebook/EbookCard';
import { EbookReaderModal } from '../components/ebook/EbookReaderModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const EbookListPage: React.FC = () => {
  const { ebookList, isLoading } = useEbook();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<EBookFormat | 'all'>('all');
  const [activeReadingEbook, setActiveReadingEbook] = useState<EBook | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    ebookList.forEach((b) => {
      if (b.kategori) set.add(b.kategori);
    });
    return Array.from(set);
  }, [ebookList]);

  // Filter ebooks
  const filteredEbooks = useMemo(() => {
    return ebookList.filter((b) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.penulis_pengarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.deskripsi && b.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || b.kategori === selectedCategory;
      const matchFormat = selectedFormat === 'all' || b.format_file === selectedFormat;

      return matchSearch && matchCategory && matchFormat;
    });
  }, [ebookList, searchQuery, selectedCategory, selectedFormat]);

  return (
    <>
      <Helmet>
        <title>Pustaka & E-Book Digital PAI | Aji Bagus Khoiri, S.Pd., Gr.</title>
        <meta
          name="description"
          content="Koleksi buku digital, kitab turats, dan modul ajar PAI Fase D interaktif dalam format EPUB, PDF, MOBI, AZW3, dan Microsoft OneDrive."
        />
        <meta property="og:title" content="Pustaka & E-Book Digital PAI" />
        <meta
          property="og:description"
          content="Baca kitab kuning klasik dan modul Kurikulum Merdeka online langsung dari browser dengan e-reader interaktif."
        />
      </Helmet>

      <div className="py-12 md:py-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 p-8 sm:p-12 text-white border border-brand-500/30 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              <span>Khazanah Turats & Modul Digital</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
              Pustaka E-Book & Kitab Digital
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Jelajahi dan baca koleksi kitab klasik terjemahan, modul ajar Kurikulum Merdeka PAI Fase D, dan buku referensi keagamaan secara online. Mendukung pembacaan instan format <strong>EPUB, PDF, MOBI, AZW3,</strong> dan tautan awan <strong>Microsoft OneDrive</strong>.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 max-w-2xl">
            <div>
              <div className="text-2xl font-extrabold font-display text-white">{ebookList.length}</div>
              <div className="text-xs text-slate-400">Total Judul E-Book</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-display text-brand-400">
                {ebookList.filter((b) => b.format_file === 'epub').length}
              </div>
              <div className="text-xs text-slate-400">Format EPUB Interaktif</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-display text-amber-400">
                {ebookList.filter((b) => b.format_file === 'pdf').length}
              </div>
              <div className="text-xs text-slate-400">Modul & Dokumen PDF</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-display text-purple-400">
                {ebookList.filter((b) => b.format_file === 'mobi' || b.format_file === 'azw3').length}
              </div>
              <div className="text-xs text-slate-400">Kindle MOBI / AZW3</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul e-book, pengarang, penerbit, atau kata kunci..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Format Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 shrink-0">
              {[
                { key: 'all', label: 'Semua Format' },
                { key: 'epub', label: 'EPUB' },
                { key: 'pdf', label: 'PDF' },
                { key: 'mobi', label: 'MOBI' },
                { key: 'azw3', label: 'AZW3' },
              ].map((fmt) => (
                <button
                  key={fmt.key}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    selectedFormat === fmt.key
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Kategori:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ebook Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredEbooks.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Tidak ada e-book yang cocok dengan filter pencarian.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Coba gunakan kata kunci pencarian lain atau kembalikan pilihan format dan kategori ke opsi semua.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFormat('all');
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEbooks.map((ebook) => (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                onRead={(item) => setActiveReadingEbook(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {activeReadingEbook && (
        <EbookReaderModal
          isOpen={Boolean(activeReadingEbook)}
          onClose={() => setActiveReadingEbook(null)}
          ebook={activeReadingEbook}
        />
      )}
    </>
  );
};
