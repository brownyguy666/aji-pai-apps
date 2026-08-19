import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Eye,
  FileCheck,
  Maximize2,
} from 'lucide-react';
import { useSertifikasi } from '../../hooks/useSertifikasi';
import { Sertifikasi } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const SertifikasiSection: React.FC = () => {
  const { sertifikasiList, isLoading } = useSertifikasi();
  const [selectedCertIndex, setSelectedCertIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'certificate' | 'badge'>('certificate');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; link?: string } | null>(null);

  const activeCert: Sertifikasi | undefined = sertifikasiList[selectedCertIndex] || sertifikasiList[0];

  return (
    <section id="sertifikasi" className="py-16 md:py-24 relative overflow-hidden bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/80">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Kredibilitas & Kompetensi Pendidik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Sertifikasi Resmi Google for Education
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Pengakuan kompetensi pedagogik digital dan implementasi kecerdasan buatan (Gemini AI) berskala internasional dari Google for Education & Accredible.
            </p>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('certificate')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'certificate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Sertifikat Lengkap</span>
            </button>
            <button
              onClick={() => setViewMode('badge')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'badge'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Badge Kredensial</span>
            </button>
          </div>
        </div>

        {/* Interactive Showcase: Featured Spotlight + Selector Grid */}
        {isLoading ? (
          <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ) : activeCert ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Col (7 cols): Big Interactive Certificate Preview */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <Card className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between h-full group">
                {/* Top Google Colors Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-red-500 to-amber-500" />

                <div className="space-y-4">
                  {/* Image Container with Zoom Button */}
                  <div
                    className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950/5 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 cursor-pointer shadow-inner"
                    onClick={() =>
                      setLightboxImage({
                        url:
                          viewMode === 'certificate'
                            ? activeCert.certificate_url || activeCert.badge_url || ''
                            : activeCert.badge_url || '',
                        title: activeCert.judul,
                        link: activeCert.link_verifikasi || undefined,
                      })
                    }
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${activeCert.id}-${viewMode}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.3 }}
                        src={
                          viewMode === 'certificate'
                            ? activeCert.certificate_url || activeCert.badge_url || ''
                            : activeCert.badge_url || ''
                        }
                        alt={activeCert.judul}
                        className={`w-full h-full object-contain ${
                          viewMode === 'badge' ? 'p-8 max-h-72' : 'p-2'
                        } transition-transform duration-500 group-hover:scale-[1.02]`}
                      />
                    </AnimatePresence>

                    <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>

                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[11px] font-medium backdrop-blur-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Diberikan kepada: <strong>Aji Bagus Khoiri</strong></span>
                    </div>
                  </div>

                  {/* Cert Info Under Preview */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                        {activeCert.judul}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Penerbit: <strong className="text-slate-700 dark:text-slate-300">{activeCert.penerbit}</strong> • Tahun {activeCert.tahun}
                      </p>
                    </div>

                    {activeCert.link_verifikasi && (
                      <a
                        href={activeCert.link_verifikasi}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 shrink-0"
                      >
                        <span>Verifikasi di Accredible</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Col (5 cols): Certificate Selection List */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div className="space-y-1 pb-1">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Daftar Sertifikasi Resmi ({sertifikasiList.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Klik sertifikasi di bawah untuk melihat dokumen dan detailnya:
                </p>
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-between">
                {sertifikasiList.map((item: Sertifikasi, idx: number) => {
                  const isSelected = selectedCertIndex === idx;
                  const isGemini = item.judul.toLowerCase().includes('gemini');

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCertIndex(idx)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 border-blue-500 dark:border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                          : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Thumbnail Badge */}
                      <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
                        <img
                          src={item.badge_url || item.certificate_url || ''}
                          alt={item.judul}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={isGemini ? 'purple' : 'blue'} size="sm">
                            {item.kategori}
                          </Badge>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              Aktif Dipratinjau
                            </span>
                          )}
                        </div>

                        <h5 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                          {item.judul}
                        </h5>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>{item.penerbit}</span>
                          <span className="font-mono text-slate-500">ID: {item.nomor_sertifikat}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Verifier Info Box */}
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-bold">Keaslian Terjamin & Terverifikasi Blockchain</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400">
                    Sertifikasi ini diterbitkan resmi oleh Google for Education melalui platform kredensial digital global Accredible.
                  </p>
                </div>
              </div>

            </div>

          </div>
        ) : null}

      </div>

      {/* Fullscreen Lightbox Modal */}
      <Modal
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        title={lightboxImage?.title}
        size="xl"
      >
        {lightboxImage && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-950 p-2 sm:p-4 flex items-center justify-center shadow-inner">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Penerima Sertifikat: <strong>Aji Bagus Khoiri</strong>
              </span>
              {lightboxImage.link && (
                <a
                  href={lightboxImage.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span>Buka Verifikasi Asli di Accredible</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
