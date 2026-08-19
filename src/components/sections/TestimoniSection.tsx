import React, { useState } from 'react';
import { MessageSquare, Star, Quote, Plus, Send, CheckCircle2, User, Sparkles } from 'lucide-react';
import { useTestimoni } from '../../hooks/useTestimoni';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const TestimoniSection: React.FC = () => {
  const { testimoniList, addTestimoni, isAdding } = useTestimoni({ status: 'approved' });
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [peranInstansi, setPeranInstansi] = useState('');
  const [konten, setKonten] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !konten.trim()) return;

    await addTestimoni({
      nama,
      peran_instansi: peranInstansi.trim() || 'Pembaca / Peserta Didik',
      konten,
      rating,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setNama('');
      setPeranInstansi('');
      setKonten('');
    }, 2000);
  };

  return (
    <section id="testimoni" className="py-16 sm:py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kesan & Rekomendasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Testimoni Siswa, Guru & Rekan Sejawat
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Apresiasi dan dampak positif pemanfaatan modul ajar digital PAI, kajian kitab, serta workshop kurikulum merdeka.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setModalOpen(true)}
            className="self-start md:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5 text-brand-600" />
            Beri Testimoni Anda
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimoniList.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-800 group-hover:text-brand-100 dark:group-hover:text-brand-950/80 transition-colors">
                <Quote className="w-8 h-8 rotate-180" aria-hidden="true" />
              </div>

              <div className="space-y-3 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{t.konten}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {t.foto_url ? (
                    <img src={t.foto_url} alt={t.nama} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    t.nama.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {t.nama}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {t.peran_instansi}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Testimonial Submit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tulis Kesan & Testimoni Anda"
        description="Bagikan pengalaman Anda saat belajar PAI, menggunakan modul ajar, atau berkolaborasi dengan Pak Aji."
        size="md"
      >
        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Terima Kasih atas Testimoni Anda!
            </h3>
            <p className="text-xs text-slate-500">
              Testimoni Anda telah kami terima dan akan segera ditinjau oleh pengelola website sebelum ditampilkan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap / Gelar"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi, S.Pd. atau Siti Nurhaliza"
            />

            <Input
              label="Peran / Asal Instansi / Sekolah"
              required
              value={peranInstansi}
              onChange={(e) => setPeranInstansi(e.target.value)}
              placeholder="Contoh: Guru PAI SMP / Alumni Siswa SMPN 2 Glagah"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Rating Penilaian
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                  {rating} / 5 Bintang
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Isi Testimoni / Kesan Pembelajaran
              </label>
              <textarea
                rows={4}
                required
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                placeholder="Tuliskan pengalaman Anda mengenai metode pengajaran, kemudahan akses modul ajar, materi video, atau interaksi dengan Pak Aji..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" isLoading={isAdding}>
                <Send className="w-4 h-4 mr-1.5" />
                Kirim Testimoni
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
};
