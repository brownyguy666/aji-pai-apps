import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { EBook, EBookFormat } from '../types/database';
import { initialEbooks } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_ebooks';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export interface UseEbookOptions {
  kategori?: string;
  format?: EBookFormat | 'all';
  bahasa?: string;
  featuredOnly?: boolean;
}

export const useEbook = (options?: UseEbookOptions) => {
  const queryClient = useQueryClient();

  const { data: ebookList = [], isLoading } = useQuery<EBook[]>({
    queryKey: ['ebooks', options?.kategori, options?.format, options?.bahasa, options?.featuredOnly],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        let list: EBook[] = [];
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch {
            list = initialEbooks;
          }
        } else {
          list = initialEbooks;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialEbooks));
        }

        if (options?.kategori && options.kategori !== 'all') {
          list = list.filter((b) => b.kategori === options.kategori);
        }
        if (options?.format && options.format !== 'all') {
          list = list.filter((b) => b.format_file === options.format);
        }
        if (options?.featuredOnly) {
          list = list.filter((b) => b.is_featured);
        }
        return list;
      }

      let query = supabase
        .from('ebooks')
        .select('*')
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false });

      if (options?.kategori && options.kategori !== 'all') {
        query = query.eq('kategori', options.kategori);
      }
      if (options?.format && options.format !== 'all') {
        query = query.eq('format_file', options.format);
      }
      if (options?.featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Error fetching ebooks from Supabase, fallback to local/seed:', error);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialEbooks;
      }

      if (!data || data.length === 0) {
        let list = initialEbooks;
        if (options?.kategori && options.kategori !== 'all') {
          list = list.filter((b) => b.kategori === options.kategori);
        }
        if (options?.format && options.format !== 'all') {
          list = list.filter((b) => b.format_file === options.format);
        }
        if (options?.featuredOnly) {
          list = list.filter((b) => b.is_featured);
        }
        return list;
      }

      return data as EBook[];
    },
  });

  const createEbookMutation = useMutation({
    mutationFn: async (newBook: Omit<EBook, 'id' | 'created_at' | 'updated_at'>) => {
      if (!isSupabaseConfigured) {
        const item: EBook = {
          ...newBook,
          id: 'eb_' + Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const current = [...ebookList, item];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return item;
      }

      const { data, error } = await supabase
        .from('ebooks')
        .insert(newBook)
        .select()
        .single();

      if (error) throw error;
      return data as EBook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });

  const updateEbookMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EBook> }) => {
      if (!isSupabaseConfigured) {
        const current = ebookList.map((item) =>
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return current.find((c) => c.id === id);
      }

      // If updating a seed item on an unseeded table, insert ALL seed items with this one updated
      if (!isUUID(id)) {
        const existingDB = await supabase.from('ebooks').select('id');
        if (!existingDB.data || existingDB.data.length === 0) {
          const allToInsert = initialEbooks.map((b) => {
            if (b.id === id) {
              return {
                judul: updates.judul || b.judul,
                penulis_pengarang: updates.penulis_pengarang || b.penulis_pengarang,
                penerbit_pentahqiq: updates.penerbit_pentahqiq !== undefined ? updates.penerbit_pentahqiq : b.penerbit_pentahqiq,
                kategori: updates.kategori || b.kategori,
                deskripsi: updates.deskripsi !== undefined ? updates.deskripsi : b.deskripsi,
                cover_url: updates.cover_url !== undefined ? updates.cover_url : b.cover_url,
                format_file: updates.format_file || b.format_file,
                file_url: updates.file_url !== undefined ? updates.file_url : b.file_url,
                onedrive_embed_url: updates.onedrive_embed_url !== undefined ? updates.onedrive_embed_url : b.onedrive_embed_url,
                tahun_terbit: updates.tahun_terbit !== undefined ? updates.tahun_terbit : b.tahun_terbit,
                jumlah_halaman: updates.jumlah_halaman !== undefined ? updates.jumlah_halaman : b.jumlah_halaman,
                bahasa: updates.bahasa || b.bahasa,
                is_downloadable: updates.is_downloadable !== undefined ? updates.is_downloadable : b.is_downloadable,
                is_featured: updates.is_featured !== undefined ? updates.is_featured : b.is_featured,
                urutan: updates.urutan !== undefined ? updates.urutan : b.urutan,
              };
            }
            return {
              judul: b.judul,
              penulis_pengarang: b.penulis_pengarang,
              penerbit_pentahqiq: b.penerbit_pentahqiq,
              kategori: b.kategori,
              deskripsi: b.deskripsi,
              cover_url: b.cover_url,
              format_file: b.format_file,
              file_url: b.file_url,
              onedrive_embed_url: b.onedrive_embed_url,
              tahun_terbit: b.tahun_terbit,
              jumlah_halaman: b.jumlah_halaman,
              bahasa: b.bahasa,
              is_downloadable: b.is_downloadable,
              is_featured: b.is_featured,
              urutan: b.urutan,
            };
          });

          const { data, error } = await supabase.from('ebooks').insert(allToInsert).select();
          if (error) throw error;
          return data?.[0] as EBook;
        }

        const existing = ebookList.find((b) => b.id === id);
        const toInsert = {
          judul: updates.judul || existing?.judul || '',
          penulis_pengarang: updates.penulis_pengarang || existing?.penulis_pengarang || '',
          penerbit_pentahqiq: updates.penerbit_pentahqiq !== undefined ? updates.penerbit_pentahqiq : existing?.penerbit_pentahqiq,
          kategori: updates.kategori || existing?.kategori || 'Fikih',
          deskripsi: updates.deskripsi !== undefined ? updates.deskripsi : existing?.deskripsi,
          cover_url: updates.cover_url !== undefined ? updates.cover_url : existing?.cover_url,
          format_file: updates.format_file || existing?.format_file || 'pdf',
          file_url: updates.file_url !== undefined ? updates.file_url : existing?.file_url,
          onedrive_embed_url: updates.onedrive_embed_url !== undefined ? updates.onedrive_embed_url : existing?.onedrive_embed_url,
          tahun_terbit: updates.tahun_terbit !== undefined ? updates.tahun_terbit : existing?.tahun_terbit,
          jumlah_halaman: updates.jumlah_halaman !== undefined ? updates.jumlah_halaman : existing?.jumlah_halaman,
          bahasa: updates.bahasa || existing?.bahasa || 'Indonesia',
          is_downloadable: updates.is_downloadable !== undefined ? updates.is_downloadable : existing?.is_downloadable ?? true,
          is_featured: updates.is_featured !== undefined ? updates.is_featured : existing?.is_featured ?? true,
          urutan: updates.urutan !== undefined ? updates.urutan : existing?.urutan || 0,
        };

        const { data, error } = await supabase
          .from('ebooks')
          .insert(toInsert)
          .select()
          .single();

        if (error) throw error;
        return data as EBook;
      }

      const { data, error } = await supabase
        .from('ebooks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as EBook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });

  const deleteEbookMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = ebookList.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      if (isUUID(id)) {
        const { error } = await supabase.from('ebooks').delete().eq('id', id);
        if (error) throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });

  const seedEbooksMutation = useMutation({
    mutationFn: async () => {
      if (!isSupabaseConfigured) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialEbooks));
        return initialEbooks;
      }

      const cleanItems = initialEbooks.map(({ id, ...rest }) => rest);
      const { data, error } = await supabase.from('ebooks').insert(cleanItems).select();
      if (error) throw error;
      return data as EBook[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });

  return {
    ebookList,
    isLoading,
    createEbook: createEbookMutation.mutateAsync,
    updateEbook: updateEbookMutation.mutateAsync,
    deleteEbook: deleteEbookMutation.mutateAsync,
    seedEbooks: seedEbooksMutation.mutateAsync,
    isCreating: createEbookMutation.isPending,
    isUpdating: updateEbookMutation.isPending,
    isSeeding: seedEbooksMutation.isPending,
  };
};
