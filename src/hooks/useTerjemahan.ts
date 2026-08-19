import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProyekTerjemahan } from '../types/database';
import { initialTerjemahan } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'pai_terjemahan_data';

export function useTerjemahan() {
  const queryClient = useQueryClient();

  const query = useQuery<ProyekTerjemahan[]>({
    queryKey: ['terjemahan'],
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
        return initialTerjemahan;
      }

      const { data, error } = await supabase
        .from('proyek_terjemahan')
        .select('*')
        .order('urutan', { ascending: true })
        .order('tahun', { ascending: false });

      if (error) throw error;
      return (data || []) as ProyekTerjemahan[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<ProyekTerjemahan, 'id' | 'created_at'>) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialTerjemahan;
        const newItem: ProyekTerjemahan = {
          ...item,
          id: 't_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [...current, newItem];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      }

      const { data, error } = await supabase
        .from('proyek_terjemahan')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data as ProyekTerjemahan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terjemahan'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...changes }: Partial<ProyekTerjemahan> & { id: string }) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialTerjemahan;
        const updated = current.map((t) => (t.id === id ? { ...t, ...changes } : t));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated.find((t) => t.id === id);
      }

      const { data, error } = await supabase
        .from('proyek_terjemahan')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ProyekTerjemahan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terjemahan'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialTerjemahan;
        const updated = current.filter((t) => t.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return id;
      }

      const { error } = await supabase
        .from('proyek_terjemahan')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terjemahan'] });
    },
  });

  return {
    terjemahanList: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createTerjemahan: createMutation.mutateAsync,
    updateTerjemahan: updateMutation.mutateAsync,
    deleteTerjemahan: deleteMutation.mutateAsync,
  };
}
