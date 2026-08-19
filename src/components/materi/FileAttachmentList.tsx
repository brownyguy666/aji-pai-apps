import React from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, Paperclip, ExternalLink } from 'lucide-react';
import { MateriFile } from '../../types/database';
import { formatBytes, getFileBadgeColor } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface FileAttachmentListProps {
  files: MateriFile[];
}

export const FileAttachmentList: React.FC<FileAttachmentListProps> = ({ files }) => {
  if (!files || files.length === 0) return null;

  const getFileIcon = (tipe: string) => {
    switch (tipe.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'ppt':
      case 'pptx':
        return <FileCode className="w-6 h-6 text-amber-500" />;
      case 'excel':
      case 'xlsx':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      default:
        return <FileText className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center">
          <Paperclip className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Dokumen & File Lampiran Materi ({files.length})
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unduh file modul ajar, lembar kerja, dan slide presentasi untuk pembelajaran.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 group-hover:scale-105 transition-transform">
                {getFileIcon(file.tipe)}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {file.nama_file}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className={`px-1.5 py-0.2 rounded font-bold border uppercase text-[9px] ${getFileBadgeColor(file.tipe)}`}>
                    {file.tipe}
                  </span>
                  {file.ukuran_bytes ? <span>{formatBytes(file.ukuran_bytes)}</span> : null}
                </div>
              </div>
            </div>

            <a
              href={file.file_url}
              download={file.nama_file}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-600 dark:hover:text-white transition-all shadow-sm shrink-0"
              title="Unduh File"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
