import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, BookOpen } from 'lucide-react';
import { YoutubeIcon, WhatsAppIcon, InstagramIcon } from '../ui/Icons';
import { useProfile } from '../../hooks/useProfile';
import { useThemeAccent } from '../../context/ThemeAccentContext';

export const BentoProfileCard: React.FC = () => {
  const { profile } = useProfile();
  const { theme } = useThemeAccent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300"
    >
      {/* Ambient Top Glow */}
      <div
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors"
        style={{ backgroundColor: theme.primary }}
      />

      {/* Top Bar: Live Status Badge & Socials */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.primary }}
          />
          <span>Tersedia untuk Edukasi & Tahqiq</span>
        </div>

        {/* Quick Social Buttons */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          {profile.socials?.instagram && (
            <a
              href={profile.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-500 transition-colors"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socials?.whatsapp && (
            <a
              href={`https://wa.me/${profile.socials.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socials?.youtube && (
            <a
              href={profile.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-colors"
              title="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Main Avatar & Profile Info */}
      <div className="my-6 space-y-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative group/avatar">
            <div
              className="absolute -inset-1 rounded-2xl blur-md opacity-40 group-hover/avatar:opacity-80 transition-opacity"
              style={{ backgroundColor: theme.primary }}
            />
            <img
              src={profile.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={profile.nama}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
            />
            <div
              className="absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-xs"
              style={{ backgroundColor: theme.primary }}
              title="Profil Terverifikasi"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <p className="font-arabic text-sm text-emerald-700 dark:text-emerald-400 font-bold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display truncate">
              {profile.nama}
            </h2>
            <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: theme.primary }}>
              {profile.tagline}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {profile.bio}
        </p>
      </div>

      {/* Bottom Actions & Pill tags */}
      <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Guru PAI SMP</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Pengkaji Turats</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Google Certified Educator</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/materi"
            className="flex-1 px-4 py-2.5 rounded-xl text-center text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
            style={{ backgroundColor: theme.primary }}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jelajahi Materi</span>
          </Link>

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1 transition-colors"
              title="Kirim Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
