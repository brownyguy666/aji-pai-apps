import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Languages, Sparkles, ArrowRight, Download, Mail, ExternalLink, CheckCircle } from 'lucide-react';
import { YoutubeIcon, WhatsAppIcon } from '../ui/Icons';
import { useProfile } from '../../hooks/useProfile';
import { useMateri } from '../../hooks/useMateri';
import { useTerjemahan } from '../../hooks/useTerjemahan';
import { useKarya } from '../../hooks/useKarya';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const HeroSection: React.FC = () => {
  const { profile } = useProfile();
  const { materiList } = useMateri();
  const { terjemahanList } = useTerjemahan();
  const { karyaList } = useKarya();

  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-400/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Hero Bio */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>Portal Edukasi & Khazanah Turats PAI</span>
            </div>

            {/* Main Title & Arabic Greeting */}
            <div className="space-y-2">
              <p className="font-arabic text-xl sm:text-2xl text-emerald-700 dark:text-emerald-400 font-bold">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {profile.nama}
              </h1>
              <p className="text-base sm:text-lg text-brand-600 dark:text-brand-400 font-semibold">
                {profile.tagline}
              </p>
            </div>

            {/* Bio Paragraph */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/materi">
                <Button size="lg" variant="primary" className="shadow-lg shadow-brand-600/20">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Eksplor Materi PAI
                </Button>
              </Link>

              <Link to="/terjemahan">
                <Button size="lg" variant="outline">
                  <Languages className="w-5 h-5 mr-2" />
                  Karya Terjemahan
                </Button>
              </Link>

              {profile.email && (
                <a href={`mailto:${profile.email}`}>
                  <Button size="lg" variant="ghost">
                    <Mail className="w-4 h-4 mr-2" />
                    Kontak
                  </Button>
                </a>
              )}
            </div>

            {/* Stats Row */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {materiList.length}+
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Modul & Artikel PAI
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400 font-display">
                  {terjemahanList.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Kitab Turats
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-display">
                  {karyaList.length}+
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Karya & Media Ajar
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-brand-600 via-emerald-400 to-amber-400 opacity-20 blur-lg" />

              <div className="relative rounded-3xl overflow-hidden glass-card p-6 space-y-6 shadow-2xl border border-white/60 dark:border-slate-800">
                {/* Photo with Islamic Border Glow */}
                <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 group">
                  <img
                    src={profile.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={profile.nama}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-400 fill-brand-400/20" />
                      Pendidik Tersertifikasi
                    </span>
                  </div>
                </div>

                {/* Card Quick Badges */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {profile.nama}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <Badge variant="brand" size="sm">Fikih & Ushul Fikih</Badge>
                    <Badge variant="amber" size="sm">Bahasa Arab & Turats</Badge>
                    <Badge variant="blue" size="sm">Kurikulum Merdeka</Badge>
                  </div>
                </div>

                {/* Social Buttons in Card */}
                {profile.socials && (
                  <div className="pt-2 flex justify-center gap-3 border-t border-slate-100 dark:border-slate-800">
                    {profile.socials.youtube && (
                      <a
                        href={profile.socials.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Channel YouTube"
                      >
                        <YoutubeIcon className="w-4 h-4" />
                      </a>
                    )}
                    {profile.socials.whatsapp && (
                      <a
                        href={profile.socials.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                        title="WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
