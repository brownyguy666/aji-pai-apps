import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Tag } from '../types/database';
import { initialTags } from '../lib/seedData';
import { slugify } from '../lib/utils';

const LOCAL_STORAGE_KEY = 'aji_pai_tags';

export const useTags = () => {
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return initialTags;
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTags));
        return initialTags;
      }

      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('nama', { ascending: true });

      if (error) {
        console.warn('Error fetching tags from Supabase, fallback to local/seed:', error);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialTags;
      }

      return data as Tag[];
    },
  });

  const createTagMutation = useMutation({
    mutationFn: async (nama: string) => {
      const slug = slugify(nama);

      if (!isSupabaseConfigured) {
        const existing = tags.find((t) => t.slug === slug);
        if (existing) return existing;

        const newTag: Tag = {
          id: 'tag_' + Date.now(),
          nama,
          slug,
          created_at: new Date().toISOString(),
        };
        const current = [...tags, newTag];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return newTag;
      }

      const { data, error } = await supabase
        .from('tags')
        .insert({ nama, slug })
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = tags.filter((t) => t.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return {
    tags,
    isLoading,
    createTag: createTagMutation.mutateAsync,
    deleteTag: deleteTagMutation.mutateAsync,
    isCreating: createTagMutation.isPending,
  };
};
