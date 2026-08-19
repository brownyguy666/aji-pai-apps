import React, { useState } from 'react';
import { Plus, Edit, Trash2, Play, ExternalLink } from 'lucide-react';
import { YoutubeIcon } from '../components/ui/Icons';
import { useYouTube } from '../hooks/useYouTube';
import { YouTubeVideo } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export const YouTubeManager: React.FC = () => {
  const { videos, isLoading, createVideo, updateVideo, deleteVideo } = useYouTube();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YouTubeVideo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    video_id: '',
    thumbnail_url: '',
    published_at: '',
    urutan: 1,
    is_featured: true,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      video_id: '',
      thumbnail_url: '',
      published_at: new Date().toISOString().split('T')[0],
      urutan: videos.length + 1,
      is_featured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: YouTubeVideo) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      video_id: item.video_id,
      thumbnail_url: item.thumbnail_url || '',
      published_at: item.published_at || '',
      urutan: item.urutan,
      is_featured: item.is_featured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.video_id.trim()) {
      toastError('Judul dan ID / Link video YouTube wajib diisi.');
      return;
    }

    try {
      if (editingItem) {
        await updateVideo({
          id: editingItem.id,
          ...formData,
        });
        success('Video YouTube berhasil diperbarui!');
      } else {
        await createVideo(formData);
        success('Video YouTube berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch (err) {
      toastError('Gagal menyimpan video YouTube.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteVideo(deletingId);
      success('Video YouTube berhasil dihapus.');
      setDeletingId(null);
    } catch (err) {
      toastError('Gagal menghapus video.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600">
              <YoutubeIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Manajemen Video YouTube Edukasi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tambahkan ID atau tautan video YouTube untuk ditampilkan pada grid landing page publik.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Video YouTube
        </Button>
      </div>

      {/* Grid of Videos */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400">Memuat video...</div>
      ) : videos.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">Belum ada video ditambahkan.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={
                      item.thumbnail_url ||
                      `https://img.youtube.com/vi/${item.video_id}/maxresdefault.jpg`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-white font-mono">
                    ID: {item.video_id}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h3>
                  {item.published_at && (
                    <p className="text-xs text-slate-400">Rilis: {item.published_at}</p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400 font-mono">Urutan #{item.urutan}</span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://youtube.com/watch?v=${item.video_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    title="Buka di YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
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
        title={editingItem ? 'Edit Video YouTube' : 'Tambah Video YouTube'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Video YouTube"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Kajian Tafsir Surah Al-Ma'idah Ayat 48"
          />

          <Input
            label="ID Video atau Link YouTube Lengkap"
            required
            value={formData.video_id}
            onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
            placeholder="Contoh: dQw4w9WgXcQ atau https://www.youtube.com/watch?v=..."
            helperText="Sistem akan otomatis mengekstrak ID video dan thumbnail resmi dari YouTube."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Publikasi (Opsional)"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              placeholder="Contoh: 12 Mei 2024"
            />
            <Input
              label="Nomor Urutan"
              type="number"
              value={formData.urutan}
              onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Simpan Perubahan' : 'Tambah Video'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus Video YouTube"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus video ini dari kurasi?
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
