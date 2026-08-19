import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GlobalSearchResult } from '../types/database';
import {
  initialMateri,
  initialTerjemahan,
  initialKarya,
  initialEbooks,
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
            m.ringkasan?.toLowerCase().includes(q)
          ) {
            localResults.push({
              id: m.id,
              type: 'materi',
              title: m.judul,
              snippet: m.ringkasan || m.konten.slice(0, 120) + '...',
              url: `/materi/${m.slug}`,
              category: m.elemen || 'Materi PAI',
            });
          }
        });

        initialEbooks.forEach((eb) => {
          if (
            eb.judul.toLowerCase().includes(q) ||
            eb.penulis_pengarang.toLowerCase().includes(q) ||
            eb.deskripsi?.toLowerCase().includes(q)
          ) {
            localResults.push({
              id: eb.id,
              type: 'ebook',
              title: eb.judul,
              snippet: `Karya ${eb.penulis_pengarang} (${eb.format_file.toUpperCase()}). ${eb.deskripsi || ''}`,
              url: '/ebook',
              category: eb.kategori,
            });
          }
        });

        initialTerjemahan.forEach((t) => {
          if (
            t.judul.toLowerCase().includes(q) ||
            t.deskripsi?.toLowerCase().includes(q) ||
            (t.penulis_asli && t.penulis_asli.toLowerCase().includes(q))
          ) {
            localResults.push({
              id: t.id,
              type: 'terjemahan',
              title: t.judul,
              snippet: `${t.bahasa_sumber || t.bahasa_asal || 'Arab'} ➔ ${t.bahasa_target || t.bahasa_tujuan || 'Indonesia'} (${t.tahun}). ${t.deskripsi || ''}`,
              url: '/terjemahan',
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
              url: '/karya',
              category: k.kategori,
            });
          }
        });

        setResults(localResults);
        setIsSearching(false);
        return;
      }

      try {
        // Run parallel queries across Materi, Ebooks, Terjemahan, and Karya in Supabase
        const [materiRes, ebookRes, terjemahanRes, karyaRes] = await Promise.all([
          supabase
            .from('materi_pai')
            .select('id, judul, slug, ringkasan, published, elemen')
            .eq('published', true)
            .or(`judul.ilike.%${q}%,ringkasan.ilike.%${q}%,konten.ilike.%${q}%`)
            .limit(5),
          supabase
            .from('ebooks')
            .select('id, judul, penulis_pengarang, kategori, deskripsi, format_file')
            .or(`judul.ilike.%${q}%,penulis_pengarang.ilike.%${q}%,deskripsi.ilike.%${q}%,kategori.ilike.%${q}%`)
            .limit(5),
          supabase
            .from('proyek_terjemahan')
            .select('id, judul, penulis_asli, bahasa_sumber, bahasa_target, tahun, deskripsi')
            .or(`judul.ilike.%${q}%,deskripsi.ilike.%${q}%,penulis_asli.ilike.%${q}%`)
            .limit(5),
          supabase
            .from('karya')
            .select('id, judul, deskripsi, kategori')
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
              snippet: m.ringkasan || 'Modul Pembelajaran PAI',
              url: `/materi/${m.slug}`,
              category: m.elemen || 'Materi PAI',
            });
          });
        }

        if (ebookRes.data) {
          ebookRes.data.forEach((b: any) => {
            combined.push({
              id: b.id,
              type: 'ebook',
              title: b.judul,
              snippet: `Karya ${b.penulis_pengarang} (${b.format_file.toUpperCase()}). ${b.deskripsi || ''}`,
              url: '/ebook',
              category: b.kategori,
            });
          });
        }

        if (terjemahanRes.data) {
          terjemahanRes.data.forEach((t: any) => {
            combined.push({
              id: t.id,
              type: 'terjemahan',
              title: t.judul,
              snippet: `${t.bahasa_sumber || t.bahasa_asal || 'Arab'} ➔ ${t.bahasa_target || t.bahasa_tujuan || 'Indonesia'} (${t.tahun})`,
              url: '/terjemahan',
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
              url: '/karya',
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
