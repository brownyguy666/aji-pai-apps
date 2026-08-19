import React, { useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { YoutubeIcon } from '../components/ui/Icons';
import { useYouTube } from '../hooks/useYouTube';
import { YouTubeVideo } from '../types/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { fetchYouTubeChannelVideos, syncVideosToDatabase, FetchedYouTubeVideo } from '../lib/youtubeSync';

export const YouTubeManager: React.FC = () => {
  const { videos, isLoading, createVideo, updateVideo, deleteVideo, refetch } = useYouTube();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YouTubeVideo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync state
  const [channelIdInput, setChannelIdInput] = useState('UCntpnPCycMUUtU34ztu_PtQ');
  const [isFetchingSync, setIsFetchingSync] = useState(false);
  const [isSavingSync, setIsSavingSync] = useState(false);
  const [fetchedVideos, setFetchedVideos] = useState<FetchedYouTubeVideo[]>([]);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

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

  // Trigger Fetch from YouTube RSS Feed
  const handleFetchChannelVideos = async () => {
    setIsFetchingSync(true);
    try {
      const items = await fetchYouTubeChannelVideos(channelIdInput);
      setFetchedVideos(items);
      setSelectedVideoIds(items.map((v) => v.video_id)); // select all by default
      setSyncModalOpen(true);
      success(`Ditemukan ${items.length} video terbaru dari channel!`);
    } catch (err: any) {
      toastError(err.message || 'Gagal mengambil video dari channel YouTube.');
    } finally {
      setIsFetchingSync(false);
    }
  };

  // Save Selected Videos to Database
  const handleSaveSelectedVideos = async () => {
    setIsSavingSync(true);
    try {
      const toSave = fetchedVideos.filter((v) => selectedVideoIds.includes(v.video_id));
      const newCount = await syncVideosToDatabase(toSave);
      await refetch();
      success(`Berhasil menyinkronkan ${newCount} video baru ke database!`);
      setSyncModalOpen(false);
    } catch (err) {
      toastError('Gagal menyimpan video hasil sinkronisasi.');
    } finally {
      setIsSavingSync(false);
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
            Sinkronkan video langsung dari channel YouTube <strong>@ZonaBelajarID</strong> atau tambahkan video secara manual.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={handleFetchChannelVideos}
            isLoading={isFetchingSync}
            className="border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sinkronkan @ZonaBelajarID
          </Button>

          <Button variant="primary" size="md" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Manual
          </Button>
        </div>
      </div>

      {/* Auto-Sync Quick Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-900/10 via-brand-50/50 to-slate-100 dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900 border border-red-200/80 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
            <YoutubeIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              Channel Terhubung: @ZonaBelajarID
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
                Auto-Sync Aktif
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ID Channel: <code className="text-red-600 dark:text-red-400 font-mono font-bold">UCntpnPCycMUUtU34ztu_PtQ</code>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleFetchChannelVideos}
          isLoading={isFetchingSync}
          className="shrink-0 bg-white dark:bg-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Tarik Video Terbaru
        </Button>
      </div>

      {/* Grid of Videos */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400">Memuat video...</div>
      ) : videos.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 space-y-3">
          <p>Belum ada video pada database.</p>
          <Button variant="primary" size="sm" onClick={handleFetchChannelVideos}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tarik Video dari Channel Sekarang
          </Button>
        </Card>
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
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
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

      {/* Sync Channel Modal Preview */}
      <Modal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        title="Hasil Penarikan Video dari Channel @ZonaBelajarID"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Pilih video yang ingin diimpor atau diperbarui ke dalam database landing page Anda:
          </p>

          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
            {fetchedVideos.map((v) => {
              const isSelected = selectedVideoIds.includes(v.video_id);
              const alreadyInDb = videos.some((dbV) => dbV.video_id === v.video_id);

              return (
                <div
                  key={v.video_id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedVideoIds(selectedVideoIds.filter((id) => id !== v.video_id));
                    } else {
                      setSelectedVideoIds([...selectedVideoIds, v.video_id]);
                    }
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-50/70 dark:bg-red-950/40 border-red-400 dark:border-red-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by parent onClick
                    className="w-4 h-4 text-red-600 rounded cursor-pointer"
                  />

                  <img
                    src={v.thumbnail_url}
                    alt={v.title}
                    className="w-24 h-14 object-cover rounded-xl shrink-0 bg-slate-900"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {v.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>Rilis: {v.published_at}</span>
                      {alreadyInDb && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Sudah ada di database
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-medium">
              {selectedVideoIds.length} video dipilih
            </span>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setSyncModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSelectedVideos}
                isLoading={isSavingSync}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Simpan ke Database
              </Button>
            </div>
          </div>
        </div>
      </Modal>

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
            placeholder="Contoh: jxwfYMReHYY atau https://www.youtube.com/watch?v=..."
            helperText="Sistem akan otomatis mengekstrak ID video dan thumbnail resmi dari YouTube."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Publikasi (Opsional)"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              placeholder="Contoh: 2026-06-11"
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
