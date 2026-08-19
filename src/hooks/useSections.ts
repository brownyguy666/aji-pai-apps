import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SectionItem } from '../types/database';
import { initialSections } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'pai_sections_data';

export function useSections() {
  const queryClient = useQueryClient();

  const query = useQuery<SectionItem[]>({
    queryKey: ['sections'],
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
        return initialSections;
      }

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) {
        return initialSections;
      }

      const dbSections = (data || []) as SectionItem[];

      // Merge any missing core section (such as 'sertifikasi') from initialSections
      const mergedSections = [...dbSections];
      for (const initSec of initialSections) {
        if (!mergedSections.some((s) => s.key === initSec.key)) {
          mergedSections.push(initSec);
        }
      }

      return mergedSections.sort((a, b) => a.urutan - b.urutan);
    },
  });

  // Reorder mutation for drag-and-drop
  const reorderMutation = useMutation({
    mutationFn: async (reorderedSections: SectionItem[]) => {
      const updatedList = reorderedSections.map((item, index) => ({
        ...item,
        urutan: index + 1,
      }));

      if (!isSupabaseConfigured) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
        return updatedList;
      }

      // Perform upsert/batch update
      for (const section of updatedList) {
        if (section.id.startsWith('s-')) {
          // If it was a merged client section, insert it
          await supabase.from('sections').upsert({
            key: section.key,
            label: section.label,
            urutan: section.urutan,
            is_active: section.is_active,
          }, { onConflict: 'key' });
        } else {
          await supabase
            .from('sections')
            .update({ urutan: section.urutan })
            .eq('id', section.id);
        }
      }

      return updatedList;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['sections'], newData);
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialSections;
        const updated = current.map((s) => (s.id === id ? { ...s, is_active } : s));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }

      const { data, error } = await supabase
        .from('sections')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const current = query.data || initialSections;
        const updated = current.map((s) => (s.id === id ? { ...s, is_active } : s));
        return updated;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });

  const allSections = query.data || initialSections;

  return {
    sections: allSections,
    activeSections: allSections.filter((s) => s.is_active),
    isLoading: query.isLoading,
    isError: query.isError,
    reorderSections: reorderMutation.mutateAsync,
    isReordering: reorderMutation.isPending,
    toggleActive: toggleActiveMutation.mutateAsync,
  };
}
