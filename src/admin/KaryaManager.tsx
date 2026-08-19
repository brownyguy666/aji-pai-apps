import React, { useState } from 'react';
import { Palette, Plus, Edit, Trash2, Upload, ExternalLink, Camera } from 'lucide-react';
import { useKarya } from '../hooks/useKarya';
import { Karya } from '../types/database';
import { uploadImage } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

export const KaryaManager: React.FC = () => {
  const { karyaList, isLoading, createKarya, updateKarya, deleteKarya } = useKarya();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Karya | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    gambar_url: '',
    link_eksternal: '',
    kategori: 'Infografis',
    urutan: 1,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      deskripsi: '',
      gambar_url: '',
      link_eksternal: '',
      kategori: 'Infografis',
      urutan: karyaList.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Karya) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      gambar_url: item.gambar_url || '',
      link_eksternal: item.link_eksternal || item.link_terkait || '',
      kategori: item.kategori,
      urutan: item.urutan,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, 'karya');
      setFormData((prev) => ({ ...prev, gambar_url: url }));
      success('Gambar karya berhasil diunggah!');
    } catch (err) {
      toastError('Gagal mengunggah gambar karya.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.gambar_url.trim()) {
      toastError('Judul dan gambar karya wajib diisi.');
      return;
    }

    try {
      if (editingItem) {
        await updateKarya({
          id: editingItem.id,
          ...formData,
        });
        success('Karya berhasil diperbarui!');
      } else {
        await createKarya(formData);
        success('Karya baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch (err) {
      toastError('Gagal menyimpan karya.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteKarya(deletingId);
      success('Karya berhasil dihapus.');
      setDeletingId(null);
    } catch (err) {
      toastError('Gagal menghapus karya.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600">
              <Palette className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Manajemen Galeri Karya & Publikasi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola foto portofolio infografis, e-book, modul ajar, dan media animasi edukasi.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Karya Baru
        </Button>
      </div>

      {/* Grid of Karya */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400">Memuat karya...</div>
      ) : karyaList.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">Belum ada karya ditambahkan.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {karyaList.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={item.gambar_url || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'}
                    alt={item.judul}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="brand" size="sm">
                      {item.kategori}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                    {item.judul}
                  </h3>
                  {item.deskripsi && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400 font-mono">Urutan #{item.urutan}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Karya Portofolio' : 'Tambah Karya Portofolio'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Karya"
            required
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Contoh: Infografis Alur Wudhu & Shalat Sesuai Sunnah"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Kategori Karya
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="Infografis">Infografis</option>
                <option value="Buku Digital">Buku Digital</option>
                <option value="Modul Ajar">Modul Ajar</option>
                <option value="Video Animasi">Video Animasi</option>
                <option value="Desain Pembelajaran">Desain Pembelajaran</option>
              </select>
            </div>

            <Input
              label="Nomor Urutan"
              type="number"
              value={formData.urutan}
              onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
            />
          </div>

          {/* Image Uploader */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Gambar / Thumbnail Karya
            </label>
            {formData.gambar_url ? (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img
                  src={formData.gambar_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <label className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>{uploadingImage ? 'Mengunggah...' : 'Unggah File Gambar'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                disabled={uploadingImage}
              />
            </label>
          </div>

          <Input
            label="Link Eksternal (Opsional)"
            value={formData.link_eksternal}
            onChange={(e) => setFormData({ ...formData, link_eksternal: e.target.value })}
            placeholder="https://behance.net/... atau link download"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Deskripsi Singkat Karya
            </label>
            <textarea
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Deskripsi keunggulan, tujuan pembuatan, dan sasaran peserta didik..."
              className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Simpan Perubahan' : 'Tambah Karya'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus Karya"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus karya ini dari galeri?
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
