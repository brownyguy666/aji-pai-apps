import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Subscriber } from '../types/database';
import { initialSubscribers } from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'aji_pai_subscribers';

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
        .from('subscribers_newsletter')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
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

      const { data, error } = await supabase
        .from('subscribers_newsletter')
        .insert({ email })
        .select()
        .single();

      if (error) {
        // If unique constraint violation, ignore as already subscribed
        if (error.code === '23505') {
          return { id: 'existing', email, created_at: new Date().toISOString() };
        }
        throw error;
      }
      return data as Subscriber;
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

      const { error } = await supabase
        .from('subscribers_newsletter')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
