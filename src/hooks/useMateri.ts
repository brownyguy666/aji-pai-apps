import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MateriPAI, MateriFile } from '../types/database';
import { initialMateri } from '../lib/seedData';
import { slugify } from '../lib/utils';

const LOCAL_STORAGE_KEY = 'pai_materi_data';

export function useMateri(options?: {
  categoryId?: string | null;
  search?: string;
  status?: 'all' | 'published' | 'draft';
}) {
  const queryClient = useQueryClient();

  const query = useQuery<MateriPAI[]>({
    queryKey: ['materi', options],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        let list: MateriPAI[] = initialMateri;
        if (stored) {
          try {
            list = JSON.parse(stored);
          } catch {
            list = initialMateri;
          }
        }

        // Apply filters
        if (options?.status && options.status !== 'all') {
          list = list.filter((m) => m.status === options.status);
        }
        if (options?.categoryId) {
          list = list.filter((m) => m.kategori_id === options.categoryId);
        }
        if (options?.search) {
          const q = options.search.toLowerCase();
          list = list.filter(
            (m) =>
              m.judul.toLowerCase().includes(q) ||
              m.deskripsi_singkat?.toLowerCase().includes(q) ||
              m.konten.toLowerCase().includes(q)
          );
        }
        return list;
      }

      let qb = supabase
        .from('materi_pai')
        .select(`
          *,
          kategori:kategori_materi(*),
          files:materi_file(*)
        `)
        .order('created_at', { ascending: false });

      if (options?.status && options.status !== 'all') {
        qb = qb.eq('status', options.status);
      } else if (!options?.status) {
        // default to published for public unless specified
        qb = qb.eq('status', 'published');
      }

      if (options?.categoryId) {
        qb = qb.eq('kategori_id', options.categoryId);
      }

      if (options?.search) {
        qb = qb.or(`judul.ilike.%${options.search}%,deskripsi_singkat.ilike.%${options.search}%`);
      }

      const { data, error } = await qb;
      if (error) throw error;
      return (data || []) as MateriPAI[];
    },
  });

  // Create Materi
  const createMateriMutation = useMutation({
    mutationFn: async ({
      materi,
      files,
    }: {
      materi: Omit<MateriPAI, 'id' | 'created_at' | 'updated_at' | 'files' | 'view_count'>;
      files?: Omit<MateriFile, 'id' | 'materi_id' | 'created_at'>[];
    }) => {
      const generatedSlug = materi.slug ? slugify(materi.slug) : slugify(materi.judul);

      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const current: MateriPAI[] = stored ? JSON.parse(stored) : initialMateri;
        const newId = 'm_' + Date.now();
        const createdFiles: MateriFile[] = (files || []).map((f, idx) => ({
          ...f,
          id: `file_${newId}_${idx}`,
          materi_id: newId,
          created_at: new Date().toISOString(),
        }));

        const newMateri: MateriPAI = {
          ...materi,
          id: newId,
          slug: generatedSlug,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          files: createdFiles,
        };

        const updated = [newMateri, ...current];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newMateri;
      }

      // Supabase insert
      const { data: insertedMateri, error: materiError } = await supabase
        .from('materi_pai')
        .insert([{
          judul: materi.judul,
          slug: generatedSlug,
          deskripsi_singkat: materi.deskripsi_singkat,
          konten: materi.konten,
          gambar_cover_url: materi.gambar_cover_url,
          kategori_id: materi.kategori_id,
          status: materi.status || 'published',
          view_count: 0,
        }])
        .select()
        .single();

      if (materiError) throw materiError;

      // Insert files if any
      if (files && files.length > 0) {
        const fileRows = files.map((f) => ({
          materi_id: insertedMateri.id,
          nama_file: f.nama_file,
          file_url: f.file_url,
          tipe: f.tipe,
          ukuran_bytes: f.ukuran_bytes || 0,
        }));

        const { error: fileError } = await supabase
          .from('materi_file')
          .insert(fileRows);

        if (fileError) console.error('Error inserting files:', fileError);
      }

      return insertedMateri as MateriPAI;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materi'] });
    },
  });

  // Update Materi
  const updateMateriMutation = useMutation({
    mutationFn: async ({
      id,
      materi,
      files,
    }: {
      id: string;
      materi: Partial<MateriPAI>;
      files?: Omit<MateriFile, 'id' | 'materi_id' | 'created_at'>[];
    }) => {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const current: MateriPAI[] = stored ? JSON.parse(stored) : initialMateri;
        const index = current.findIndex((m) => m.id === id);
        if (index === -1) throw new Error('Materi not found');

        const updatedFiles: MateriFile[] = files
          ? files.map((f, idx) => ({
              ...f,
              id: `file_${id}_${Date.now()}_${idx}`,
              materi_id: id,
              created_at: new Date().toISOString(),
            }))
          : current[index].files || [];

        const updated = {
          ...current[index],
          ...materi,
          slug: materi.slug ? slugify(materi.slug) : current[index].slug,
          updated_at: new Date().toISOString(),
          files: updatedFiles,
        };

        current[index] = updated;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return updated;
      }

      const { data, error } = await supabase
        .from('materi_pai')
        .update({
          ...materi,
          slug: materi.slug ? slugify(materi.slug) : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (files) {
        // Clear existing files and reinsert
        await supabase.from('materi_file').delete().eq('materi_id', id);
        if (files.length > 0) {
          const fileRows = files.map((f) => ({
            materi_id: id,
            nama_file: f.nama_file,
            file_url: f.file_url,
            tipe: f.tipe,
            ukuran_bytes: f.ukuran_bytes || 0,
          }));
          await supabase.from('materi_file').insert(fileRows);
        }
      }

      return data as MateriPAI;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materi'] });
    },
  });

  // Delete Materi
  const deleteMateriMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const current: MateriPAI[] = stored ? JSON.parse(stored) : initialMateri;
        const filtered = current.filter((m) => m.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        return id;
      }

      const { error } = await supabase
        .from('materi_pai')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materi'] });
    },
  });

  return {
    materiList: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createMateri: createMateriMutation.mutateAsync,
    updateMateri: updateMateriMutation.mutateAsync,
    deleteMateri: deleteMateriMutation.mutateAsync,
    isCreating: createMateriMutation.isPending,
    isUpdating: updateMateriMutation.isPending,
  };
}

/**
 * Fetch single Materi by slug
 */
export function useMateriDetail(slug?: string) {
  return useQuery<MateriPAI | null>({
    queryKey: ['materi-detail', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) return null;

      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const list: MateriPAI[] = stored ? JSON.parse(stored) : initialMateri;
        const item = list.find((m) => m.slug === slug || m.id === slug);
        return item || null;
      }

      const { data, error } = await supabase
        .from('materi_pai')
        .select(`
          *,
          kategori:kategori_materi(*),
          files:materi_file(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data as MateriPAI;
    },
  });
}
