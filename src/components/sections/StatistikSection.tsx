import React from 'react';
import { BookOpen, Video, Award, Users, Palette, Clock } from 'lucide-react';
import { useStatistik } from '../../hooks/useStatistik';

export const StatistikSection: React.FC = () => {
  const { data: stats, isLoading } = useStatistik();

  const statItems = [
    {
      label: 'Modul & Materi PAI',
      value: stats?.totalMateri || 15,
      suffix: '+',
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      label: 'Video Pembelajaran',
      value: stats?.totalVideo || 4,
      suffix: '+',
      icon: Video,
      color: 'from-red-600 to-rose-700',
    },
    {
      label: 'Karya & Infografis',
      value: stats?.totalKarya || 6,
      suffix: '+',
      icon: Palette,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      label: 'Jam Pelatihan & Workshop',
      value: stats?.jamPelatihan || 240,
      suffix: ' Jam',
      icon: Clock,
      color: 'from-amber-600 to-orange-700',
    },
    {
      label: 'Guru & Siswa Terjangkau',
      value: stats?.totalGuruTerlatih || 350,
      suffix: '+',
      icon: Users,
      color: 'from-purple-600 to-violet-700',
    },
  ];

  return (
    <section className="py-14 bg-slate-900 text-white relative overflow-hidden" aria-label="Statistik dan Pencapaian">
      <div className="absolute inset-0 bg-radial-at-c from-brand-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Dampak & Syiar Pembelajaran
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Dedikasi Pendidikan & Pengembangan Guru PAI
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 flex flex-col items-center text-center space-y-3 hover:border-brand-500/50 transition-all group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${item.color} shadow-lg text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>

                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                    {isLoading ? '...' : `${item.value}${item.suffix}`}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
