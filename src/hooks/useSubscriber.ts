import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Subscriber } from '../types/database';
import { initialSubscribers } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_subscribers';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export type SubscribeInput = string | { email: string; honeypot?: string };

export const useSubscriber = () => {
  const queryClient = useQueryClient();

  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ['subscribers'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {
            return initialSubscribers;
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSubscribers));
        return initialSubscribers;
      }

      const { data, error } = await supabase
        .from('subscriber')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to table subscribers_newsletter if existing
        const fallback = await supabase
          .from('subscribers_newsletter')
          .select('*')
          .order('created_at', { ascending: false });

        if (!fallback.error && fallback.data) {
          return fallback.data as Subscriber[];
        }

        console.warn('Error fetching subscribers from Supabase, fallback to local/seed:', error);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialSubscribers;
      }

      return data as Subscriber[];
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (input: SubscribeInput) => {
      let email = '';
      if (typeof input === 'string') {
        email = input.trim();
      } else {
        if (input.honeypot && input.honeypot.trim() !== '') {
          // Spam detected via honeypot field, silently return success dummy
          return { id: 'honeypot_dropped', email: input.email, created_at: new Date().toISOString() };
        }
        email = input.email.trim();
      }

      if (!email) throw new Error('Email is required');

      if (!isSupabaseConfigured) {
        const exists = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
        if (exists) return exists;

        const item: Subscriber = {
          id: 'sub_' + Date.now(),
          email,
          created_at: new Date().toISOString(),
        };
        const current = [item, ...subscribers];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return item;
      }

      let res = await supabase
        .from('subscriber')
        .insert({ email })
        .select()
        .single();

      if (res.error) {
        // If unique constraint violation, ignore as already subscribed
        if (res.error.code === '23505') {
          return { id: 'existing', email, created_at: new Date().toISOString() };
        }
        // Fallback to subscribers_newsletter if table differs
        const fb = await supabase.from('subscribers_newsletter').insert({ email }).select().single();
        if (fb.error) {
          if (fb.error.code === '23505') {
            return { id: 'existing', email, created_at: new Date().toISOString() };
          }
          throw fb.error;
        }
        return fb.data as Subscriber;
      }
      return res.data as Subscriber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    },
  });

  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) {
        const current = subscribers.filter((s) => s.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
        return id;
      }

      if (isUUID(id)) {
        await supabase.from('subscriber').delete().eq('id', id);
        await supabase.from('subscribers_newsletter').delete().eq('id', id);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    },
  });

  const exportToCSV = () => {
    if (subscribers.length === 0) return;
    const headers = 'ID,Email,Tanggal_Berlangganan\n';
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.created_at}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers-newsletter-pai-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    subscribers,
    isLoading,
    subscribe: subscribeMutation.mutateAsync,
    deleteSubscriber: deleteSubscriberMutation.mutateAsync,
    exportToCSV,
    isSubscribing: subscribeMutation.isPending,
  };
};
