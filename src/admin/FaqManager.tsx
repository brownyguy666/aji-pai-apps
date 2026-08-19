import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useFAQ } from '../hooks/useFAQ';
import { FAQ } from '../types/database';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { useToast } from '../components/ui/Toast';

export const FaqManager: React.FC = () => {
  const { faqList, createFAQ, updateFAQ, deleteFAQ, isLoading } = useFAQ();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);

  const [pertanyaan, setPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [kategori, setKategori] = useState('Materi & Unduhan');
  const [urutan, setUrutan] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingItem(null);
    setPertanyaan('');
    setJawaban('');
    setKategori('Materi & Unduhan');
    setUrutan(faqList.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: FAQ) => {
    setEditingItem(item);
    setPertanyaan(item.pertanyaan);
    setJawaban(item.jawaban);
    setKategori(item.kategori || 'Umum');
    setUrutan(item.urutan || 1);
    setIsActive(item.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaan.trim() || !jawaban.trim()) return;

    try {
      if (editingItem) {
        await updateFAQ({
          id: editingItem.id,
          updates: {
            pertanyaan,
            jawaban,
            kategori,
            urutan: Number(urutan),
            is_active: isActive,
          },
        });
        success('Pertanyaan FAQ berhasil diperbarui!');
      } else {
        await createFAQ({
          pertanyaan,
          jawaban,
          kategori,
          urutan: Number(urutan),
          is_active: isActive,
        });
        success('Pertanyaan FAQ baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch {
      toastError('Gagal menyimpan FAQ.');
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await updateFAQ({ id, updates: { is_active: !current } });
      success(`FAQ ${!current ? 'diaktifkan' : 'dinonaktifkan'}!`);
    } catch {
      toastError('Gagal memperbarui status FAQ.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pertanyaan FAQ ini?')) return;
    try {
      await deleteFAQ(id);
      success('FAQ berhasil dihapus.');
    } catch {
      toastError('Gagal menghapus FAQ.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Manajemen Tanya Jawab (FAQ)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola daftar pertanyaan yang sering diajukan seputar materi, modul ajar, dan workshop di halaman depan.
          </p>
        </div>

        <Button type="button" variant="primary" size="md" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Tanya Jawab Baru
        </Button>
      </div>

      {/* FAQ List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : faqList.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-white dark:bg-slate-900">
          <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Belum ada item FAQ yang dibuat.
          </h3>
        </Card>
      ) : (
        <div className="space-y-3">
          {faqList.map((item) => (
            <Card key={item.id} className="p-5 flex items-start justify-between gap-4 bg-white dark:bg-slate-900 border">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    {item.kategori}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Urutan #{item.urutan}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                  {item.pertanyaan}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.jawaban}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={item.is_active}
                  onChange={() => handleToggleActive(item.id, item.is_active)}
                  label={item.is_active ? 'Aktif' : 'Nonaktif'}
                />

                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                  title="Hapus FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Pertanyaan"
            required
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            placeholder="Contoh: Apakah modul ajar di website ini bisa diunduh gratis?"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Jawaban Lengkap
            </label>
            <textarea
              rows={4}
              required
              value={jawaban}
              onChange={(e) => setJawaban(e.target.value)}
              placeholder="Tuliskan jawaban yang jelas dan informatif..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Kategori Topik
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm"
              >
                <option value="Materi & Unduhan">Materi & Unduhan</option>
                <option value="Teknis & Akses">Teknis & Akses</option>
                <option value="Kolaborasi & Undangan">Kolaborasi & Undangan</option>
                <option value="Kredensial">Kredensial</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <Input
              label="Urutan Tampil"
              type="number"
              value={urutan.toString()}
              onChange={(e) => setUrutan(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch
              checked={isActive}
              onChange={setIsActive}
              label="Tampilkan di Landing Page"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan FAQ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
