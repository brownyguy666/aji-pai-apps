import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Trash2,
  Plus,
  Eye,
  Camera,
  Layers,
  Paperclip,
  CheckCircle,
} from 'lucide-react';
import { useMateri } from '../hooks/useMateri';
import { useCategories } from '../hooks/useCategories';
import { MateriPAI, MateriFile } from '../types/database';
import { uploadImage, uploadMateriFile } from '../lib/supabase';
import { slugify, formatBytes, getFileBadgeColor } from '../lib/utils';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';

export const MateriFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const { materiList, createMateri, updateMateri, isCreating, isUpdating } = useMateri({ status: 'all' });
  const { categories } = useCategories();
  const { success, error: toastError } = useToast();

  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  const [deskripsiSingkat, setDeskripsiSingkat] = useState('');
  const [konten, setKonten] = useState('');
  const [gambarCoverUrl, setGambarCoverUrl] = useState('');
  const [kategoriId, setKategoriId] = useState<string>('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  
  const [files, setFiles] = useState<Array<{
    nama_file: string;
    file_url: string;
    tipe: string;
    ukuran_bytes?: number;
  }>>([]);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write');

  // Load existing data if edit mode
  useEffect(() => {
    if (isEdit && materiList.length > 0) {
      const existing = materiList.find((m) => m.id === id);
      if (existing) {
        setJudul(existing.judul);
        setSlug(existing.slug);
        setDeskripsiSingkat(existing.deskripsi_singkat || '');
        setKonten(existing.konten);
        setGambarCoverUrl(existing.gambar_cover_url || '');
        setKategoriId(existing.kategori_id || '');
        setStatus(existing.status);
        if (existing.files) {
          setFiles(
            existing.files.map((f) => ({
              nama_file: f.nama_file,
              file_url: f.file_url,
              tipe: f.tipe,
              ukuran_bytes: f.ukuran_bytes,
            }))
          );
        }
      }
    }
  }, [isEdit, id, materiList]);

  // Auto-generate slug when title changes in new mode
  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    if (!isEdit) {
      setSlug(slugify(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadImage(file, 'materi-covers');
      setGambarCoverUrl(url);
      success('Cover artikel berhasil diunggah!');
    } catch (err) {
      toastError('Gagal mengunggah cover artikel.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setUploadingFile(true);
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const res = await uploadMateriFile(file);
        const ext = file.name.split('.').pop() || 'file';
        setFiles((prev) => [
          ...prev,
          {
            nama_file: res.name,
            file_url: res.url,
            tipe: ext.toLowerCase(),
            ukuran_bytes: res.size,
          },
        ]);
      }
      success('File lampiran berhasil ditambahkan!');
    } catch (err) {
      toastError('Gagal mengunggah file lampiran.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      toastError('Judul materi wajib diisi.');
      return;
    }

    try {
      if (isEdit && id) {
        await updateMateri({
          id,
          materi: {
            judul,
            slug: slug || slugify(judul),
            deskripsi_singkat: deskripsiSingkat,
            konten,
            gambar_cover_url: gambarCoverUrl,
            kategori_id: kategoriId || null,
            status,
          },
          files,
        });
        success('Materi PAI berhasil diperbarui!');
      } else {
        await createMateri({
          materi: {
            judul,
            slug: slug || slugify(judul),
            deskripsi_singkat: deskripsiSingkat,
            konten,
            gambar_cover_url: gambarCoverUrl,
            kategori_id: kategoriId || null,
            status,
          },
          files,
        });
        success('Materi PAI baru berhasil diterbitkan!');
      }
      navigate('/admin/materi');
    } catch (err) {
      toastError('Terjadi kesalahan saat menyimpan materi.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/materi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Materi
        </Link>

        <h1 className="text-xl font-extrabold font-display text-slate-900 dark:text-white">
          {isEdit ? 'Edit Materi PAI' : 'Tulis Materi & Modul Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Column (8 cols): Content & Texts */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Slug */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <Input
                label="Judul Artikel / Modul Materi PAI"
                required
                value={judul}
                onChange={handleJudulChange}
                placeholder="Contoh: Memahami Konsep Fastabiqul Khairat: Kajian Q.S. Al-Maidah: 48"
              />

              <Input
                label="Slug URL (SEO)"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="memahami-konsep-fastabiqul-khairat"
                helperText={`Tautan publik: /materi/${slug || 'slug-otomatis'}`}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Ringkasan / Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={deskripsiSingkat}
                  onChange={(e) => setDeskripsiSingkat(e.target.value)}
                  placeholder="Ringkasan poin-poin utama materi untuk pengantar dan meta preview..."
                  className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </Card>

            {/* Markdown Content Editor & Live Preview */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <label className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Isi Konten Artikel (Markdown Format)
                </label>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('write')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'write'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Tulis Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('preview')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'preview'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Pratinjau Live
                  </button>
                </div>
              </div>

              {previewTab === 'write' ? (
                <div className="space-y-2">
                  <textarea
                    rows={14}
                    required
                    value={konten}
                    onChange={(e) => setKonten(e.target.value)}
                    placeholder="# Judul Bab Utama&#10;&#10;Tuliskan ayat Al-Qur'an, hadits, syarah, dan penjelasan lengkap materi di sini...&#10;&#10;## Sub-bab 1: Definisi & Hukum&#10;> Kutipan ayat atau hadits penting&#10;&#10;- Poin penting 1&#10;- Poin penting 2"
                    className="block w-full font-mono text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <p className="text-[11px] text-slate-400">
                    Mendukung format Markdown standar: # untuk Heading 1, ## Heading 2, &gt; untuk Quote Ayat, - untuk List.
                  </p>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 min-h-[300px]">
                  {konten ? (
                    konten.split('\n\n').map((p, i) => {
                      if (p.startsWith('# ')) return <h1 key={i}>{p.replace('# ', '')}</h1>;
                      if (p.startsWith('## ')) return <h2 key={i}>{p.replace('## ', '')}</h2>;
                      if (p.startsWith('> ')) return <blockquote key={i}>{p.replace('> ', '')}</blockquote>;
                      return <p key={i}>{p}</p>;
                    })
                  ) : (
                    <p className="text-slate-400 italic">Belum ada konten untuk dipratinjau.</p>
                  )}
                </div>
              )}
            </Card>

            {/* File Attachments Uploader */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-brand-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    File Lampiran untuk Diunduh Siswa (PDF, PPT, Word, Excel)
                  </h3>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{uploadingFile ? 'Mengunggah...' : 'Tambah File Lampiran'}</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                    onChange={handleAttachmentUpload}
                    className="sr-only"
                    disabled={uploadingFile}
                  />
                </label>
              </div>

              {files.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <p className="text-xs text-slate-500">Belum ada file lampiran yang diunggah.</p>
                  <p className="text-[11px] text-slate-400">
                    Siswa dapat mengunduh modul ajar, lembar kerja (LKPD), atau slide presentasi yang Anda lampirkan di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {file.nama_file}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className={`px-1.5 py-0.2 rounded font-bold uppercase border ${getFileBadgeColor(file.tipe)}`}>
                              {file.tipe}
                            </span>
                            {file.ukuran_bytes ? <span>{formatBytes(file.ukuran_bytes)}</span> : null}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                        title="Hapus file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Column (4 cols): Meta, Categories & Settings */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Publish & Status Card */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Publikasi & Visibilitas
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Status Publikasi
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold"
                >
                  <option value="published">Tayang untuk Publik (Published)</option>
                  <option value="draft">Simpan sebagai Draf (Draft)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isCreating || isUpdating}
                className="w-full justify-center shadow-lg shadow-brand-600/20 font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Simpan Perubahan' : 'Terbitkan Materi'}
              </Button>
            </Card>

            {/* Hierarchical Category Selector */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-brand-600" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Pilih Kategori Bertingkat
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Kategori Materi
                </label>
                <select
                  value={kategoriId}
                  onChange={(e) => setKategoriId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                >
                  <option value="">-- Pilih Kategori Elemen --</option>
                  {categories
                    .filter((c) => !c.parent_id)
                    .map((topCat) => {
                      const childCats = categories.filter((c) => c.parent_id === topCat.id);
                      if (childCats.length > 0) {
                        return (
                          <optgroup key={topCat.id} label={topCat.nama}>
                            {childCats.map((child) => (
                              <option key={child.id} value={child.id}>
                                {child.nama}
                              </option>
                            ))}
                          </optgroup>
                        );
                      }
                      return (
                        <option key={topCat.id} value={topCat.id}>
                          {topCat.nama}
                        </option>
                      );
                    })}
                </select>
                <p className="text-[11px] text-slate-400">
                  Pilih elemen pembelajaran PAI sesuai tingkatan kelas (Fase D).
                </p>
              </div>
            </Card>

            {/* Cover Photo Uploader */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Gambar Cover Artikel
              </h3>

              <div className="space-y-3">
                {gambarCoverUrl ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <img
                      src={gambarCoverUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 text-xs gap-1 border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Camera className="w-6 h-6" />
                    <span>Belum ada gambar cover</span>
                  </div>
                )}

                <label className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingCover ? 'Mengunggah...' : 'Pilih File Cover'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="sr-only"
                    disabled={uploadingCover}
                  />
                </label>
              </div>
            </Card>

          </div>

        </div>
      </form>
    </div>
  );
};
