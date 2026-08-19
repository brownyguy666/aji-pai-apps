import React, { useState } from 'react';
import { Plus, Edit, Trash2, Award, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSertifikasi } from '../hooks/useSertifikasi';
import { Sertifikasi } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export const SertifikasiManager: React.FC = () => {
  const { sertifikasiList, isLoading, createSertifikasi, updateSertifikasi, deleteSertifikasi } = useSertifikasi();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Sertifikasi | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    penerbit: 'Google for Education',
    nomor_sertifikat: '',
    link_verifikasi: 'https://educertifications.google/',
    badge_url: '',
    tahun: new Date().getFullYear(),
    kategori: 'Google for Education',
    urutan: 1,
    is_featured: true,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      penerbit: 'Google for Education',
      nomor_sertifikat: '',
      link_verifikasi: 'https://educertifications.google/',
      badge_url: '',
      tahun: new Date().getFullYear(),
      kategori: 'Google for Education',
      urutan: sertifikasiList.length + 1,
      is_featured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Sertifikasi) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      penerbit: item.penerbit,
      nomor_sertifikat: item.nomor_sertifikat || '',
      link_verifikasi: item.link_verifikasi || '',
      badge_url: item.badge_url || '',
      tahun: item.tahun,
      kategori: item.kategori,
      urutan: item.urutan,
      is_featured: item.is_featured,
    });
    setModalOpen(true);
  };

  const handleApplyPreset = (preset: 'gce1' | 'gce2' | 'trainer' | 'guru_pai') => {
    if (preset === 'gce1') {
      setFormData({
        ...formData,
        judul: 'Google Certified Educator Level 1',
        penerbit: 'Google for Education',
        link_verifikasi: 'https://educertifications.google/',
        kategori: 'Google for Education',
      });
    } else if (preset === 'gce2') {
      setFormData({
        ...formData,
        judul: 'Google Certified Educator Level 2',
        penerbit: 'Google for Education',
        link_verifikasi: 'https://educertifications.google/',
        kategori: 'Google for Education',
      });
    } else if (preset === 'trainer') {
      setFormData({
        ...formData,
        judul: 'Google Certified Trainer',
        penerbit: 'Google for Education',
        link_verifikasi: 'https://educertifications.google/',
        kategori: 'Google for Education',
      });
    } else if (preset === 'guru_pai') {
      setFormData({
        ...formData,
        judul: 'Sertifikat Pendidik Profesional (Gr.) Bidang PAI',
        penerbit: 'Kementerian Agama RI & Kemendikbudristek',
        link_verifikasi: 'https://simpatika.kemenag.go.id',
        kategori: 'Pendidikan Profesi Guru',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      toastError('Judul sertifikasi wajib diisi.');
      return;
    }

    try {
      if (editingItem) {
        await updateSertifikasi({
          id: editingItem.id,
          ...formData,
        });
        success('Sertifikasi berhasil diperbarui!');
      } else {
        await createSertifikasi(formData);
        success('Sertifikasi berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch (err) {
      toastError('Gagal menyimpan sertifikasi.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteSertifikasi(deletingId);
      success('Sertifikasi berhasil dihapus.');
      setDeletingId(null);
    } catch (err) {
      toastError('Gagal menghapus sertifikasi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Manajemen Sertifikasi & Kredensial Guru
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola sertifikasi resmi (Google Certified Educator, Kemdikbud, Kemenag) untuk ditampilkan di landing page.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Sertifikasi
        </Button>
      </div>

      {/* Grid of Certifications */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400">Memuat sertifikasi...</div>
      ) : sertifikasiList.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">Belum ada sertifikasi ditambahkan.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sertifikasiList.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={item.penerbit.toLowerCase().includes('google') ? 'blue' : 'brand'}>
                    {item.kategori}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">Tahun {item.tahun}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.penerbit}
                    </p>
                  </div>
                </div>

                {item.nomor_sertifikat && (
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {item.nomor_sertifikat}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {item.link_verifikasi ? (
                  <a
                    href={item.link_verifikasi}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>Cek Verifikasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Urutan #{item.urutan}</span>
                )}

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
        title={editingItem ? 'Edit Sertifikasi Kredensial' : 'Tambah Sertifikasi Kredensial'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Preset Buttons */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Template Cepat:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleApplyPreset('gce1')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
              >
                + Google Educator L1
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('gce2')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
              >
                + Google Educator L2
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('trainer')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200"
              >
                + Google Certified Trainer
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('guru_pai')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
              >
                + Pendidik Profesi PAI
              </button>
            </div>
          </div>

          <Input
            label="Nama Sertifikasi / Kredensial"
            required
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Contoh: Google Certified Educator Level 1"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lembaga Penerbit"
              required
              value={formData.penerbit}
              onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })}
              placeholder="Contoh: Google for Education"
            />
            <Input
              label="Kategori"
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              placeholder="Contoh: Google for Education"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nomor Sertifikat / Kredensial"
              value={formData.nomor_sertifikat}
              onChange={(e) => setFormData({ ...formData, nomor_sertifikat: e.target.value })}
              placeholder="Contoh: GCE-L1-829103"
            />
            <Input
              label="Tahun Perolehan"
              type="number"
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || 2024 })}
            />
          </div>

          <Input
            label="Link Verifikasi Resmi Kredensial"
            value={formData.link_verifikasi}
            onChange={(e) => setFormData({ ...formData, link_verifikasi: e.target.value })}
            placeholder="Contoh: https://educertifications.google/ atau link sertifikat"
            helperText="Pengunjung dapat mengklik tautan ini untuk memverifikasi keaslian sertifikat Anda."
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Simpan Perubahan' : 'Tambah Sertifikasi'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus Sertifikasi"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus sertifikasi ini?
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
