import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Testimoni } from '../types/database';
import { initialTestimoni } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_testimoni';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const useTestimoni = (options?: { status?: 'approved' | 'pending' | 'rejected' | 'all' }) => {
  const queryClient = useQueryClient();

  const { data: testimoniList = [], isLoading } = useQuery<Testimoni[]>({
    queryKey: ['testimoni', options?.status],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        let list: Testimoni[] = [];
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch {
            list = initialTestimoni;
          }
        } else {
          list = initialTestimoni;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTestimoni));
        }

        if (options?.status && options.status !== 'all') {
          list = list.filter((t) => t.status === options.status);
        }
        return list;
      }

      let query = supabase
        .from('testimoni')
        .select('*')
        .order('urutan', { ascending: true })
        .order('created_at', { ascending: false });

      if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Error fetching testimoni from Supabase, fallback to local/seed:', error);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialTestimoni;
      }

      if (!data || data.length === 0) {
        let list = initialTestimoni;
        if (options?.status && options.status !== 'all') {
          list = list.filter((t) => t.status === options.status);
        }
        return list;
      }

      return data as Testimoni[];
    },
  });

  const addTestimoniMutation = useMutation({
    mutationFn: async (newTesti: Omit<Testimoni, 'id' | 'created_at' | 'status' | 'urutan'> & { status?: 'approved' | 'pending'; urutan?: number }) => {
      if (!isSupabaseConfigured) {
        const item: Testimoni = {
          ...newTesti,
          id: 'testi_' + Date.now(),
          status: newTesti.status || 'pending',
          urutan: newTesti.urutan || 0,
          created_at: new Date().toISOString(),
        };
        const current = [item, ...testimoniList];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return item;
      }

      const { data, error } = await supabase
        .from('testimoni')
        .insert({
          ...newTesti,
          status: newTesti.status || 'pending',
          urutan: newTesti.urutan || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Testimoni;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimoni'] });
    },
  });

  const updateTestimoniMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Testimoni> }) => {
      if (!isSupabaseConfigured) {
        const current = testimoniList.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return current.find((c) => c.id === id);
      }

      // If seed item being updated, insert to Supabase
      if (!isUUID(id)) {
        const existing = testimoniList.find((t) => t.id === id);
        const toInsert = {
          nama: updates.nama || existing?.nama || '',
          peran_instansi: updates.peran_instansi || existing?.peran_instansi || '',
          konten: updates.konten || existing?.konten || '',
          foto_url: updates.foto_url !== undefined ? updates.foto_url : existing?.foto_url || null,
          status: updates.status || existing?.status || 'approved',
          rating: updates.rating !== undefined ? updates.rating : existing?.rating || 5,
          urutan: updates.urutan !== undefined ? updates.urutan : existing?.urutan || 0,
        };

        const { data, error } = await supabase
          .from('testimoni')
          .insert(toInsert)
          .select()
          .single();

        if (error) throw error;
        return data as Testimoni;
      }

      const { data, error } = await supabase
        .from('testimoni')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Testimoni;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimoni'] });
    },
  });

  const deleteTestimoniMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = testimoniList.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      if (isUUID(id)) {
        const { error } = await supabase.from('testimoni').delete().eq('id', id);
        if (error) throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimoni'] });
    },
  });

  const pendingCount = testimoniList.filter((t) => t.status === 'pending').length;

  return {
    testimoniList,
    pendingCount,
    isLoading,
    addTestimoni: addTestimoniMutation.mutateAsync,
    updateTestimoni: updateTestimoniMutation.mutateAsync,
    deleteTestimoni: deleteTestimoniMutation.mutateAsync,
    isAdding: addTestimoniMutation.isPending,
  };
};
