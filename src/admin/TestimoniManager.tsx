import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Check,
  X,
  Star,
  User,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { useTestimoni } from '../hooks/useTestimoni';
import { Testimoni } from '../types/database';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const TestimoniManager: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const {
    testimoniList,
    pendingCount,
    addTestimoni,
    updateTestimoni,
    deleteTestimoni,
    isLoading,
  } = useTestimoni({ status: filterStatus });
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimoni | null>(null);

  const [nama, setNama] = useState('');
  const [peranInstansi, setPeranInstansi] = useState('');
  const [konten, setKonten] = useState('');
  const [rating, setRating] = useState(5);
  const [fotoUrl, setFotoUrl] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setNama('');
    setPeranInstansi('');
    setKonten('');
    setRating(5);
    setFotoUrl('');
    setModalOpen(true);
  };

  const openEditModal = (item: Testimoni) => {
    setEditingItem(item);
    setNama(item.nama);
    setPeranInstansi(item.peran_instansi);
    setKonten(item.konten);
    setRating(item.rating || 5);
    setFotoUrl(item.foto_url || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !konten.trim()) return;

    try {
      if (editingItem) {
        await updateTestimoni({
          id: editingItem.id,
          updates: {
            nama,
            peran_instansi: peranInstansi,
            konten,
            rating,
            foto_url: fotoUrl || null,
          },
        });
        success('Testimoni berhasil diperbarui!');
      } else {
        await addTestimoni({
          nama,
          peran_instansi: peranInstansi,
          konten,
          rating,
          foto_url: fotoUrl || undefined,
        });
        success('Testimoni baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch {
      toastError('Gagal menyimpan testimoni.');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateTestimoni({ id, updates: { status: 'approved' } });
      success('Testimoni disetujui untuk tampil di beranda!');
    } catch {
      toastError('Gagal menyetujui testimoni.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateTestimoni({ id, updates: { status: 'rejected' } });
      success('Testimoni ditolak.');
    } catch {
      toastError('Gagal menolak testimoni.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus testimoni ini?')) return;
    try {
      await deleteTestimoni(id);
      success('Testimoni berhasil dihapus.');
    } catch {
      toastError('Gagal menghapus testimoni.');
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
              Manajemen Testimoni & Kesan Pembaca
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-pulse">
                {pendingCount} Masuk
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola testimoni siswa, alumni, dan rekan guru yang ditampilkan di landing page.
          </p>
        </div>

        <Button type="button" variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Testimoni Manual
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'pending', label: `Perlu Ditinjau (${pendingCount})` },
          { key: 'approved', label: 'Ditampilkan di Beranda' },
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

      {/* Testimonials List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : testimoniList.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-white dark:bg-slate-900">
          <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Belum ada testimoni pada status ini.
          </h3>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimoniList.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 border">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <Badge
                    variant={
                      item.status === 'approved'
                        ? 'brand'
                        : item.status === 'rejected'
                        ? 'rose'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.konten}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.nama}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.peran_instansi}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {item.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                      title="Setujui (Approve)"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                      title="Tolak (Reject)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Testimoni' : 'Tambah Testimoni'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nama Lengkap"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Ahmad Fauzi, M.Pd."
          />

          <Input
            label="Peran / Asal Instansi"
            required
            value={peranInstansi}
            onChange={(e) => setPeranInstansi(e.target.value)}
            placeholder="Contoh: Ketua MGMP PAI SMP Kab. Banyuwangi"
          />

          <Input
            label="Tautan Foto (Opsional URL)"
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            placeholder="https://..."
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Rating Bintang
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 text-slate-300 hover:text-amber-400"
                >
                  <Star
                    className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Isi Kesan / Testimoni
            </label>
            <textarea
              rows={4}
              required
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Testimoni
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
