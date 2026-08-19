import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Briefcase,
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useRiwayat } from '../../hooks/useRiwayat';

export const RiwayatSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pendidikan' | 'organisasi' | 'pengalaman' | 'sertifikasi'>('all');
  const { riwayatList } = useRiwayat();

  const filteredList = activeTab === 'all' ? riwayatList : riwayatList.filter((r) => r.jenis === activeTab);

  const getJenisIcon = (jenis: string) => {
    switch (jenis) {
      case 'pendidikan':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'organisasi':
        return <Users className="w-4 h-4 text-amber-500" />;
      case 'pengalaman':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'sertifikasi':
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-500" />;
    }
  };

  const getJenisBadge = (jenis: string) => {
    switch (jenis) {
      case 'pendidikan':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'organisasi':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'pengalaman':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'sertifikasi':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <section id="riwayat" className="py-16 sm:py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Rekam Jejak & Aktivitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Riwayat Pendidikan, Organisasi & Pengabdian
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Perjalanan akademik, kiprah profesional dalam musyawarah guru, dan dedikasi pengajaran di SMP Negeri 2 Glagah.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { key: 'all', label: 'Semua Jejak', icon: Sparkles },
            { key: 'pendidikan', label: 'Pendidikan', icon: GraduationCap },
            { key: 'organisasi', label: 'Organisasi & Komunitas', icon: Users },
            { key: 'pengalaman', label: 'Pengalaman Mengajar', icon: Briefcase },
            { key: 'sertifikasi', label: 'Kredensial & Sertifikasi', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8 ml-2 sm:ml-4">
          {filteredList.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 flex items-center justify-center shadow-xs group-hover:scale-125 transition-transform duration-200">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
              </div>

              {/* Timeline Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getJenisBadge(item.jenis)}`}>
                        {item.jenis}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                        {item.judul}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400">
                      {item.instansi_organisasi}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>
                      {item.tahun_mulai} {item.tahun_selesai ? `– ${item.tahun_selesai}` : '– Sekarang'}
                    </span>
                  </div>
                </div>

                {item.deskripsi && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.deskripsi}
                  </p>
                )}

                {item.link_verifikasi && (
                  <div className="pt-1">
                    <a
                      href={item.link_verifikasi}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Verifikasi Kredensial / Tautan Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
