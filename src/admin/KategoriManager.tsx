import React, { useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, Layers, Folder, FolderPlus, CheckCircle } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { KategoriMateri } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export const KategoriManager: React.FC = () => {
  const { categories, categoryTree, addCategory, updateCategory, deleteCategory, isLoading } =
    useCategories();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<KategoriMateri | null>(null);
  const [nama, setNama] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [urutan, setUrutan] = useState<number>(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAddModal = (defaultParentId = '') => {
    setEditingCategory(null);
    setNama('');
    setParentId(defaultParentId);
    setUrutan(categories.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (cat: KategoriMateri) => {
    setEditingCategory(cat);
    setNama(cat.nama);
    setParentId(cat.parent_id || '');
    setUrutan(cat.urutan || 1);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          nama,
          parent_id: parentId || null,
          urutan: Number(urutan),
        });
        success('Kategori berhasil diperbarui!');
      } else {
        await addCategory({
          nama,
          parent_id: parentId || null,
          urutan: Number(urutan),
        });
        success('Kategori baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch (err) {
      toastError('Gagal menyimpan kategori.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCategory(deletingId);
      success('Kategori berhasil dihapus.');
      setDeletingId(null);
    } catch (err) {
      toastError('Gagal menghapus kategori.');
    }
  };

  const renderTreeItem = (node: KategoriMateri, level = 0) => {
    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
            level === 0
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm font-semibold'
              : level === 1
              ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 ml-6 text-sm'
              : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200/40 dark:border-slate-800/60 ml-12 text-xs'
          }`}
        >
          <div className="flex items-center gap-3">
            {level === 0 ? (
              <div className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600">
                <Layers className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600">
                <Folder className="w-3.5 h-3.5" />
              </div>
            )}
            <div>
              <span className="text-slate-900 dark:text-white">{node.nama}</span>
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                (Level {level + 1}, Urutan: {node.urutan})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {level < 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAddModal(node.id)}
                className="text-xs text-brand-600 hover:text-brand-700"
                title="Tambah Sub-kategori di bawah ini"
              >
                <FolderPlus className="w-3.5 h-3.5 mr-1" />
                Tambah Sub
              </Button>
            )}
            <button
              onClick={() => openEditModal(node)}
              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg"
              title="Edit Kategori"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeletingId(node.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
              title="Hapus Kategori"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="space-y-1">
            {node.children.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <FolderTree className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Kategori Bertingkat Materi PAI
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Struktur hierarki materi: <strong>Tingkat Kelas (Fase) ➔ Bidang Keilmuan ➔ Sub-topik Pembahasan</strong>.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => openAddModal()}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Kategori Utama
        </Button>
      </div>

      {/* Categories Tree View */}
      <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
        <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Struktur Hierarki Kategori
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400">Memuat kategori...</div>
        ) : categoryTree.length === 0 ? (
          <div className="py-8 text-center text-slate-400">Belum ada kategori.</div>
        ) : (
          <div className="space-y-2">
            {categoryTree.map((root) => renderTreeItem(root, 0))}
          </div>
        )}
      </Card>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori Bertingkat'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Kategori"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Fiqih Ibadah, Aqidah Akhlak, Kelas X"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Kategori Induk (Parent)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">-- Kategori Utama (Tingkat 1 / Tanpa Induk) --</option>
              {categories
                .filter((c) => !editingCategory || c.id !== editingCategory.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent_id ? `↳ ${cat.nama}` : `[Utama] ${cat.nama}`}
                  </option>
                ))}
            </select>
          </div>

          <Input
            label="Nomor Urutan"
            type="number"
            value={urutan}
            onChange={(e) => setUrutan(parseInt(e.target.value) || 1)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus Kategori"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Menghapus kategori ini juga akan menghapus sub-kategori di bawahnya. Apakah Anda yakin?
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
