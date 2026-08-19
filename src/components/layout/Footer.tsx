import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowUpRight, Heart, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TelegramIcon, WhatsAppIcon } from '../ui/Icons';
import { useProfile } from '../../hooks/useProfile';
import { useSubscriber } from '../../hooks/useSubscriber';

export const Footer: React.FC = () => {
  const { profile } = useProfile();
  const { subscribe, isSubscribing } = useSubscriber();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const year = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Mohon masukkan alamat email yang valid.');
      return;
    }

    try {
      setErrorMsg('');
      await subscribe({ email, honeypot });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setErrorMsg('Gagal berlangganan. Silakan coba lagi.');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1 (5 cols): Bio, Profile & Socials */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">{profile.nama}</h4>
                <p className="text-xs text-brand-400 font-medium">{profile.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Portal edukasi Pendidikan Agama Islam (PAI) Fase D Kurikulum Merdeka, khazanah kitab turats, dan kumpulan media pembelajaran interaktif berbasis Google for Education.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {profile.socials?.youtube && (
                <a
                  href={profile.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="Kunjungi Channel YouTube @ZonaBelajarID"
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
                  aria-label="Kunjungi Instagram Aji Bagus Khoiri"
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
                  aria-label="Kunjungi Telegram"
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
                  aria-label="Hubungi WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                  aria-label="Kirim Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 (3 cols): Navigasi Cepat */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigasi Halaman
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/materi" className="hover:text-brand-400 transition-colors">
                  Materi & Modul PAI Fase D
                </Link>
              </li>
              <li>
                <Link to="/terjemahan" className="hover:text-brand-400 transition-colors">
                  Proyek Terjemahan Kitab Turats
                </Link>
              </li>
              <li>
                <Link to="/karya" className="hover:text-brand-400 transition-colors">
                  Galeri Karya & Media
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 text-xs">
                  Panel Pengelola (Admin) <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 (4 cols): Newsletter Subscription Form */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider">
              Berlangganan Modul & Rilis Baru
            </h5>
            <p className="text-xs text-slate-400">
              Dapatkan update modul ajar Kurikulum Merdeka, LKPD interaktif, dan materi PAI terbaru langsung di email Anda.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Terima kasih! Anda telah terdaftar sebagai subscriber newsletter.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                {/* Honeypot Spam Protection (Hidden from legitimate users) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="b_website_footer">Jangan isi field ini jika Anda manusia</label>
                  <input
                    type="text"
                    id="b_website_footer"
                    name="b_website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Alamat Email untuk Berlangganan
                  </label>
                  <input
                    type="email"
                    id="footer-newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sekolah.sch.id"
                    aria-describedby={errorMsg ? 'footer-email-error' : undefined}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 pr-10"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    aria-label="Kirim pendaftaran newsletter"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {errorMsg && (
                  <p id="footer-email-error" className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </form>
            )}

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-400">
              <p className="font-arabic text-xs text-amber-300 mb-0.5 leading-normal">
                طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
              </p>
              <p className="italic">
                "Menuntut ilmu itu wajib atas setiap muslim." (HR. Ibnu Majah)
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} {profile.nama}. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk kebermanfaatan umat dengan <Heart className="w-3.5 h-3.5 text-red-500 inline" aria-hidden="true" /> & Teknologi Modern.
          </p>
        </div>
      </div>
    </footer>
  );
};
