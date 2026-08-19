import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const ContactSection: React.FC = () => {
  const { profile } = useProfile();

  return (
    <section id="kontak" className="py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-brand-800/40">
          
          {/* Background Decorative Rings */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Col 1: Text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/60 border border-brand-700/60 text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Kolaborasi, Pelatihan & Undangan Kajian</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
                Mari Berkolaborasi Mengembangkan Pendidikan Islam Berkualitas
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Terbuka untuk kolaborasi penulisan modul ajar, bedah kitab turats, pelatihan kurikulum merdeka PAI, maupun pengisian seminar dan kajian islami.
              </p>

              <div className="space-y-2 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <span>Narasumber Webinar & Workshop Guru PAI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <span>Proyek Penerjemahan & Riset Turats Islam</span>
                </div>
              </div>
            </div>

            {/* Col 2: Action Cards */}
            <div className="lg:col-span-5 space-y-3">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-brand-300 font-medium">Kirim Email Resmi</div>
                    <div className="text-sm font-bold text-white truncate">{profile.email}</div>
                  </div>
                </a>
              )}

              {profile.socials?.whatsapp && (
                <a
                  href={profile.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300 font-medium">WhatsApp Direct</div>
                    <div className="text-sm font-bold text-white">Hubungi via Chat</div>
                  </div>
                </a>
              )}

              {profile.socials?.telegram && (
                <a
                  href={profile.socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-sky-300 font-medium">Kanal Telegram</div>
                    <div className="text-sm font-bold text-white">Ikuti Update Materi</div>
                  </div>
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
