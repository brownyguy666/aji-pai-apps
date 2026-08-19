import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Riwayat } from '../types/database';
import { initialRiwayat } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_riwayat';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const useRiwayat = (options?: {
  jenis?: 'pendidikan' | 'organisasi' | 'pengalaman' | 'sertifikasi' | 'all';
}) => {
  const queryClient = useQueryClient();

  const { data: riwayatList = [], isLoading } = useQuery<Riwayat[]>({
    queryKey: ['riwayat', options?.jenis],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        let list: Riwayat[] = [];
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch {
            list = initialRiwayat;
          }
        } else {
          list = initialRiwayat;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialRiwayat));
        }

        if (options?.jenis && options.jenis !== 'all') {
          list = list.filter((r) => r.jenis === options.jenis);
        }
        return list;
      }

      let query = supabase
        .from('riwayat')
        .select('*')
        .order('urutan', { ascending: true })
        .order('tahun_mulai', { ascending: false });

      if (options?.jenis && options.jenis !== 'all') {
        query = query.eq('jenis', options.jenis);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Error fetching riwayat from Supabase, fallback to local/seed:', error);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialRiwayat;
      }

      // If database table is empty, return initialRiwayat as default items
      if (!data || data.length === 0) {
        let list = initialRiwayat;
        if (options?.jenis && options.jenis !== 'all') {
          list = list.filter((r) => r.jenis === options.jenis);
        }
        return list;
      }

      return data as Riwayat[];
    },
  });

  const createRiwayatMutation = useMutation({
    mutationFn: async (newRiwayat: Omit<Riwayat, 'id' | 'created_at'>) => {
      if (!isSupabaseConfigured) {
        const item: Riwayat = {
          ...newRiwayat,
          id: 'riwayat_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        const current = [...riwayatList, item];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return item;
      }

      const { data, error } = await supabase
        .from('riwayat')
        .insert(newRiwayat)
        .select()
        .single();

      if (error) throw error;
      return data as Riwayat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat'] });
    },
  });

  const seedRiwayatMutation = useMutation({
    mutationFn: async () => {
      if (!isSupabaseConfigured) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialRiwayat));
        return initialRiwayat;
      }

      const cleanItems = initialRiwayat.map(({ id, ...rest }) => rest);
      const { data, error } = await supabase
        .from('riwayat')
        .insert(cleanItems)
        .select();

      if (error) throw error;
      return data as Riwayat[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat'] });
    },
  });

  const updateRiwayatMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Riwayat> }) => {
      if (!isSupabaseConfigured) {
        const current = riwayatList.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return current.find((c) => c.id === id);
      }

      // If item is a seed item (not a valid UUID in Supabase yet), insert it as a new persistent row
      if (!isUUID(id)) {
        const existing = riwayatList.find((r) => r.id === id);
        const toInsert = {
          judul: updates.judul || existing?.judul || '',
          instansi_organisasi: updates.instansi_organisasi || existing?.instansi_organisasi || '',
          jenis: updates.jenis || existing?.jenis || 'pendidikan',
          tahun_mulai: updates.tahun_mulai || existing?.tahun_mulai || 2024,
          tahun_selesai: updates.tahun_selesai !== undefined ? updates.tahun_selesai : existing?.tahun_selesai,
          deskripsi: updates.deskripsi !== undefined ? updates.deskripsi : existing?.deskripsi,
          link_verifikasi: updates.link_verifikasi !== undefined ? updates.link_verifikasi : existing?.link_verifikasi,
          badge_url: updates.badge_url !== undefined ? updates.badge_url : existing?.badge_url,
          certificate_url: updates.certificate_url !== undefined ? updates.certificate_url : existing?.certificate_url,
          accredible_id: updates.accredible_id !== undefined ? updates.accredible_id : existing?.accredible_id,
          urutan: updates.urutan !== undefined ? updates.urutan : existing?.urutan || 0,
          is_featured: updates.is_featured !== undefined ? updates.is_featured : true,
        };

        const { data, error } = await supabase
          .from('riwayat')
          .insert(toInsert)
          .select()
          .single();

        if (error) throw error;
        return data as Riwayat;
      }

      const { data, error } = await supabase
        .from('riwayat')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Riwayat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat'] });
    },
  });

  const deleteRiwayatMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = riwayatList.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      if (isUUID(id)) {
        const { error } = await supabase.from('riwayat').delete().eq('id', id);
        if (error) throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat'] });
    },
  });

  return {
    riwayatList,
    isLoading,
    createRiwayat: createRiwayatMutation.mutateAsync,
    updateRiwayat: updateRiwayatMutation.mutateAsync,
    deleteRiwayat: deleteRiwayatMutation.mutateAsync,
    seedRiwayat: seedRiwayatMutation.mutateAsync,
    isCreating: createRiwayatMutation.isPending,
    isUpdating: updateRiwayatMutation.isPending,
    isSeeding: seedRiwayatMutation.isPending,
  };
};
