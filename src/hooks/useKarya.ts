import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Karya } from '../types/database';
import { initialKarya } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'pai_karya_data';

export function useKarya() {
  const queryClient = useQueryClient();

  const query = useQuery<Karya[]>({
    queryKey: ['karya'],
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
        return initialKarya;
      }

      const { data, error } = await supabase
        .from('karya')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) throw error;
      return (data || []) as Karya[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<Karya, 'id' | 'created_at'>) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialKarya;
        const newItem: Karya = {
          ...item,
          id: 'k_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [...current, newItem];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      }

      const { data, error } = await supabase
        .from('karya')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data as Karya;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['karya'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...changes }: Partial<Karya> & { id: string }) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialKarya;
        const updated = current.map((k) => (k.id === id ? { ...k, ...changes } : k));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated.find((k) => k.id === id);
      }

      const { data, error } = await supabase
        .from('karya')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Karya;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['karya'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialKarya;
        const updated = current.filter((k) => k.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return id;
      }

      const { error } = await supabase
        .from('karya')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['karya'] });
    },
  });

  return {
    karyaList: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createKarya: createMutation.mutateAsync,
    updateKarya: updateMutation.mutateAsync,
    deleteKarya: deleteMutation.mutateAsync,
  };
}
