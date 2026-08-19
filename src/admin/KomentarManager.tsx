import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Check,
  X,
  ExternalLink,
  Mail,
  User,
} from 'lucide-react';
import { useKomentar, KentarCommentWithMateri } from '../hooks/useKomentar';
import { formatDate } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export const KomentarManager: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const {
    komentarList,
    pendingCount,
    updateStatus,
    deleteComment,
    isUpdatingStatus,
    isLoading,
  } = useKomentar({ status: filterStatus });
  const { success, error: toastError } = useToast();

  const handleApprove = async (id: string) => {
    try {
      await updateStatus({ id, newStatus: 'approved' });
      success('Komentar berhasil disetujui dan kini tampil untuk publik!');
    } catch {
      toastError('Gagal menyetujui komentar.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateStatus({ id, newStatus: 'rejected' });
      success('Komentar berhasil ditolak.');
    } catch {
      toastError('Gagal menolak komentar.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini secara permanen?')) return;
    try {
      await deleteComment(id);
      success('Komentar berhasil dihapus.');
    } catch {
      toastError('Gagal menghapus komentar.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="brand">Disetujui (Tayang)</Badge>;
      case 'rejected':
        return <Badge variant="rose">Ditolak</Badge>;
      default:
        return <Badge variant="amber">Menunggu Moderasi</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600">
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Moderasi Komentar Artikel PAI
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tinjau, setujui (*Approve*), atau tolak (*Reject*) tanggapan siswa dan pembaca sebelum tampil di halaman materi.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        {[
          { key: 'all', label: 'Semua Komentar' },
          { key: 'pending', label: `Menunggu Moderasi (${pendingCount})` },
          { key: 'approved', label: 'Disetujui' },
          { key: 'rejected', label: 'Ditolak' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterStatus(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === tab.key
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : komentarList.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-white dark:bg-slate-900">
          <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Tidak ada komentar pada status ini.
          </h3>
          <p className="text-xs text-slate-400">
            Komentar baru dari pengunjung website akan masuk secara otomatis ke status pending di sini.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {komentarList.map((k: KentarCommentWithMateri) => (
            <Card key={k.id} className="p-5 space-y-3 bg-white dark:bg-slate-900 border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-sm flex items-center justify-center">
                    {k.nama.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {k.nama}
                      </h4>
                      {getStatusBadge(k.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {k.email}
                      </span>
                      <span>•</span>
                      <span>{formatDate(k.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Article Reference Info */}
                {k.materi && (
                  <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Artikel:</span>
                    <a
                      href={`/materi/${k.materi.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{k.materi.judul}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                "{k.konten}"
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {k.status !== 'approved' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => handleApprove(k.id)}
                    isLoading={isUpdatingStatus}
                    className="text-xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Setujui (Approve)
                  </Button>
                )}

                {k.status !== 'rejected' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(k.id)}
                    isLoading={isUpdatingStatus}
                    className="text-xs text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Tolak (Reject)
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(k.id)}
                  className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Hapus permanen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
