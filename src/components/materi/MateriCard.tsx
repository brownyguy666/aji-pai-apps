import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Eye, FileText, Download, ArrowRight } from 'lucide-react';
import { MateriPAI } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, getFileBadgeColor } from '../../lib/utils';

export interface MateriCardProps {
  materi: MateriPAI;
}

export const MateriCard: React.FC<MateriCardProps> = ({ materi }) => {
  return (
    <Card hoverEffect className="overflow-hidden flex flex-col h-full group bg-white dark:bg-slate-900">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={materi.gambar_cover_url || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'}
          alt={materi.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Category Pill on image */}
        {materi.kategori && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-600/90 text-white backdrop-blur-md shadow-sm">
              {materi.kategori.nama}
            </span>
          </div>
        )}

        {/* Date on bottom right of image */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 text-xs text-white/90 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(materi.created_at)}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link to={`/materi/${materi.slug}`} className="block">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
              {materi.judul}
            </h3>
          </Link>
          
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {materi.deskripsi_singkat || materi.konten.replace(/#|\*|_/g, '').substring(0, 140) + '...'}
          </p>
        </div>

        {/* Files Attachments Preview if available */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {materi.files && materi.files.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <FileText className="w-3 h-3 text-brand-500" />
                Lampiran:
              </span>
              {materi.files.slice(0, 2).map((f) => (
                <a
                  key={f.id}
                  href={f.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${getFileBadgeColor(f.tipe)} hover:opacity-80 transition-opacity`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-2.5 h-2.5" />
                  {f.tipe.toUpperCase()}
                </a>
              ))}
              {materi.files.length > 2 && (
                <span className="text-[11px] text-slate-400 font-medium">
                  +{materi.files.length - 2} lagi
                </span>
              )}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{materi.view_count || 0} dilihat</span>
            </div>

            <Link
              to={`/materi/${materi.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group/link"
            >
              <span>Baca Modul</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
