import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useSertifikasi } from '../../hooks/useSertifikasi';
import { Sertifikasi } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const SertifikasiSection: React.FC = () => {
  const { sertifikasiList, isLoading } = useSertifikasi();

  return (
    <section id="sertifikasi" className="py-16 md:py-20 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Kredibilitas & Kompetensi Pendidik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Sertifikasi & Kredensial Resmi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pengakuan kompetensi profesional guru berskala internasional dari Google for Education dan instansi pendidikan resmi.
            </p>
          </div>

          <a
            href="https://educertifications.google/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex shrink-0"
          >
            <Button variant="secondary" size="sm">
              <Award className="w-4 h-4 mr-2 text-blue-600" />
              Verifikasi Google Education
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-60" />
            </Button>
          </a>
        </div>

        {/* Grid Certification Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sertifikasiList.map((item: Sertifikasi, idx: number) => {
              const isGoogle = item.penerbit.toLowerCase().includes('google');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                >
                  <Card
                    hoverEffect
                    className={`p-6 flex flex-col justify-between h-full bg-white dark:bg-slate-900 border transition-all duration-300 relative overflow-hidden ${
                      isGoogle
                        ? 'hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-blue-500/10'
                        : 'hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm hover:shadow-emerald-500/10'
                    }`}
                  >
                    {/* Top Glow Stripe */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 ${
                        isGoogle
                          ? 'bg-gradient-to-r from-blue-500 via-red-500 to-amber-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                    />

                    <div className="space-y-4">
                      {/* Badge Icon & Category */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                            isGoogle
                              ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          <Award className="w-6 h-6" />
                        </div>

                        <Badge
                          variant={isGoogle ? 'blue' : 'brand'}
                          size="sm"
                        >
                          {item.kategori}
                        </Badge>
                      </div>

                      {/* Title & Issuer */}
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                          {item.judul}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item.penerbit}</span>
                        </p>
                      </div>

                      {/* Certificate ID */}
                      {item.nomor_sertifikat && (
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>Kredensial:</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {item.nomor_sertifikat}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer / Verification Link */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Tahun {item.tahun}</span>

                      {item.link_verifikasi ? (
                        <a
                          href={item.link_verifikasi}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span>Verifikasi</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
