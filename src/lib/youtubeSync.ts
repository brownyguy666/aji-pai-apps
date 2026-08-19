import { supabase } from './supabase';
import { YouTubeVideo } from '../types/database';

export interface FetchedYouTubeVideo {
  title: string;
  video_id: string;
  thumbnail_url: string;
  published_at: string;
}

/**
 * Extract YouTube Channel ID from URL or return the raw channel ID
 */
export function normalizeChannelId(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('UC') && trimmed.length === 24) {
    return trimmed;
  }
  // Default to ZonaBelajarID if not specified
  return 'UCntpnPCycMUUtU34ztu_PtQ';
}

/**
 * Fetch latest videos from YouTube RSS feed using CORS-friendly proxies
 */
export async function fetchYouTubeChannelVideos(
  channelId: string = 'UCntpnPCycMUUtU34ztu_PtQ'
): Promise<FetchedYouTubeVideo[]> {
  const cleanId = normalizeChannelId(channelId);
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${cleanId}`;

  // Strategy 1: rss2json API (Fast JSON parser)
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map((item: any) => {
          // Extract video ID from link: https://www.youtube.com/watch?v=VIDEO_ID
          const videoIdMatch = item.link?.match(/v=([a-zA-Z0-9_-]+)/);
          const videoId = videoIdMatch ? videoIdMatch[1] : item.guid?.split(':').pop() || '';
          
          return {
            title: item.title,
            video_id: videoId,
            thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            published_at: item.pubDate ? item.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
          };
        });
      }
    }
  } catch (err) {
    console.warn('rss2json fallback to raw proxy:', err);
  }

  // Strategy 2: allorigins raw proxy XML parser
  try {
    const res = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
    );
    if (res.ok) {
      const xmlText = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.getElementsByTagName('entry');

      const videos: FetchedYouTubeVideo[] = [];
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const title = entry.getElementsByTagName('title')[0]?.textContent || 'Video Tanpa Judul';
        const videoId =
          entry.getElementsByTagName('yt:videoId')[0]?.textContent ||
          entry.getElementsByTagName('videoId')[0]?.textContent ||
          '';
        const published = entry.getElementsByTagName('published')[0]?.textContent || '';

        if (videoId) {
          videos.push({
            title,
            video_id: videoId,
            thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            published_at: published ? published.split('T')[0] : '',
          });
        }
      }

      if (videos.length > 0) {
        return videos;
      }
    }
  } catch (err) {
    console.error('AllOrigins XML parse error:', err);
  }

  throw new Error('Gagal menarik feed video dari YouTube. Pastikan ID Channel benar.');
}

/**
 * Save fetched videos directly to Supabase youtube_videos table
 */
export async function syncVideosToDatabase(
  videos: FetchedYouTubeVideo[]
): Promise<number> {
  let count = 0;

  for (let i = 0; i < videos.length; i++) {
    const vid = videos[i];
    
    // Check if video already exists in database
    const { data: existing } = await supabase
      .from('youtube_videos')
      .select('id')
      .eq('video_id', vid.video_id)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from('youtube_videos').insert({
        title: vid.title,
        video_id: vid.video_id,
        thumbnail_url: vid.thumbnail_url,
        published_at: vid.published_at,
        urutan: i + 1,
        is_featured: true,
      });

      if (!error) {
        count++;
      }
    }
  }

  return count;
}
