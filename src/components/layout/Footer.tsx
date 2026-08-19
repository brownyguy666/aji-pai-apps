import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, ArrowUpRight, Heart } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TelegramIcon, WhatsAppIcon } from '../ui/Icons';
import { useProfile } from '../../hooks/useProfile';

export const Footer: React.FC = () => {
  const { profile } = useProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Bio & Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">{profile.nama}</h4>
                <p className="text-xs text-brand-400 font-medium">{profile.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Portal edukasi Pendidikan Agama Islam (PAI), khazanah kitab turats, dan kumpulan media pembelajaran interaktif untuk mencetak generasi muslim berilmu, berakhlak mulia, dan berwawasan luas.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {profile.socials?.youtube && (
                <a
                  href={profile.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.telegram && (
                <a
                  href={profile.socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.whatsapp && (
                <a
                  href={profile.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigasi Halaman
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/materi" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  Materi & Modul PAI
                </Link>
              </li>
              <li>
                <Link to="/terjemahan" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  Proyek Terjemahan Kitab
                </Link>
              </li>
              <li>
                <Link to="/karya" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  Galeri Karya & Portofolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Edukasi & Akses */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider">
              Akses Khusus
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Panel Pengelola (Admin) <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <a
                  href="#materi"
                  className="hover:text-brand-400 transition-colors"
                >
                  Download Modul PDF/PPT
                </a>
              </li>
            </ul>
            <div className="pt-3">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                <p className="font-arabic text-sm text-amber-300 mb-1 leading-normal">
                  طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
                </p>
                <p className="italic text-slate-400">
                  "Menuntut ilmu itu wajib atas setiap muslim." (HR. Ibnu Majah)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} {profile.nama}. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk kebermanfaatan umat dengan <Heart className="w-3.5 h-3.5 text-red-500 inline" /> & Teknologi Modern.
          </p>
        </div>
      </div>
    </footer>
  );
};
