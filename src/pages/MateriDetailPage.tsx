import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Share2,
  Check,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { useMateriDetail, useMateri } from '../hooks/useMateri';
import { useProfile } from '../hooks/useProfile';
import { MateriPAI } from '../types/database';
import { FileAttachmentList } from '../components/materi/FileAttachmentList';
import { MateriCard } from '../components/materi/MateriCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/utils';
import { useToast } from '../components/ui/Toast';

export const MateriDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: materi, isLoading, isError } = useMateriDetail(slug);
  const { materiList } = useMateri({ status: 'published' });
  const { profile } = useProfile();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    success('Tautan materi berhasil disalin!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${materi?.judul}*\n\nBaca artikel & download modul selengkapnya di: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (isError || !materi) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Materi Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-500">
          Artikel atau modul yang Anda cari mungkin telah dipindahkan atau dihapus.
        </p>
        <Link to="/materi">
          <Button variant="primary">Kembali ke Daftar Materi</Button>
        </Link>
      </div>
    );
  }

  const relatedMateri = materiList.filter((m: MateriPAI) => m.id !== materi.id).slice(0, 2);

  return (
    <article className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="flex items-center gap-2">
          {materi.kategori && (
            <Link to={`/materi?category=${materi.kategori.id}`}>
              <Badge variant="brand">{materi.kategori.nama}</Badge>
            </Link>
          )}
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-display leading-[1.25]">
          {materi.judul}
        </h1>

        {materi.deskripsi_singkat && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {materi.deskripsi_singkat}
          </p>
        )}

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 pb-4 border-y border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src={profile.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={profile.nama}
              className="w-10 h-10 rounded-full object-cover border border-brand-500"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{profile.nama}</div>
              <div className="flex items-center gap-2 text-xs">
                <span>{formatDate(materi.created_at)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {materi.view_count || 0} pembaca
                </span>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
              title="Bagikan ke WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors font-medium text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin' : 'Salin Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {materi.gambar_cover_url && (
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 aspect-[16/9] bg-slate-900">
          <img
            src={materi.gambar_cover_url}
            alt={materi.judul}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Markdown Content Body */}
      <div className="prose prose-slate dark:prose-invert max-w-none py-4 space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
        {materi.konten.split('\n\n').map((paragraph: string, idx: number) => {
          if (paragraph.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 font-display">
                {paragraph.replace('# ', '')}
              </h1>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3 font-display">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2 font-display">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 p-4 rounded-r-2xl italic my-4 text-slate-800 dark:text-slate-200">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* File Attachment Download Component */}
      {materi.files && materi.files.length > 0 && (
        <FileAttachmentList files={materi.files} />
      )}

      {/* Related Materi Section */}
      {relatedMateri.length > 0 && (
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Materi PAI Terkait Lainnya
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedMateri.map((rel: MateriPAI) => (
              <MateriCard key={rel.id} materi={rel} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
