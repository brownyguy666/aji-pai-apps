import React, { useState } from 'react';
import { Languages, Plus, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { useTerjemahan } from '../hooks/useTerjemahan';
import { ProyekTerjemahan } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

export const TerjemahanManager: React.FC = () => {
  const { terjemahanList, isLoading, createTerjemahan, updateTerjemahan, deleteTerjemahan } =
    useTerjemahan();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProyekTerjemahan | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: '',
    link_file: '',
    tahun: new Date().getFullYear(),
    urutan: 1,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      bahasa_asal: 'Bahasa Arab',
      bahasa_tujuan: 'Bahasa Indonesia',
      deskripsi: '',
      link_file: '',
      tahun: new Date().getFullYear(),
      urutan: terjemahanList.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ProyekTerjemahan) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      bahasa_asal: item.bahasa_asal,
      bahasa_tujuan: item.bahasa_tujuan,
      deskripsi: item.deskripsi || '',
      link_file: item.link_file || '',
      tahun: item.tahun,
      urutan: item.urutan,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim()) return;

    try {
      if (editingItem) {
        await updateTerjemahan({
          id: editingItem.id,
          ...formData,
        });
        success('Proyek terjemahan berhasil diperbarui!');
      } else {
        await createTerjemahan(formData);
        success('Proyek terjemahan baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch (err) {
      toastError('Gagal menyimpan proyek terjemahan.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTerjemahan(deletingId);
      success('Proyek terjemahan berhasil dihapus.');
      setDeletingId(null);
    } catch (err) {
      toastError('Gagal menghapus proyek terjemahan.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <Languages className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Manajemen Proyek Terjemahan Kitab
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola daftar karya alih bahasa turats, link naskah digital, bahasa asal, dan tahun rilis.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Terjemahan Baru
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Judul Terjemahan</th>
                <th className="px-6 py-4">Pasangan Bahasa</th>
                <th className="px-6 py-4">Tahun</th>
                <th className="px-6 py-4">Link Naskah</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : terjemahanList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    Belum ada proyek terjemahan.
                  </td>
                </tr>
              ) : (
                terjemahanList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {item.judul}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {item.bahasa_asal} ➔ {item.bahasa_tujuan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {item.tahun}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {item.link_file ? (
                        <a
                          href={item.link_file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Buka File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Proyek Terjemahan' : 'Tambah Proyek Terjemahan'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Terjemahan Kitab / Buku"
            required
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Contoh: Terjemahan & Syarah Matan Al-Ghayah wa At-Taqrib"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Bahasa Asal"
              required
              value={formData.bahasa_asal}
              onChange={(e) => setFormData({ ...formData, bahasa_asal: e.target.value })}
            />
            <Input
              label="Bahasa Tujuan"
              required
              value={formData.bahasa_tujuan}
              onChange={(e) => setFormData({ ...formData, bahasa_tujuan: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tahun Terbit / Selesai"
              type="number"
              required
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || 2024 })}
            />
            <Input
              label="Nomor Urutan"
              type="number"
              value={formData.urutan}
              onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
            />
          </div>

          <Input
            label="Link File / Tautan Naskah Digital (Opsional)"
            value={formData.link_file}
            onChange={(e) => setFormData({ ...formData, link_file: e.target.value })}
            placeholder="https://archive.org/..."
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Deskripsi & Anotasi Singkat
            </label>
            <textarea
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Jelaskan ringkasan bab kitab, metode penerjemahan, dan faedah naskah..."
              className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Simpan Perubahan' : 'Tambah Terjemahan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus Terjemahan"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus data proyek terjemahan ini?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeletingId(null)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
