import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Download,
  ExternalLink,
  Sparkles,
  Bookmark,
  FileText,
  Calendar,
  Cloud,
  CheckCircle,
  UploadCloud,
  FileUp,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useEbook } from '../hooks/useEbook';
import { EBook, EBookFormat } from '../types/database';
import { EbookReaderModal } from '../components/ebook/EbookReaderModal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { uploadEbookFile, uploadImage } from '../lib/supabase';

export const EbookManager: React.FC = () => {
  const { ebookList, createEbook, updateEbook, deleteEbook, seedEbooks, isSeeding, isLoading } = useEbook();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EBook | null>(null);
  const [previewEbook, setPreviewEbook] = useState<EBook | null>(null);

  // Upload progress states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form states
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('');
  const [penerbit, setPenerbit] = useState('');
  const [kategori, setKategori] = useState('Fikih Syafi\'i');
  const [deskripsi, setDeskripsi] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [formatFile, setFormatFile] = useState<EBookFormat>('onedrive');
  const [fileUrl, setFileUrl] = useState('');
  const [onedriveUrl, setOnedriveUrl] = useState('');
  const [tahunTerbit, setTahunTerbit] = useState('2024');
  const [jumlahHalaman, setJumlahHalaman] = useState<string>('');
  const [bahasa, setBahasa] = useState('Indonesia');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isDownloadable, setIsDownloadable] = useState(true);
  const [urutan, setUrutan] = useState<number>(0);

  const openCreateModal = () => {
    setEditingItem(null);
    setJudul('');
    setPenulis('Aji Bagus Khoiri, S.Pd., Gr.');
    setPenerbit('');
    setKategori('Fikih Syafi\'i');
    setDeskripsi('');
    setCoverUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
    setFormatFile('onedrive');
    setFileUrl('');
    setOnedriveUrl('');
    setTahunTerbit(new Date().getFullYear().toString());
    setJumlahHalaman('');
    setBahasa('Indonesia');
    setIsFeatured(true);
    setIsDownloadable(true);
    setUrutan(ebookList.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (item: EBook) => {
    setEditingItem(item);
    setJudul(item.judul);
    setPenulis(item.penulis_pengarang);
    setPenerbit(item.penerbit_pentahqiq || '');
    setKategori(item.kategori);
    setDeskripsi(item.deskripsi || '');
    setCoverUrl(item.cover_url || '');
    setFormatFile(item.format_file);
    setFileUrl(item.file_url || '');
    setOnedriveUrl(item.onedrive_embed_url || '');
    setTahunTerbit(item.tahun_terbit ? item.tahun_terbit.toString() : '');
    setJumlahHalaman(item.jumlah_halaman ? item.jumlah_halaman.toString() : '');
    setBahasa(item.bahasa);
    setIsFeatured(item.is_featured);
    setIsDownloadable(item.is_downloadable ?? true);
    setUrutan(item.urutan || 1);
    setModalOpen(true);
  };

  // Upload book file (EPUB, PDF, MOBI, AZW3)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const res = await uploadEbookFile(file);
      setFileUrl(res.url);

      // Auto-detect format from extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'epub') setFormatFile('epub');
      else if (ext === 'pdf') setFormatFile('pdf');
      else if (ext === 'mobi') setFormatFile('mobi');
      else if (ext === 'azw3') setFormatFile('azw3');

      success(`File ${file.name} berhasil diunggah ke Supabase Storage!`);
    } catch (err: any) {
      toastError(`Gagal mengunggah file: ${err.message || 'Error koneksi storage'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  // Upload cover image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadImage(file, 'ebook-covers');
      setCoverUrl(url);
      success('Gambar cover berhasil diunggah!');
    } catch (err: any) {
      toastError('Gagal mengunggah cover.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !penulis.trim()) return;

    try {
      if (editingItem) {
        await updateEbook({
          id: editingItem.id,
          updates: {
            judul,
            penulis_pengarang: penulis,
            penerbit_pentahqiq: penerbit || null,
            kategori,
            deskripsi: deskripsi || null,
            cover_url: coverUrl || null,
            format_file: formatFile,
            file_url: fileUrl || null,
            onedrive_embed_url: onedriveUrl || null,
            tahun_terbit: tahunTerbit || null,
            jumlah_halaman: jumlahHalaman ? Number(jumlahHalaman) : null,
            bahasa,
            is_featured: isFeatured,
            is_downloadable: isDownloadable,
            urutan: Number(urutan),
          },
        });
        success('Data e-book berhasil diperbarui!');
      } else {
        await createEbook({
          judul,
          penulis_pengarang: penulis,
          penerbit_pentahqiq: penerbit || null,
          kategori,
          deskripsi: deskripsi || null,
          cover_url: coverUrl || null,
          format_file: formatFile,
          file_url: fileUrl || null,
          onedrive_embed_url: onedriveUrl || null,
          tahun_terbit: tahunTerbit || null,
          jumlah_halaman: jumlahHalaman ? Number(jumlahHalaman) : null,
          bahasa,
          is_featured: isFeatured,
          is_downloadable: isDownloadable,
          urutan: Number(urutan),
        });
        success('E-Book baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch (err) {
      toastError('Terjadi kesalahan saat menyimpan e-book.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus e-book ini?')) return;
    try {
      await deleteEbook(id);
      success('E-Book berhasil dihapus!');
    } catch {
      toastError('Gagal menghapus e-book.');
    }
  };

  const handleSeed = async () => {
    try {
      await seedEbooks();
      success('Koleksi e-book standar berhasil dimuat ke Supabase!');
    } catch {
      toastError('Gagal memuat e-book standar.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Pustaka E-Book & Kitab Digital
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola buku digital, modul ajar, dan kitab turats dengan opsi <strong>Google Drive, OneDrive, Upload EPUB/PDF, MOBI, & AZW3</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="md" onClick={handleSeed} isLoading={isSeeding}>
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
            Muat Data Standar
          </Button>
          <Button type="button" variant="primary" size="md" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah E-Book Baru
          </Button>
        </div>
      </div>

      {/* E-Book List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : ebookList.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-white dark:bg-slate-900">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Belum ada koleksi e-book di database.
          </h3>
          <Button variant="outline" size="sm" onClick={handleSeed}>
            Muat Data Standar
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ebookList.map((book) => (
            <Card
              key={book.id}
              className="p-4 flex gap-4 bg-white dark:bg-slate-900 border hover:shadow-md transition-all"
            >
              {/* Cover Thumbnail */}
              <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border relative">
                <img
                  src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                  alt={book.judul}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-900/80 text-white backdrop-blur-sm">
                  {book.format_file}
                </span>
              </div>

              {/* Meta & Actions */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      {book.kategori}
                    </span>
                    {book.is_featured && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                        Unggulan
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display line-clamp-1">
                    {book.judul}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {book.penulis_pengarang}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                    <span>{book.bahasa}</span>
                    {book.jumlah_halaman && <span>• {book.jumlah_halaman} Hlm</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewEbook(book)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-500"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Uji Baca</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(book)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(book.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add / Edit E-Book */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Informasi E-Book' : 'Tambah E-Book Baru'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul E-Book / Kitab"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Matan Al-Ghayah wa At-Taqrib"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Penulis / Pengarang Asli"
              required
              value={penulis}
              onChange={(e) => setPenulis(e.target.value)}
              placeholder="Contoh: Al-Qadhi Abu Syuja'"
            />

            <Input
              label="Penerbit / Pentahqiq / Penerjemah"
              value={penerbit}
              onChange={(e) => setPenerbit(e.target.value)}
              placeholder="Contoh: Aji Bagus Khoiri, S.Pd., Gr."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Format Pembaca Utama
              </label>
              <select
                value={formatFile}
                onChange={(e) => setFormatFile(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-semibold"
              >
                <option value="onedrive">Google Drive / OneDrive Cloud Embed (Sangat Direkomendasikan)</option>
                <option value="pdf">PDF (Dokumen Standar)</option>
                <option value="epub">EPUB (E-Reader Interaktif)</option>
                <option value="mobi">MOBI (Amazon Kindle)</option>
                <option value="azw3">AZW3 (Kindle KF8)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Kategori Keilmuan
              </label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="Fikih Syafi'i / Modul PAI"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Bahasa
              </label>
              <select
                value={bahasa}
                onChange={(e) => setBahasa(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm"
              >
                <option value="Indonesia">Bahasa Indonesia</option>
                <option value="Arab">Bahasa Arab</option>
                <option value="Bilingual">Bilingual (Arab - Indo)</option>
                <option value="Pegon">Arab Pegon</option>
              </select>
            </div>
          </div>

          {/* Cloud Embed Link (Google Drive / OneDrive) Box */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
              <Cloud className="w-4 h-4" />
              <span>Opsi 1: Tautan Google Drive / OneDrive Embed (100% Cepat & Bebas Error)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cukup tempel link share Google Drive biasa (misal: <code>https://drive.google.com/file/d/.../view</code>) atau link Microsoft OneDrive. Sistem otomatis mengonversinya menjadi dokumen interaktif.
            </p>
            <Input
              label="Tautan Share Google Drive / OneDrive Embed"
              value={onedriveUrl}
              onChange={(e) => setOnedriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view atau https://onedrive.live.com/embed?resid=..."
            />
          </div>

          {/* Direct File Upload & URL Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                <FileUp className="w-4 h-4 text-purple-500" />
                <span>Opsi 2: Upload File E-Book Langsung (EPUB / PDF / MOBI ke Supabase Storage)</span>
              </div>
              {uploadingFile && (
                <span className="flex items-center gap-1 text-[11px] text-purple-600 font-semibold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah file...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                id="ebook-file-input"
                accept=".epub,.pdf,.mobi,.azw3"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="ebook-file-input"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                Pilih File Dokumen (.epub, .pdf, .mobi)
              </label>
              {fileUrl && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono truncate max-w-xs flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Terunggah
                </span>
              )}
            </div>

            <Input
              label="Tautan Direct File / Cloudflare R2 URL (EPUB / PDF / MOBI)"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Contoh: https://pub-xxxx.r2.dev/buku-matan-taqrib.epub"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Mendukung Cloudflare R2 (<code>https://pub-xxx.r2.dev/...</code>), Supabase Storage, atau URL direct download file lainnya.
            </p>
          </div>

          {/* Cover Image Upload & URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Gambar Sampul / Cover
              </label>
              {uploadingCover && (
                <span className="flex items-center gap-1 text-[11px] text-brand-600 font-semibold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah cover...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                id="cover-file-input"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <label
                htmlFor="cover-file-input"
                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Upload Cover dari Komputer
              </label>
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Preview"
                  className="w-8 h-10 object-cover rounded border"
                />
              )}
            </div>

            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Input
              label="Tahun Terbit"
              value={tahunTerbit}
              onChange={(e) => setTahunTerbit(e.target.value)}
              placeholder="2024"
            />
            <Input
              label="Jumlah Halaman"
              type="number"
              value={jumlahHalaman}
              onChange={(e) => setJumlahHalaman(e.target.value)}
              placeholder="150"
            />
            <Input
              label="Nomor Urutan"
              type="number"
              value={urutan.toString()}
              onChange={(e) => setUrutan(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Deskripsi & Sinopsis Singkat
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ringkasan isi kitab, pokok bahasan, dan target pembaca..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Tampilkan di Section Beranda (Unggulan)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={isDownloadable}
                onChange={(e) => setIsDownloadable(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Izinkan Pengunjung Mengunduh File</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Simpan Perubahan' : 'Terbitkan E-Book'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Live Preview Modal */}
      {previewEbook && (
        <EbookReaderModal
          isOpen={Boolean(previewEbook)}
          onClose={() => setPreviewEbook(null)}
          ebook={previewEbook}
        />
      )}
    </div>
  );
};
