import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Filter, X } from 'lucide-react';
import { useMateri } from '../hooks/useMateri';
import { useCategories } from '../hooks/useCategories';
import { KategoriMateri, MateriPAI } from '../types/database';
import { CategoryTreeFilter } from '../components/materi/CategoryTreeFilter';
import { MateriCard } from '../components/materi/MateriCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const MateriListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { categoryTree, categories } = useCategories();
  const { materiList, isLoading } = useMateri({
    categoryId: selectedCategory,
    search: searchQuery,
    status: 'published',
  });

  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  const activeCategoryObj = categories.find((c: KategoriMateri) => c.id === selectedCategory);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-brand-800 via-emerald-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-600/50 text-brand-200 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pustaka Modul & Edukasi PAI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
            Materi & Modul Pembelajaran PAI
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Eksplorasi kumpulan modul ajar, tafsir ayat tematik, panduan fiqih, dan lembar kerja peserta didik dengan kategori terstruktur.
          </p>

          {/* Search Input Box */}
          <div className="pt-2">
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Cari judul materi, topik, atau kata kunci..."
              leftIcon={<Search className="w-4 h-4" />}
              className="bg-white/95 text-slate-900 placeholder-slate-400 dark:bg-slate-900/90 dark:text-white"
              rightIcon={
                searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Hierarchical Category Tree (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <CategoryTreeFilter
            categoryTree={categoryTree}
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Menampilkan <span className="font-bold text-slate-900 dark:text-white">{materiList.length}</span> materi
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <Filter className="w-4 h-4 mr-1.5" />
            Filter Kategori
          </Button>
        </div>

        {/* Mobile Category Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <CategoryTreeFilter
              categoryTree={categoryTree}
              selectedCategoryId={selectedCategory}
              onSelectCategory={(catId: string | null) => {
                setSelectedCategory(catId);
                setMobileFilterOpen(false);
              }}
            />
          </div>
        )}

        {/* Right Area: Materi Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Filter Info Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-400">Kategori:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {activeCategoryObj ? activeCategoryObj.nama : 'Semua Kategori'}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {materiList.length} artikel ditemukan
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : materiList.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Belum ada materi pada kategori ini
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Coba pilih kategori lain atau reset kata kunci pencarian untuk menemukan modul yang Anda cari.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
              >
                Reset Semua Filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {materiList.map((materi: MateriPAI) => (
                <MateriCard key={materi.id} materi={materi} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
