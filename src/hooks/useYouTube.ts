import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { YouTubeVideo } from '../types/database';
import { initialYouTubeVideos } from '../lib/seedData';
import { extractYouTubeId } from '../lib/utils';

const LOCAL_STORAGE_KEY = 'pai_youtube_data';

export function useYouTube() {
  const queryClient = useQueryClient();

  const query = useQuery<YouTubeVideo[]>({
    queryKey: ['youtube_videos'],
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
        return initialYouTubeVideos;
      }

      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) throw error;
      return (data || []) as YouTubeVideo[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<YouTubeVideo, 'id' | 'created_at'>) => {
      const cleanVideoId = extractYouTubeId(item.video_id);
      const thumbnail =
        item.thumbnail_url || `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`;

      if (!isSupabaseConfigured) {
        const current = query.data || initialYouTubeVideos;
        const newItem: YouTubeVideo = {
          ...item,
          video_id: cleanVideoId,
          thumbnail_url: thumbnail,
          id: 'y_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const updated = [...current, newItem];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      }

      const { data, error } = await supabase
        .from('youtube_videos')
        .insert([
          {
            ...item,
            video_id: cleanVideoId,
            thumbnail_url: thumbnail,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as YouTubeVideo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube_videos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...changes }: Partial<YouTubeVideo> & { id: string }) => {
      const cleanChanges = { ...changes };
      if (cleanChanges.video_id) {
        cleanChanges.video_id = extractYouTubeId(cleanChanges.video_id);
        if (!cleanChanges.thumbnail_url) {
          cleanChanges.thumbnail_url = `https://img.youtube.com/vi/${cleanChanges.video_id}/maxresdefault.jpg`;
        }
      }

      if (!isSupabaseConfigured) {
        const current = query.data || initialYouTubeVideos;
        const updated = current.map((v) => (v.id === id ? { ...v, ...cleanChanges } : v));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated.find((v) => v.id === id);
      }

      const { data, error } = await supabase
        .from('youtube_videos')
        .update(cleanChanges)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as YouTubeVideo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube_videos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = query.data || initialYouTubeVideos;
        const updated = current.filter((v) => v.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return id;
      }

      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youtube_videos'] });
    },
  });

  return {
    videos: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createVideo: createMutation.mutateAsync,
    updateVideo: updateMutation.mutateAsync,
    deleteVideo: deleteMutation.mutateAsync,
    refetch: query.refetch,
  };
}
