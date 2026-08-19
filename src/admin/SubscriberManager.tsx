import React from 'react';
import { Mail, Download, Trash2, Users, Calendar } from 'lucide-react';
import { useSubscriber } from '../hooks/useSubscriber';
import { formatDate } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export const SubscriberManager: React.FC = () => {
  const { subscribers, deleteSubscriber, exportToCSV, isLoading } = useSubscriber();
  const { success, error: toastError } = useToast();

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Hapus ${email} dari daftar subscriber?`)) return;
    try {
      await deleteSubscriber(id);
      success('Subscriber berhasil dihapus.');
    } catch {
      toastError('Gagal menghapus subscriber.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Pelanggan Newsletter ({subscribers.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daftar alamat email guru dan siswa yang mendaftar untuk menerima pemberitahuan modul & materi PAI baru.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={exportToCSV}
          disabled={subscribers.length === 0}
        >
          <Download className="w-4 h-4 mr-1.5" />
          Ekspor ke CSV / Excel
        </Button>
      </div>

      {/* Subscriber Table */}
      <Card className="overflow-hidden bg-white dark:bg-slate-900 border">
        {isLoading ? (
          <div className="p-8 text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent mx-auto" />
            <p className="text-xs text-slate-400">Memuat data subscriber...</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Belum ada email yang berlangganan newsletter.
            </h3>
            <p className="text-xs text-slate-400">
              Formulir langganan aktif di bagian footer dan di bawah tiap artikel materi.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">No</th>
                  <th className="px-6 py-3.5">Alamat Email</th>
                  <th className="px-6 py-3.5">Tanggal Berlangganan</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscribers.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        <span>{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(sub.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Hapus subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
