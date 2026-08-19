import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  ExternalLink,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { useMateri } from '../hooks/useMateri';
import { useCategories } from '../hooks/useCategories';
import { MateriPAI } from '../types/database';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatDate } from '../lib/utils';
import { useToast } from '../components/ui/Toast';

export const MateriManager: React.FC = () => {
  const { materiList, isLoading, deleteMateri } = useMateri({ status: 'all' });
  const { categories } = useCategories();
  const { success, error: toastError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = materiList.filter((m) => {
    const matchesSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deskripsi_singkat?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.kategori_id === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMateri(deletingId);
      success('Materi berhasil dihapus.');
      setDeletingId(null);
    } catch (err) {
      toastError('Gagal menghapus materi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Manajemen Materi & Modul PAI
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola artikel, modul ajar interaktif, lampiran file unduhan, dan kategori bertingkat.
          </p>
        </div>

        <Link to="/admin/materi/new">
          <Button variant="primary" size="md" className="shadow-md shadow-brand-600/20">
            <Plus className="w-4 h-4 mr-1.5" />
            Tulis Materi Baru
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul materi..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Semua Status</option>
              <option value="published">Tayang (Published)</option>
              <option value="draft">Draf (Draft)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Materi Table / List */}
      <Card className="overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Materi & Cover</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Lampiran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Dibuat</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Memuat materi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 space-y-2">
                    <p className="text-slate-500 font-medium">Tidak ada materi yang ditemukan</p>
                    <Link to="/admin/materi/new">
                      <Button variant="outline" size="sm">
                        Buat Materi Sekarang
                      </Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Title and Cover */}
                    <td className="px-6 py-4 min-w-[280px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.gambar_cover_url ||
                            'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={item.judul}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/materi/edit/${item.id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1"
                          >
                            {item.judul}
                          </Link>
                          <span className="text-xs text-slate-400 font-mono">
                            /{item.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {item.kategori ? (
                        <Badge variant="brand" size="sm">
                          {item.kategori.nama}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Tanpa Kategori</span>
                      )}
                    </td>

                    {/* Attachments */}
                    <td className="px-6 py-4">
                      {item.files && item.files.length > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                          <FileText className="w-3.5 h-3.5 text-brand-500" />
                          <span>{item.files.length} file</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {item.status === 'published' ? (
                        <Badge variant="brand" size="sm">Tayang</Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">Draf</Badge>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(item.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/materi/${item.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Lihat Pratinjau Publik"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/materi/edit/${item.id}`}
                          className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Edit Materi"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Hapus Materi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus Materi PAI"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus materi ini beserta seluruh file lampirannya? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeletingId(null)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Ya, Hapus Sekarang
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
