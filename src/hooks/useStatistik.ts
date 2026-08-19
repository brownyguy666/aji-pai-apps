import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StatistikData } from '../types/database';
import { initialMateri, initialTerjemahan, initialKarya, initialYouTubeVideos, initialEbooks } from '../lib/seedData';

export const useStatistik = () => {
  return useQuery<StatistikData>({
    queryKey: ['statistik'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return {
          totalMateri: initialMateri.length + 12,
          totalTerjemahan: initialTerjemahan.length,
          totalKarya: initialKarya.length,
          totalEbook: initialEbooks.length,
          totalVideo: initialYouTubeVideos.length,
          jamPelatihan: 240,
          totalGuruTerlatih: 350,
        };
      }

      try {
        const [materiRes, terjemahanRes, karyaRes, videoRes, ebookRes] = await Promise.all([
          supabase.from('materi_pai').select('id', { count: 'exact', head: true }),
          supabase.from('proyek_terjemahan').select('id', { count: 'exact', head: true }),
          supabase.from('karya').select('id', { count: 'exact', head: true }),
          supabase.from('youtube_videos').select('id', { count: 'exact', head: true }),
          supabase.from('ebooks').select('id', { count: 'exact', head: true }),
        ]);

        return {
          totalMateri: materiRes.count || initialMateri.length,
          totalTerjemahan: terjemahanRes.count || initialTerjemahan.length,
          totalKarya: karyaRes.count || initialKarya.length,
          totalEbook: ebookRes.count || initialEbooks.length,
          totalVideo: videoRes.count || initialYouTubeVideos.length,
          jamPelatihan: 240,
          totalGuruTerlatih: 350,
        };
      } catch (err) {
        console.warn('Error fetching live stats:', err);
        return {
          totalMateri: 15,
          totalTerjemahan: 4,
          totalKarya: 6,
          totalEbook: 4,
          totalVideo: 4,
          jamPelatihan: 240,
          totalGuruTerlatih: 350,
        };
      }
    },
  });
};
