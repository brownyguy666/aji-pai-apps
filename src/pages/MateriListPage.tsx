import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Filter, X, Tag as TagIcon } from 'lucide-react';
import { useMateri } from '../hooks/useMateri';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { KategoriMateri, MateriPAI } from '../types/database';
import { CategoryTreeFilter } from '../components/materi/CategoryTreeFilter';
import { MateriCard } from '../components/materi/MateriCard';
import { SEOHead } from '../components/seo/SEOHead';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const MateriListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialTag = searchParams.get('tag');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { categoryTree, categories } = useCategories();
  const { tags } = useTags();
  const { materiList, isLoading } = useMateri({
    categoryId: selectedCategory,
    search: searchQuery,
    status: 'published',
  });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedTag) params.tag = selectedTag;
    setSearchParams(params);
  }, [selectedCategory, selectedTag, setSearchParams]);

  // Filter by tag if selectedTag
  const filteredMateri = selectedTag
    ? materiList.filter((m) => m.tags?.some((t) => t.slug === selectedTag || t.nama.toLowerCase() === selectedTag.toLowerCase()))
    : materiList;

  const activeCategoryObj = categories.find((c: KategoriMateri) => c.id === selectedCategory);
  const activeTagObj = tags.find((t) => t.slug === selectedTag);

  return (
    <>
      <SEOHead
        title="Materi & Modul Pembelajaran PAI Fase D SMP"
        description="Koleksi modul ajar PAI Kurikulum Merdeka Fase D (Kelas 7, 8, 9), 5 elemen (Al-Qur'an Hadis, Akidah, Akhlak, Fikih, SKI) lengkap dengan link Google Drive dan LKPD."
        type="website"
      />

      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-brand-800 via-emerald-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-600/50 text-brand-200 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pustaka Modul & Edukasi PAI Fase D</span>
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
                leftIcon={<Search className="w-4 h-4" aria-hidden="true" />}
                className="bg-white/95 text-slate-900 placeholder-slate-400 dark:bg-slate-900/90 dark:text-white"
                rightIcon={
                  searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Hapus kata kunci pencarian"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : undefined
                }
              />
            </div>

            {/* Popular Tag Filters */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <TagIcon className="w-3 h-3 text-brand-300" aria-hidden="true" />
                Tag:
              </span>
              {tags.slice(0, 6).map((tag) => {
                const isActive = selectedTag === tag.slug;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTag(isActive ? null : tag.slug)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-brand-900 font-bold shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                  >
                    #{tag.nama}
                  </button>
                );
              })}
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
              Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredMateri.length}</span> materi
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
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase text-slate-400">Filter Aktif:</span>
                {activeCategoryObj && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    Kategori: {activeCategoryObj.nama}
                    <button type="button" onClick={() => setSelectedCategory(null)} aria-label="Hapus filter kategori">
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {activeTagObj && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Tag: #{activeTagObj.nama}
                    <button type="button" onClick={() => setSelectedTag(null)} aria-label="Hapus filter tag">
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {!activeCategoryObj && !activeTagObj && (
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Semua Kategori & Topik
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredMateri.length} artikel ditemukan
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredMateri.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Belum ada materi pada kategori / tag ini
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Coba pilih kategori lain atau reset filter pencarian untuk menemukan modul yang Anda cari.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedTag(null);
                    setSearchQuery('');
                  }}
                >
                  Reset Semua Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMateri.map((materi: MateriPAI) => (
                  <MateriCard key={materi.id} materi={materi} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
