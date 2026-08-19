import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSertifikasi } from '../../hooks/useSertifikasi';
import { useThemeAccent } from '../../context/ThemeAccentContext';

export const BentoSertifikasiCard: React.FC = () => {
  const { sertifikasiList } = useSertifikasi();
  const { theme } = useThemeAccent();

  const gce = sertifikasiList[0] || {
    judul: 'Google Certified Educator Level 1',
    penerbit: 'Google for Education',
    nomor_sertifikat: '190209183',
    link_verifikasi: 'https://edu.google.accredible.com/190209183',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/190209183',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="group relative col-span-1 rounded-3xl p-5 sm:p-6 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ backgroundColor: theme.primary }}
          >
            <Award className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Sertifikasi
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
          <ShieldCheck className="w-3 h-3" />
          <span>Terverifikasi</span>
        </span>
      </div>

      {/* Center: Badge Illustration & Name */}
      <div className="my-3 text-center space-y-2 relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <img
            src={gce.badge_url || 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/190209183'}
            alt="Google Educator Badge"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if network blocked
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="space-y-0.5">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-display line-clamp-1">
            {gce.judul}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {gce.penerbit}
          </p>
        </div>
      </div>

      {/* Bottom: Verification Link */}
      {gce.link_verifikasi && (
        <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800">
          <a
            href={gce.link_verifikasi}
            target="_blank"
            rel="noreferrer"
            className="w-full py-1.5 px-2 rounded-xl text-center text-[11px] font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white inline-flex items-center justify-center gap-1 transition-colors"
          >
            <span>Cek Kredensial Resmi</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </motion.div>
  );
};
