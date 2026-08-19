import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Zap,
  ListPlus,
  Layers,
  Search,
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

const R2_DOMAIN_STORAGE_KEY = 'aji_pai_r2_domain';
const DEFAULT_R2_DOMAIN = 'https://pub-d494b67231904a24a45db5300095094f.r2.dev';

export const EbookManager: React.FC = () => {
  const { ebookList, createEbook, updateEbook, deleteEbook, seedEbooks, isSeeding, isLoading } = useEbook();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EBook | null>(null);
  const [previewEbook, setPreviewEbook] = useState<EBook | null>(null);

  // Cloudflare R2 Sync States
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [r2Domain, setR2Domain] = useState(() => {
    return localStorage.getItem(R2_DOMAIN_STORAGE_KEY) || DEFAULT_R2_DOMAIN;
  });
  const [rawFilesInput, setRawFilesInput] = useState('');
  const [parsedSyncItems, setParsedSyncItems] = useState<Array<{
    judul: string;
    penulis: string;
    kategori: string;
    format: EBookFormat;
    fileUrl: string;
    coverUrl: string;
    bahasa: string;
    isDuplicate: boolean;
  }>>([]);
  const [isSyncing, setIsSyncing] = useState(false);

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
  const [formatFile, setFormatFile] = useState<EBookFormat>('epub');
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
    setFormatFile('epub');
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

  // Helper: Parse Cloudflare R2 input lines into structured books
  const handleParseR2Files = () => {
    if (!rawFilesInput.trim()) {
      toastError('Mohon masukkan nama file atau URL buku dari Cloudflare R2.');
      return;
    }

    const domain = (r2Domain.trim() || DEFAULT_R2_DOMAIN).replace(/\/+$/, '');
    localStorage.setItem(R2_DOMAIN_STORAGE_KEY, domain);

    const lines = rawFilesInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => Boolean(l));

    const results = lines.map((line) => {
      // Clean filename or full url
      let fileName = line;
      if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
        fileName = decodeURIComponent(fileName.substring(fileName.lastIndexOf('/') + 1));
      }

      // Detect format extension
      const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
      const ext = (extMatch ? extMatch[1].toLowerCase() : 'epub') as EBookFormat;
      const validFormat: EBookFormat = ['epub', 'pdf', 'mobi', 'azw3'].includes(ext) ? ext : 'epub';

      // Clean name for title (handles spaces, underscores, and dashes)
      const baseName = decodeURIComponent(fileName).replace(/\.[^/.]+$/, '');
      const cleanTitle = baseName
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      // Build full R2 direct URL (properly encoding spaces for web URLs)
      const fullUrl = line.startsWith('http')
        ? line
        : `${domain}/${encodeURIComponent(fileName.trim())}`;

      // Category detection
      let detectedCategory = 'Fikih Syafi\'i';
      const lower = cleanTitle.toLowerCase();
      if (lower.includes('modul') || lower.includes('ajar') || lower.includes('fase d') || lower.includes('smp')) {
        detectedCategory = 'Modul Kurikulum Merdeka';
      } else if (lower.includes('hadits') || lower.includes('hadis') || lower.includes('maram') || lower.includes('arbain')) {
        detectedCategory = 'Hadits Ahkam';
      } else if (lower.includes('akidah') || lower.includes('tauhid') || lower.includes('iman')) {
        detectedCategory = 'Akidah & Akhlak';
      } else if (lower.includes('tasawuf') || lower.includes('ihya') || lower.includes('hikam')) {
        detectedCategory = 'Tasawuf & Akhlak';
      } else if (lower.includes('nahwu') || lower.includes('sharaf') || lower.includes('jurumiyyah')) {
        detectedCategory = 'Gramatika Bahasa Arab';
      }

      // Check duplicate against existing list
      const isDuplicate = ebookList.some(
        (eb) => eb.file_url === fullUrl || eb.judul.toLowerCase() === cleanTitle.toLowerCase()
      );

      // Cover image preset
      let cover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
      if (detectedCategory === 'Modul Kurikulum Merdeka') {
        cover = 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80';
      } else if (detectedCategory === 'Hadits Ahkam') {
        cover = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80';
      }

      return {
        judul: cleanTitle,
        penulis: 'Aji Bagus Khoiri, S.Pd., Gr.',
        kategori: detectedCategory,
        format: validFormat,
        fileUrl: fullUrl,
        coverUrl: cover,
        bahasa: lower.includes('arab') || lower.includes('matan') ? 'Arab' : 'Indonesia',
        isDuplicate,
      };
    });

    setParsedSyncItems(results);
    success(`Berhasil mendeteksi ${results.length} file buku dari Cloudflare R2!`);
  };

  // Batch insert all parsed R2 items
  const handleExecuteBatchSync = async () => {
    const itemsToInsert = parsedSyncItems.filter((item) => !item.isDuplicate);
    if (itemsToInsert.length === 0) {
      toastError('Semua buku pada daftar sudah ada di database.');
      return;
    }

    setIsSyncing(true);
    try {
      let currentOrder = ebookList.length;
      for (const item of itemsToInsert) {
        currentOrder++;
        await createEbook({
          judul: item.judul,
          penulis_pengarang: item.penulis,
          penerbit_pentahqiq: 'Pustaka PAI Digital',
          kategori: item.kategori,
          deskripsi: `Koleksi kitab digital ${item.judul} format ${item.format.toUpperCase()} tersinkronisasi via Cloudflare R2.`,
          cover_url: item.coverUrl,
          format_file: item.format,
          file_url: item.fileUrl,
          onedrive_embed_url: null,
          tahun_terbit: new Date().getFullYear().toString(),
          jumlah_halaman: null,
          bahasa: item.bahasa,
          is_featured: true,
          is_downloadable: true,
          urutan: currentOrder,
        });
      }

      success(`Alhamdulillah! Berhasil menyinkronkan ${itemsToInsert.length} buku baru ke database!`);
      setSyncModalOpen(false);
      setRawFilesInput('');
      setParsedSyncItems([]);
    } catch (err: any) {
      toastError(`Gagal menyinkronkan: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsSyncing(false);
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
            Kelola buku digital, modul ajar, dan kitab turats dengan opsi <strong>Cloudflare R2, Google Drive, OneDrive, & EPUB Reader</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cloudflare R2 Auto-Sync Button */}
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setSyncModalOpen(true)}
            className="border-orange-500/50 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
          >
            <Zap className="w-4 h-4 mr-1.5 text-orange-500" />
            Sinkronkan R2
          </Button>

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
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button variant="primary" size="sm" onClick={() => setSyncModalOpen(true)}>
              <Zap className="w-3.5 h-3.5 mr-1" />
              Sinkronkan dari Cloudflare R2
            </Button>
            <Button variant="outline" size="sm" onClick={handleSeed}>
              Muat Data Standar
            </Button>
          </div>
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

      {/* Modal Cloudflare R2 Auto-Sync */}
      <Modal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        title="⚡ Sinkronisasi Pustaka Cloudflare R2"
        size="xl"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-orange-800 dark:text-orange-300">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Otomatisasi Pustaka dari Bucket R2</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cukup tempelkan daftar nama file buku yang sudah Anda upload di Cloudflare R2 (misal: <code>Matan_Abu_Syuja.epub</code> atau <code>Modul_PAI_Kelas7.pdf</code>). Sistem akan otomatis mengekstrak judul, format, kategori, dan menghubungkannya langsung ke database Supabase Anda!
            </p>
          </div>

          <Input
            label="Domain Publik Cloudflare R2 Anda"
            value={r2Domain}
            onChange={(e) => setR2Domain(e.target.value)}
            placeholder="https://pub-d494b67231904a24a45db5300095094f.r2.dev"
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Daftar Nama File di R2 (Satu nama file per baris)
              </label>
              <span className="text-[11px] text-slate-400">
                Contoh: <code>Matan_Abu_Syuja.epub</code>
              </span>
            </div>
            <textarea
              rows={4}
              value={rawFilesInput}
              onChange={(e) => setRawFilesInput(e.target.value)}
              placeholder="Matan_Abu_Syuja.epub&#10;Modul_Ajar_PAI_Fase_D.pdf&#10;Bulughul_Maram.mobi&#10;Safinatun_Naja.epub"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs font-mono"
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={handleParseR2Files}>
              <Search className="w-3.5 h-3.5 mr-1" />
              Pindai & Ekstrak Judul
            </Button>
          </div>

          {/* Parsed Preview Table */}
          {parsedSyncItems.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Hasil Pindaian ({parsedSyncItems.length} Buku):
                </h4>
                <span className="text-[11px] text-slate-400">
                  {parsedSyncItems.filter((i) => !i.isDuplicate).length} baru • {parsedSyncItems.filter((i) => i.isDuplicate).length} sudah ada
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {parsedSyncItems.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800">
                        {item.format}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.judul}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{item.fileUrl}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                        {item.kategori}
                      </span>
                      {item.isDuplicate ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">
                          Sudah Ada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          Siap Diimpor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSyncModalOpen(false)}>
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleExecuteBatchSync}
                  isLoading={isSyncing}
                  disabled={parsedSyncItems.filter((i) => !i.isDuplicate).length === 0}
                >
                  <Zap className="w-4 h-4 mr-1.5 text-amber-300" />
                  Simpan & Sinkronkan Semua ke Database
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

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
                <option value="epub">EPUB (E-Reader Interaktif)</option>
                <option value="pdf">PDF (Dokumen Standar)</option>
                <option value="onedrive">Google Drive / OneDrive Cloud Embed</option>
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

          {/* Direct File / Cloudflare R2 Box */}
          <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-orange-800 dark:text-orange-300">
                <Cloud className="w-4 h-4 text-orange-500" />
                <span>Tautan Cloudflare R2 / Direct File URL (EPUB, PDF, MOBI)</span>
              </div>
            </div>
            <Input
              label="Tautan Direct File / Cloudflare R2 URL"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Contoh: https://pub-d494b67231904a24a45db5300095094f.r2.dev/buku.epub"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Mendukung URL Cloudflare R2 publik Anda (<code>https://pub-d494b67231904a24a45db5300095094f.r2.dev/...</code>).
            </p>
          </div>

          {/* Cloud Embed Link (Google Drive / OneDrive) Box */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
              <Cloud className="w-4 h-4" />
              <span>Opsi Lain: Tautan Google Drive / OneDrive Embed</span>
            </div>
            <Input
              label="Tautan Share Google Drive / OneDrive Embed"
              value={onedriveUrl}
              onChange={(e) => setOnedriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view atau https://onedrive.live.com/embed?resid=..."
            />
          </div>

          {/* Direct File Upload to Supabase */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                <FileUp className="w-4 h-4 text-purple-500" />
                <span>Upload File Langsung dari Komputer ke Supabase Storage</span>
              </div>
              {uploadingFile && (
                <span className="flex items-center gap-1 text-[11px] text-purple-600 font-semibold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah...
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
                Pilih File dari Laptop (.epub, .pdf, .mobi)
              </label>
            </div>
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
