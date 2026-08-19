import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Komentar } from '../types/database';
import { initialKomentar } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_komentar';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export interface KentarCommentWithMateri extends Komentar {
  materi?: {
    id: string;
    judul: string;
    slug: string;
  };
}

export const useKomentar = (options?: { materiId?: string; status?: string }) => {
  const queryClient = useQueryClient();

  const { data: komentarList = [], isLoading } = useQuery<KentarCommentWithMateri[]>({
    queryKey: ['komentar', options?.materiId, options?.status],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        let list: KentarCommentWithMateri[] = [];
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch {
            list = initialKomentar;
          }
        } else {
          list = initialKomentar;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialKomentar));
        }

        if (options?.materiId) {
          list = list.filter((k) => k.materi_id === options.materiId);
        }
        if (options?.status && options.status !== 'all') {
          list = list.filter((k) => k.status === options.status);
        }
        return list;
      }

      let query = supabase
        .from('komentar')
        .select(`
          *,
          materi:materi_pai(id, judul, slug)
        `)
        .order('created_at', { ascending: false });

      if (options?.materiId && isUUID(options.materiId)) {
        query = query.eq('materi_id', options.materiId);
      }

      if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      const { data, error } = await query;
      if (error) {
        // Fallback to table komentar_materi if existing
        const fallback = await supabase
          .from('komentar_materi')
          .select(`*, materi:materi_pai(id, judul, slug)`)
          .order('created_at', { ascending: false });

        if (!fallback.error && fallback.data) {
          return fallback.data as KentarCommentWithMateri[];
        }

        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialKomentar;
      }

      return data as KentarCommentWithMateri[];
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (newComment: {
      materi_id: string;
      nama: string;
      email: string;
      konten: string;
      parent_id?: string;
    }) => {
      if (!isSupabaseConfigured) {
        const item: KentarCommentWithMateri = {
          id: 'komentar_' + Date.now(),
          materi_id: newComment.materi_id,
          nama: newComment.nama,
          email: newComment.email,
          konten: newComment.konten,
          status: 'pending',
          parent_id: newComment.parent_id || null,
          created_at: new Date().toISOString(),
        };
        const current = [item, ...komentarList];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return item;
      }

      // Ensure valid UUID or fallback
      const payload: any = {
        nama: newComment.nama,
        email: newComment.email,
        konten: newComment.konten,
        status: 'pending',
      };

      if (isUUID(newComment.materi_id)) {
        payload.materi_id = newComment.materi_id;
      }

      const { data, error } = await supabase
        .from('komentar')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data as Komentar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['komentar'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: 'approved' | 'rejected' }) => {
      if (!isSupabaseConfigured) {
        const current = komentarList.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return current.find((c) => c.id === id);
      }

      if (!isUUID(id)) {
        return komentarList.find((c) => c.id === id);
      }

      const { data, error } = await supabase
        .from('komentar')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Komentar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['komentar'] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = komentarList.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      if (isUUID(id)) {
        const { error } = await supabase.from('komentar').delete().eq('id', id);
        if (error) throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['komentar'] });
    },
  });

  const pendingCount = komentarList.filter((k) => k.status === 'pending').length;

  return {
    komentarList,
    pendingCount,
    isLoading,
    createComment: createCommentMutation.mutateAsync,
    addComment: createCommentMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,
    isAdding: createCommentMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
