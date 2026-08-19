import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types/database';
import { initialProfile } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'pai_profile_data';

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery<Profile>({
    queryKey: ['profile'],
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
        return initialProfile;
      }

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found, fallback to initial
          return initialProfile;
        }
        throw error;
      }
      return data as Profile;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updated: Partial<Profile>) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialProfile;
        const merged = { ...current, ...updated, updated_at: new Date().toISOString() };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }

      const currentProfileId = query.data?.id;
      if (currentProfileId) {
        const { data, error } = await supabase
          .from('profile')
          .update({ ...updated, updated_at: new Date().toISOString() })
          .eq('id', currentProfileId)
          .select()
          .single();

        if (error) throw error;
        return data as Profile;
      } else {
        const { data, error } = await supabase
          .from('profile')
          .insert([updated])
          .select()
          .single();

        if (error) throw error;
        return data as Profile;
      }
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['profile'], newData);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: query.data || initialProfile,
    isLoading: query.isLoading,
    isError: query.isError,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
