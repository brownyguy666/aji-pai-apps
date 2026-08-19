import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles, Video } from 'lucide-react';
import { YoutubeIcon } from '../ui/Icons';
import { useYouTube } from '../../hooks/useYouTube';
import { useProfile } from '../../hooks/useProfile';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const YouTubeSection: React.FC = () => {
  const { videos, isLoading } = useYouTube();
  const { profile } = useProfile();
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

  const featuredVideos = videos.slice(0, 4);

  return (
    <section id="youtube" className="py-16 md:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <YoutubeIcon className="w-4 h-4" />
              <span>Media Audio-Visual Edukatif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Kajian & Video Pembelajaran YouTube
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tayangan video penjelasan materi PAI, kajian kitab kuning tematik, dan tips pembelajaran interaktif langsung dari channel YouTube.
            </p>
          </div>

          {profile.socials?.youtube && (
            <a
              href={profile.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex shrink-0"
            >
              <Button variant="secondary" size="sm" className="hover:text-red-600">
                <YoutubeIcon className="w-4 h-4 mr-2 text-red-600" />
                Kunjungi Channel YouTube
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-60" />
              </Button>
            </a>
          )}
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-video rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                onClick={() => setSelectedVideo({ id: video.video_id, title: video.title })}
                className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-red-950/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={
                      video.thumbnail_url ||
                      `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {video.published_at && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-white font-medium">
                      {video.published_at}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <h4 className="font-display font-semibold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-red-500" />
                      Tonton Video
                    </span>
                    <span className="text-brand-600 dark:text-brand-400 font-medium">YouTube</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Video Modal Player */}
      <Modal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title}
        size="xl"
      >
        {selectedVideo && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        )}
      </Modal>
    </section>
  );
};
