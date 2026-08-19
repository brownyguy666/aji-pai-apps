import React from 'react';
import { BookOpen, Download, ExternalLink, FileText, Bookmark, Calendar, Globe } from 'lucide-react';
import { EBook, EBookFormat } from '../../types/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface EbookCardProps {
  ebook: EBook;
  onRead: (ebook: EBook) => void;
}

export const EbookCard: React.FC<EbookCardProps> = ({ ebook, onRead }) => {
  const getFormatBadge = (format: EBookFormat) => {
    switch (format) {
      case 'epub':
        return <Badge variant="purple" size="sm" className="font-mono font-bold uppercase">EPUB</Badge>;
      case 'pdf':
        return <Badge variant="rose" size="sm" className="font-mono font-bold uppercase">PDF</Badge>;
      case 'mobi':
        return <Badge variant="amber" size="sm" className="font-mono font-bold uppercase">MOBI</Badge>;
      case 'azw3':
        return <Badge variant="blue" size="sm" className="font-mono font-bold uppercase">AZW3</Badge>;
      case 'onedrive':
        return <Badge variant="brand" size="sm" className="font-mono font-bold uppercase">OneDrive</Badge>;
      default:
        return <Badge variant="slate" size="sm" className="font-mono font-bold uppercase">{format}</Badge>;
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 group">
      {/* Cover Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={ebook.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={ebook.judul}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {getFormatBadge(ebook.format_file)}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
              {ebook.bahasa}
            </span>
          </div>

          {ebook.is_featured && (
            <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30" title="Koleksi Unggulan">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </span>
          )}
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300">
            {ebook.kategori}
          </span>
          <h3 className="font-display font-bold text-base line-clamp-1 group-hover:text-brand-300 transition-colors drop-shadow-sm">
            {ebook.judul}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 line-clamp-1">
              ✍️ {ebook.penulis_pengarang}
            </p>
            {ebook.penerbit_pentahqiq && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                🏛️ {ebook.penerbit_pentahqiq}
              </p>
            )}
          </div>

          {ebook.deskripsi && (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {ebook.deskripsi}
            </p>
          )}

          {/* Meta Info: Year & Pages */}
          <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800">
            {ebook.tahun_terbit && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{ebook.tahun_terbit}</span>
              </span>
            )}
            {ebook.jumlah_halaman && (
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>{ebook.jumlah_halaman} Hlm</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onRead(ebook)}
            className="flex-1 shadow-md shadow-brand-600/20"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Baca Online
          </Button>

          {ebook.file_url && (
            <a
              href={ebook.file_url}
              download
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              title="Unduh File E-Book"
              aria-label={`Unduh ${ebook.judul}`}
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};
