import React, { useState } from 'react';
import { Languages, Search, Calendar, ExternalLink, X } from 'lucide-react';
import { useTerjemahan } from '../hooks/useTerjemahan';
import { ProyekTerjemahan } from '../types/database';
import { SEOHead } from '../components/seo/SEOHead';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const TerjemahanPage: React.FC = () => {
  const { terjemahanList, isLoading } = useTerjemahan();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');

  const years: string[] = ['Semua', ...Array.from(new Set(terjemahanList.map((t: ProyekTerjemahan) => t.tahun.toString()))).sort().reverse()];

  const filtered: ProyekTerjemahan[] = terjemahanList.filter((item: ProyekTerjemahan) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'Semua' || item.tahun.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <>
      <SEOHead
        title="Proyek Terjemahan Kitab Turats & Syarah"
        description="Koleksi hasil terjemahan kitab kuning klasik (fikih, adab penuntut ilmu, matan fiqh syafi'i) lengkap dengan ta'liq, dalil, dan catatan kontekstual."
        type="website"
      />

      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-900 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/60 border border-amber-600/50 text-amber-200 text-xs font-semibold">
              <Languages className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Penerjemahan & Syarah Turats</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
              Proyek Terjemahan Kitab Turats
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Daftar karya dan anotasi terjemahan kitab kuning klasik (fikih, tasawuf, adab penuntut ilmu, dan ushuluddin) ke dalam Bahasa Indonesia modern.
            </p>

            <div className="pt-2">
              <Input
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Cari judul kitab, pengarang, atau kata kunci..."
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
          </div>
        </div>

        {/* Year Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 mr-2">Tahun Rilis:</span>
            {years.map((yr: string) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedYear === yr
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {filtered.length} terjemahan ditemukan
          </div>
        </div>

        {/* Grid Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
              <Languages className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Tidak ada proyek terjemahan yang cocok
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedYear('Semua');
              }}
            >
              Reset Pencarian
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item: ProyekTerjemahan) => (
              <Card key={item.id} hoverEffect className="p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <span>{item.bahasa_asal}</span>
                      <span>➔</span>
                      <span>{item.bahasa_tujuan}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      Tahun {item.tahun}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-snug">
                    {item.judul}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Badge variant="secondary" size="sm">Kitab & Anotasi</Badge>
                  {item.link_file ? (
                    <a
                      href={item.link_file}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      Unduh / Baca Naskah
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Arsip Cetak</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
