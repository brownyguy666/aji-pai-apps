import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GlobalSearchResult } from '../types/database';
import {
  initialMateri,
  initialTerjemahan,
  initialKarya,
} from '../lib/seedData';

let debounceTimeout: any = null;

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
      const q = query.toLowerCase().trim();
      const localResults: GlobalSearchResult[] = [];

      if (!isSupabaseConfigured) {
        // Fallback in-memory search across initial seed items
        initialMateri.forEach((m) => {
          if (
            m.judul.toLowerCase().includes(q) ||
            m.konten.toLowerCase().includes(q) ||
            m.deskripsi_singkat?.toLowerCase().includes(q)
          ) {
            localResults.push({
              id: m.id,
              type: 'materi',
              title: m.judul,
              snippet: m.deskripsi_singkat || m.konten.slice(0, 120) + '...',
              url: `/materi/${m.slug}`,
              category: m.kategori?.nama || 'Materi PAI',
            });
          }
        });

        initialTerjemahan.forEach((t) => {
          if (
            t.judul.toLowerCase().includes(q) ||
            t.deskripsi?.toLowerCase().includes(q) ||
            t.bahasa_asal.toLowerCase().includes(q)
          ) {
            localResults.push({
              id: t.id,
              type: 'terjemahan',
              title: t.judul,
              snippet: `${t.bahasa_asal} ➔ ${t.bahasa_tujuan} (${t.tahun}). ${t.deskripsi || ''}`,
              url: t.link_file || '/terjemahan',
              category: 'Proyek Terjemahan',
            });
          }
        });

        initialKarya.forEach((k) => {
          if (
            k.judul.toLowerCase().includes(q) ||
            k.deskripsi?.toLowerCase().includes(q) ||
            k.kategori.toLowerCase().includes(q)
          ) {
            localResults.push({
              id: k.id,
              type: 'karya',
              title: k.judul,
              snippet: k.deskripsi || 'Media edukasi dan publikasi PAI.',
              url: k.link_eksternal || '/karya',
              category: k.kategori,
            });
          }
        });

        setResults(localResults);
        setIsSearching(false);
        return;
      }

      try {
        // Run parallel queries across Materi, Terjemahan, and Karya in Supabase
        const [materiRes, terjemahanRes, karyaRes] = await Promise.all([
          supabase
            .from('materi_pai')
            .select('id, judul, slug, deskripsi_singkat, status, kategori:kategori_materi(nama)')
            .eq('status', 'published')
            .or(`judul.ilike.%${q}%,deskripsi_singkat.ilike.%${q}%,konten.ilike.%${q}%`)
            .limit(5),
          supabase
            .from('proyek_terjemahan')
            .select('id, judul, bahasa_asal, bahasa_tujuan, tahun, deskripsi, link_file')
            .or(`judul.ilike.%${q}%,deskripsi.ilike.%${q}%`)
            .limit(5),
          supabase
            .from('karya')
            .select('id, judul, deskripsi, kategori, link_eksternal')
            .or(`judul.ilike.%${q}%,deskripsi.ilike.%${q}%,kategori.ilike.%${q}%`)
            .limit(5),
        ]);

        const combined: GlobalSearchResult[] = [];

        if (materiRes.data) {
          materiRes.data.forEach((m: any) => {
            combined.push({
              id: m.id,
              type: 'materi',
              title: m.judul,
              snippet: m.deskripsi_singkat || 'Modul Pembelajaran PAI',
              url: `/materi/${m.slug}`,
              category: m.kategori?.nama || 'Materi PAI',
            });
          });
        }

        if (terjemahanRes.data) {
          terjemahanRes.data.forEach((t: any) => {
            combined.push({
              id: t.id,
              type: 'terjemahan',
              title: t.judul,
              snippet: `${t.bahasa_asal} ➔ ${t.bahasa_tujuan} (${t.tahun})`,
              url: t.link_file || '/terjemahan',
              category: 'Proyek Terjemahan',
            });
          });
        }

        if (karyaRes.data) {
          karyaRes.data.forEach((k: any) => {
            combined.push({
              id: k.id,
              type: 'karya',
              title: k.judul,
              snippet: k.deskripsi || 'Galeri Karya & Portofolio',
              url: k.link_eksternal || '/karya',
              category: k.kategori,
            });
          });
        }

        setResults(combined);
      } catch (err) {
        console.error('Error executing search query:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    isLoading: isSearching,
    clearSearch: () => setQuery(''),
  };
};
