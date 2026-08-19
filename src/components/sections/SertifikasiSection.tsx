import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ExternalLink, ShieldCheck, Sparkles, Eye } from 'lucide-react';
import { useSertifikasi } from '../../hooks/useSertifikasi';
import { Sertifikasi } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const SertifikasiSection: React.FC = () => {
  const { sertifikasiList, isLoading } = useSertifikasi();
  const [lightboxCert, setLightboxCert] = useState<Sertifikasi | null>(null);

  return (
    <section id="sertifikasi" className="py-16 md:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/80">
      {/* Decorative Background Accents */}
      <div className="absolute top-1/2 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Kredibilitas & Kompetensi Pendidik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Sertifikasi Resmi Google for Education
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pengakuan kompetensi pedagogik digital dan integrasi kecerdasan buatan (Gemini AI) berskala internasional dari Google for Education.
            </p>
          </div>

          <a
            href="https://edu.google.accredible.com/3b93bf05-d429-4551-a346-cb902662dde2#acc.3W0LKH4w"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex shrink-0"
          >
            <Button variant="secondary" size="sm">
              <Award className="w-4 h-4 mr-2 text-blue-600" />
              Portal Kredensial Resmi
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-60" />
            </Button>
          </a>
        </div>

        {/* Grid Certification Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sertifikasiList.map((item: Sertifikasi, idx: number) => {
              const isGemini = item.judul.toLowerCase().includes('gemini');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                >
                  <Card
                    hoverEffect
                    className={`p-6 flex flex-col justify-between h-full bg-white dark:bg-slate-900 border transition-all duration-300 relative overflow-hidden group shadow-md ${
                      isGemini
                        ? 'hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-purple-500/10'
                        : 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-500/10'
                    }`}
                  >
                    {/* Top Glow Stripe */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 ${
                        isGemini
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                          : 'bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500'
                      }`}
                    />

                    <div className="space-y-4">
                      {/* Certificate Visual Badge Image */}
                      {item.badge_url && (
                        <div
                          className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950/5 dark:bg-slate-800 cursor-pointer border border-slate-200/80 dark:border-slate-800 group-hover:border-blue-400 transition-colors"
                          onClick={() => setLightboxCert(item)}
                        >
                          <img
                            src={item.badge_url}
                            alt={item.judul}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="p-2.5 rounded-full bg-white/95 text-slate-900 shadow-lg">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Header Badge */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <Badge
                          variant={isGemini ? 'purple' : 'blue'}
                          size="sm"
                        >
                          {item.kategori}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">Tahun {item.tahun}</span>
                      </div>

                      {/* Title & Issuer */}
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                          {item.judul}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item.penerbit}</span>
                        </p>
                      </div>
                    </div>

                    {/* Footer / Verification Link */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Resmi
                      </span>

                      {item.link_verifikasi && (
                        <a
                          href={item.link_verifikasi}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <span>Cek Kredensial</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Preview Modal */}
      <Modal
        isOpen={Boolean(lightboxCert)}
        onClose={() => setLightboxCert(null)}
        title={lightboxCert?.judul}
        description={lightboxCert?.penerbit}
        size="lg"
      >
        {lightboxCert && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center">
              <img
                src={lightboxCert.badge_url || ''}
                alt={lightboxCert.judul}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Penerima: <strong>Aji Bagus Khoiri</strong>
              </span>
              {lightboxCert.link_verifikasi && (
                <a
                  href={lightboxCert.link_verifikasi}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  Buka Sertifikat Asli di Accredible <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
