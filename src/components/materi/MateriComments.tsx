import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';
import { useKomentar } from '../../hooks/useKomentar';
import { formatDate } from '../../lib/utils';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface MateriCommentsProps {
  materiId: string;
}

export const MateriComments: React.FC<MateriCommentsProps> = ({ materiId }) => {
  const { komentarList, addComment, isAdding } = useKomentar({ materiId, status: 'approved' });
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [konten, setKonten] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !email.trim() || !konten.trim()) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    try {
      setErrorMsg('');
      await addComment({
        materi_id: materiId,
        nama: nama.trim(),
        email: email.trim(),
        konten: konten.trim(),
      });
      setSubmitted(true);
      setNama('');
      setEmail('');
      setKonten('');
    } catch (err) {
      setErrorMsg('Gagal mengirim komentar. Silakan coba lagi.');
    }
  };

  return (
    <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-8" aria-label="Kolom Diskusi & Komentar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Diskusi & Komentar ({komentarList.length})
            </h3>
            <p className="text-xs text-slate-400">
              Sampaikan tanggapan, pertanyaan, atau masukan terkait materi pembelajaran ini.
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Tulis Komentar / Pertanyaan
        </h4>

        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm space-y-1 animate-fade-in"
          >
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Komentar Berhasil Terkirim!</span>
            </div>
            <p className="text-emerald-700 dark:text-emerald-400 pl-6">
              Komentar Anda telah masuk ke antrean moderasi dan akan tampil setelah disetujui oleh pengelola website.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Siti Aisyah"
              />
              <Input
                label="Alamat Email (Tidak dipublikasikan)"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siti@sekolah.sch.id"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="komentar-konten" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Isi Komentar / Tanggapan
              </label>
              <textarea
                id="komentar-konten"
                rows={3}
                required
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                placeholder="Tuliskan pertanyaan, diskusi dalil, atau apresiasi Anda di sini..."
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Komentar akan dimoderasi sebelum tampil publik.</span>
              </p>
              <Button type="submit" variant="primary" size="md" isLoading={isAdding}>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Kirim Komentar
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Approved Comments List */}
      <div className="space-y-3">
        {komentarList.length === 0 ? (
          <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            Belum ada komentar pada materi ini. Jadilah yang pertama berkomentar!
          </div>
        ) : (
          komentarList.map((k) => (
            <div
              key={k.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                    {k.nama.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {k.nama}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(k.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-10 leading-relaxed">
                {k.konten}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
