import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Sertifikasi } from '../types/database';
import { initialSertifikasi } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'pai_sertifikasi_data';

export function useSertifikasi() {
  const queryClient = useQueryClient();

  const query = useQuery<Sertifikasi[]>({
    queryKey: ['sertifikasi'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // fallback
          }
        }
        return initialSertifikasi;
      }

      const { data, error } = await supabase
        .from('sertifikasi')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) {
        // Table might not exist yet or empty, fallback gracefully
        console.warn('Supabase sertifikasi fetch error/fallback:', error.message);
        return initialSertifikasi;
      }
      return (data && data.length > 0 ? data : initialSertifikasi) as Sertifikasi[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<Sertifikasi, 'id' | 'created_at'>) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialSertifikasi;
        const newItem: Sertifikasi = {
          ...item,
          id: 'cert_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [...current, newItem];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      }

      const { data, error } = await supabase
        .from('sertifikasi')
        .insert([item])
        .select()
        .single();

      if (error) {
        // Local state fallback if table not created
        const current = query.data || initialSertifikasi;
        const newItem: Sertifikasi = {
          ...item,
          id: 'cert_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [...current, newItem];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      }
      return data as Sertifikasi;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sertifikasi'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...changes }: Partial<Sertifikasi> & { id: string }) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialSertifikasi;
        const updated = current.map((c) => (c.id === id ? { ...c, ...changes } : c));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated.find((c) => c.id === id);
      }

      const { data, error } = await supabase
        .from('sertifikasi')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const current = query.data || initialSertifikasi;
        const updated = current.map((c) => (c.id === id ? { ...c, ...changes } : c));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated.find((c) => c.id === id);
      }
      return data as Sertifikasi;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sertifikasi'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialSertifikasi;
        const updated = current.filter((c) => c.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return id;
      }

      const { error } = await supabase
        .from('sertifikasi')
        .delete()
        .eq('id', id);

      if (error) {
        const current = query.data || initialSertifikasi;
        const updated = current.filter((c) => c.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sertifikasi'] });
    },
  });

  return {
    sertifikasiList: query.data || initialSertifikasi,
    isLoading: query.isLoading,
    isError: query.isError,
    createSertifikasi: createMutation.mutateAsync,
    updateSertifikasi: updateMutation.mutateAsync,
    deleteSertifikasi: deleteMutation.mutateAsync,
    refetch: query.refetch,
  };
}
