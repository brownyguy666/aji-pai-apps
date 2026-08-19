import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { KategoriMateri } from '../types/database';
import { initialCategories } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'pai_categories_data';

// Helper to construct nested tree from flat list
export function buildCategoryTree(categories: KategoriMateri[]): KategoriMateri[] {
  const map = new Map<string, KategoriMateri>();
  const roots: KategoriMateri[] = [];

  // Clone objects
  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      const parent = map.get(cat.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery<KategoriMateri[]>({
    queryKey: ['categories'],
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
        return initialCategories;
      }

      const { data, error } = await supabase
        .from('kategori_materi')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) throw error;
      return (data || []) as KategoriMateri[];
    },
  });

  const categories = query.data || initialCategories;
  const categoryTree = buildCategoryTree(categories);

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCat: Omit<KategoriMateri, 'id' | 'created_at'>) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialCategories;
        const created: KategoriMateri = {
          ...newCat,
          id: 'cat_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [...current, created];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return created;
      }

      const { data, error } = await supabase
        .from('kategori_materi')
        .insert([newCat])
        .select()
        .single();

      if (error) throw error;
      return data as KategoriMateri;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...changes }: Partial<KategoriMateri> & { id: string }) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialCategories;
        const updated = current.map((c) => (c.id === id ? { ...c, ...changes } : c));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated.find((c) => c.id === id);
      }

      const { data, error } = await supabase
        .from('kategori_materi')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as KategoriMateri;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialCategories;
        const updated = current.filter((c) => c.id !== id && c.parent_id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return id;
      }

      const { error } = await supabase
        .from('kategori_materi')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['materi'] });
    },
  });

  return {
    categories,
    categoryTree,
    isLoading: query.isLoading,
    isError: query.isError,
    addCategory: addCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
  };
}
