import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FAQ } from '../types/database';
import { initialFAQ } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_faq';

export const useFAQ = () => {
  const queryClient = useQueryClient();

  const { data: faqList = [], isLoading } = useQuery<FAQ[]>({
    queryKey: ['faq'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return initialFAQ;
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialFAQ));
        return initialFAQ;
      }

      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) {
        console.warn('Error fetching faq from Supabase, fallback to local/seed:', error);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialFAQ;
      }

      return data as FAQ[];
    },
  });

  const createFAQMutation = useMutation({
    mutationFn: async (newFaq: Omit<FAQ, 'id' | 'created_at'>) => {
      if (!isSupabaseConfigured) {
        const item: FAQ = {
          ...newFaq,
          id: 'faq_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const current = [...faqList, item];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return item;
      }

      const { data, error } = await supabase
        .from('faq')
        .insert(newFaq)
        .select()
        .single();

      if (error) throw error;
      return data as FAQ;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FAQ> }) => {
      if (!isSupabaseConfigured) {
        const current = faqList.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return current.find((c) => c.id === id);
      }

      const { data, error } = await supabase
        .from('faq')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as FAQ;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  const deleteFAQMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = faqList.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      const { error } = await supabase.from('faq').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  return {
    faqList,
    isLoading,
    createFAQ: createFAQMutation.mutateAsync,
    updateFAQ: updateFAQMutation.mutateAsync,
    deleteFAQ: deleteFAQMutation.mutateAsync,
    isCreating: createFAQMutation.isPending,
    isUpdating: updateFAQMutation.isPending,
  };
};
